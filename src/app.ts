import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { BookService } from './services/bookService';
import { BookRepository } from './repositories/bookRepository';
import { AppConnection } from './infrastructure/typeorm.config';
import bookRoutes from './routes/bookRoutes'; // Import the modified routes

// Function to create and configure the Express app
export const createApp = async (): Promise<Application> => {
    // Initialize the Express app
    const app: Application = express();

    // Middleware configuration
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());
    app.use(cors());

    // Use Morgan for request logging in development mode
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Initialize the connection, repository, and service
    const connection = await AppConnection;
    if (!connection.isConnected) {
        await connection.connect();
    }

    const bookRepository = new BookRepository(connection);
    const bookService = new BookService(bookRepository);

    // Routes
    app.use('/books', bookRoutes(bookService)); // Pass bookService to bookRoutes

    // 404 Route Handler
    app.use((req, res, next) => {
        res.status(404).json({ message: 'Resource not found' });
    });

    // Global Error Handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err.stack);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    });

    return app;
};
