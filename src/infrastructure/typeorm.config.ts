import { createConnection, Connection } from 'typeorm';
import { Book } from '../entity/Book';

const isTestEnv = process.env.NODE_ENV === 'test';

export const AppConnection: Promise<Connection> = createConnection({
    type: 'sqlite',
    database: isTestEnv ? ':memory:' : './database.sqlite', // Use in-memory database for testing
    synchronize: true,  // Automatically sync schema (use cautiously in production)
    logging: false,
    dropSchema: isTestEnv,
    entities: [Book],
    migrations: [],
    subscribers: [],
});
