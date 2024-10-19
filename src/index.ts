// index.ts
import 'reflect-metadata';
import { createApp } from './app'; // Import the createApp function
import { Server } from 'http';
import {AppConnection} from "./infrastructure/typeorm.config";

//Use env port for testing just in case API is running
const PORT = process.env.PORT || 3000;
let server: Server; // Declare server variable for later shutdown
const isTestEnv = process.env.NODE_ENV === 'test';

// Function to start the server and establish the database connection
const startServer = async () => {
    try {
        // Wait for the app to be fully initialized
        const app = await createApp();

        if (!isTestEnv) {
            console.log("Starting API...");
        }

        // Start the Express server
        server = app.listen(PORT, () => {
            //Hide unnecessary logs in Test env
            if (!isTestEnv) {
                console.log(`Bookstore API running on port: ${PORT}`);
            }
        });

    } catch (error) {
        console.error("Error starting the server or establishing the database connection:", error);
        process.exit(1); // Exit if something fails during startup
    }
};

// Gracefully shut down the server and database on app termination
const shutdown = async () => {
    console.log('Shutting down the server...');
    if (server) {
        server.close(async () => {
            console.log('HTTP server closed');
            const connection = await AppConnection;
            if (connection.isConnected) {
                await connection.close();
                console.log('Database connection closed');
            }
            process.exit(0); // Exit the process after closing server and DB connection
        });
    }
};


// Handle termination signals
process.on('SIGINT', shutdown);  // Handle Ctrl+C
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    void shutdown();
});

void startServer(); // Invoke the startup logic
