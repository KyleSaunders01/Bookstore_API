import 'reflect-metadata';
import { createApp } from './app';
import { Server } from 'http';
import {AppConnection} from "./infrastructure/typeorm.config";


const PORT = process.env.PORT || 3000;
let server: Server;
const isTestEnv = process.env.NODE_ENV === 'test';

const startServer = async () => {
    try {
        const app = await createApp();

        if (!isTestEnv) {
            console.log("Starting API...");
        }

        server = app.listen(PORT, () => {
            if (!isTestEnv) {
                console.log(`Bookstore API running on port: ${PORT}`);
            }
        });

    } catch (error) {
        console.error("Error starting the server or establishing the database connection:", error);
        process.exit(1);
    }
};

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
            process.exit(0);
        });
    }
};


process.on('SIGINT', shutdown);
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    void shutdown();
});

void startServer();
