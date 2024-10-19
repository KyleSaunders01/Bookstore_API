import { Repository, Connection } from 'typeorm';
import { Book } from '../entity/Book';

export class BookRepository {
    private bookRepo: Repository<Book>;

    constructor(connection: Connection) {
        this.bookRepo = connection.getRepository(Book);
    }

    async create(bookData: Partial<Book>): Promise<Book> {
        try {
            const book = this.bookRepo.create(bookData);
            return await this.bookRepo.save(book);
        } catch (error) {
            console.error("Error creating book:", error);
            throw new Error("Database error while creating the book");
        }
    }

    async findById(id: number): Promise<Book | undefined> {
        try {
            return await this.bookRepo.findOne({ where: { id } });
        } catch (error) {
            console.error(`Error fetching book by ID ${id}:`, error);
            throw new Error("Database error while fetching the book by ID");
        }
    }

    async update(id: number, updatedData: Partial<Book>): Promise<Book | undefined> {
        try {
            await this.bookRepo.update(id, updatedData);
            return await this.bookRepo.findOne({ where: { id } });
        } catch (error) {
            console.error(`Error updating book with ID ${id}:`, error);
            throw new Error("Database error while updating the book");
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.bookRepo.delete(id);
        } catch (error) {
            console.error(`Error deleting book with ID ${id}:`, error);
            throw new Error("Database error while deleting the book");
        }
    }

    async findByGenre(genre: string): Promise<Book[]> {
        try {
            return await this.bookRepo.find({ where: { genre } });
        } catch (error) {
            console.error(`Error fetching books by genre ${genre}:`, error);
            throw new Error("Database error while fetching books by genre");
        }
    }

    async getAllBooks(): Promise<Book[]> {
        try {
            return await this.bookRepo.find();
        } catch (error) {
            console.error("Error fetching all books:", error);
            throw new Error("Database error while fetching all books");
        }
    }
}
