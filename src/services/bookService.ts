import { BookRepository } from '../repositories/bookRepository';
import { Book } from '../entity/Book';

export class BookService {
    private bookRepository: BookRepository;

    constructor(bookRepository: BookRepository) {
        this.bookRepository = bookRepository;
    }

    // Create a new book
    async createBook(bookData: Partial<Book>): Promise<Book> {
        try {
            return await this.bookRepository.create(bookData);
        } catch (error) {
            console.error("Error in BookService.createBook:", error);
            throw new Error("Failed to create the book");
        }
    }

    // Find a book by its ID
    async getBookById(id: number): Promise<Book | undefined> {
        try {
            const book = await this.bookRepository.findById(id);
            if (!book) {
                throw new Error(`Book with ID ${id} not found`);
            }
            return book;
        } catch (error) {
            console.error(`Error in BookService.getBookById (ID: ${id}):`, error);
            throw new Error("Failed to fetch the book");
        }
    }

    // Update a book by its ID
    async updateBook(id: number, updatedBook: Partial<Book>): Promise<Book | undefined> {
        try {
            const updatedBookResult = await this.bookRepository.update(id, updatedBook);
            if (!updatedBookResult) {
                throw new Error(`Book with ID ${id} not found for update`);
            }
            return updatedBookResult;
        } catch (error) {
            console.error(`Error in BookService.updateBook (ID: ${id}):`, error);
            throw new Error("Failed to update the book");
        }
    }

    // Delete a book by its ID
    async deleteBook(id: number): Promise<Book | undefined> {
        try {
            // Check if the book exists
            const book = await this.bookRepository.findById(id);
            if (!book) {
                throw new Error(`Book with ID ${id} not found`);
            }

            // If the book exists, proceed to delete
            await this.bookRepository.delete(id);
            return book;
        } catch (error) {
            console.error(`Error in BookService.deleteBook (ID: ${id}):`, error);
            throw new Error("Failed to delete the book");
        }
    }

    // Find books by genre
    async getBooksByGenre(genre: string): Promise<Book[]> {
        try {
            return await this.bookRepository.findByGenre(genre);
        } catch (error) {
            console.error(`Error in BookService.getBooksByGenre (Genre: ${genre}):`, error);
            throw new Error("Failed to fetch books by genre");
        }
    }

    // Get all books
    async getAllBooks(): Promise<Book[]> {
        try {
            return await this.bookRepository.getAllBooks();
        } catch (error) {
            console.error("Error in BookService.getAllBooks:", error);
            throw new Error("Failed to fetch all books");
        }
    }

    // Calculate Total Discounted Price of Book by Genre using a Discount Percentage
    async getTotalDiscountedPriceByGenre(genre: string, discountPercentage: number): Promise<number> {
        try {
            const books = await this.getBooksByGenre(genre);
            const totalOriginalPrice = books.reduce((sum: number, book: Book) => sum + parseFloat(book.price.toString()), 0);
            const totalDiscountedPrice = totalOriginalPrice - (discountPercentage / 100) * totalOriginalPrice;
            return parseFloat(totalDiscountedPrice.toFixed(2));
        } catch (error) {
            console.error(`Error in BookService.getTotalDiscountedPriceByGenre (Genre: ${genre}):`, error);
            throw new Error("Failed to calculate total discounted price");
        }
    }
}
