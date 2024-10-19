import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { BookService } from './services/bookService';
import { BookRepository } from './repositories/bookRepository';
import { AppConnection } from './infrastructure/typeorm.config';
import bookRoutes from './routes/bookRoutes';

export const createApp = async (): Promise<Application> => {
    const app: Application = express();

    // Middleware configuration
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());
    app.use(cors());

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    const connection = await AppConnection;
    if (!connection.isConnected) {
        await connection.connect();
    }

    const bookRepository = new BookRepository(connection);
    const bookService = new BookService(bookRepository);

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
