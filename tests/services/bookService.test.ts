import { expect } from 'chai';
import sinon from 'sinon';
import { BookRepository } from "../../src/repositories/bookRepository";
import { BookService } from "../../src/services/bookService";

describe('Book Service', () => {
    let bookRepositoryStub: sinon.SinonStubbedInstance<BookRepository>;
    let bookService: BookService;

    beforeEach(() => {
        // Stub the BookRepository
        bookRepositoryStub = sinon.createStubInstance(BookRepository);

        // Initialize the BookService with the stubbed repository
        bookService = new BookService(bookRepositoryStub as unknown as BookRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('Create Book', () => {
        it('should create a new book successfully', async () => {
            const bookData = { title: 'Test Book 1', author: 'Test Author', genre: 'Test Genre', price: 100 };
            const createdBook = { id: 1, ...bookData };

            bookRepositoryStub.create.resolves(createdBook);

            const result = await bookService.createBook(bookData);
            expect(result).to.deep.equal(createdBook);
            expect(bookRepositoryStub.create).to.have.been.calledWith(bookData);
        });

        it('should fail when creating a book with invalid data', async () => {
            const invalidData = { title: '', author: '', genre: '', price: NaN };

            bookRepositoryStub.create.rejects(new Error('Failed to create the book'));

            try {
                await bookService.createBook(invalidData);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    expect(error.message).to.include('Failed to create the book');
                } else {
                    throw new Error('Unexpected error type');
                }
            }
        });
    });

    describe('Get Book By Id', () => {
        it('should retrieve a book with a valid id', async () => {
            const book = { id: 1, title: 'Test Book', author: 'Test Author', genre: 'SciFi', price: 50 };

            bookRepositoryStub.findById.resolves(book);

            const result = await bookService.getBookById(1);
            expect(result).to.deep.equal(book);
            expect(bookRepositoryStub.findById).to.have.been.calledWith(1);
        });

        it('should fail when an invalid id is provided', async () => {
            bookRepositoryStub.findById.rejects(new Error('Failed to fetch the book'));

            try {
                await bookService.getBookById(9999); // Non-existing ID
            } catch (error: unknown) {
                if (error instanceof Error) {
                    expect(error.message).to.include('Failed to fetch the book');
                } else {
                    throw new Error('Unexpected error type');
                }
            }
        });
    });

    describe('Update Book', () => {
        it('should update a book\'s details', async () => {
            const updatedBook = { id: 1, title: 'Updated Title', author: 'Author', genre: 'Fiction', price: 80 };

            bookRepositoryStub.update.resolves(updatedBook);

            const result = await bookService.updateBook(1, updatedBook);
            expect(result).to.deep.equal(updatedBook);
            expect(bookRepositoryStub.update).to.have.been.calledWith(1, updatedBook);
        });

        it('should fail to update with an invalid id', async () => {
            bookRepositoryStub.update.rejects(new Error('Failed to update the book'));

            try {
                await bookService.updateBook(9999, { title: 'Invalid Update' });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    expect(error.message).to.include('Failed to update the book');
                } else {
                    throw new Error('Unexpected error type');
                }
            }
        });
    });

    describe('Delete Book', () => {
        it('should delete a book by id', async () => {
            const book = { id: 1, title: 'Delete Book', author: 'Test Author', genre: 'NonFiction', price: 60 };

            // Stub the findById to return the book
            bookRepositoryStub.findById.resolves(book);

            // Stub the delete to resolve successfully
            bookRepositoryStub.delete.resolves();

            const result = await bookService.deleteBook(1);

            expect(result).to.deep.equal(book);  // Should return the deleted book
            expect(bookRepositoryStub.findById).to.have.been.calledWith(1);  // Check existence first
            expect(bookRepositoryStub.delete).to.have.been.calledWith(1);    // Proceed with deletion
        });

        it('should fail to delete with an invalid id', async () => {
            // Stub findById to resolve undefined for an invalid ID
            bookRepositoryStub.findById.resolves(undefined);

            try {
                await bookService.deleteBook(9999);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    expect(error.message).to.include('Failed to delete the book');
                } else {
                    throw new Error('Unexpected error type');
                }
            }

            expect(bookRepositoryStub.findById).to.have.been.calledWith(9999);  // Ensure findById was called
            expect(bookRepositoryStub.delete).to.not.have.been.called;         // Ensure delete was not called
        });
    });


    describe('Get Books By Genre', () => {
        it('should retrieve books by genre', async () => {
            const books = [
                { id: 1, title: 'Genre Book 1', author: 'Test Author 1', genre: 'Fantasy', price: 100 },
                { id: 2, title: 'Genre Book 2', author: 'Test Author 2', genre: 'Fantasy', price: 120 },
            ];

            // Stub the findByGenre to return the books
            bookRepositoryStub.findByGenre.resolves(books);

            const result = await bookService.getBooksByGenre('Fantasy');
            expect(result).to.deep.equal(books);
            expect(bookRepositoryStub.findByGenre).to.have.been.calledWith('Fantasy');
        });

        it('should return an empty array if genre does not exist', async () => {
            // Stub findByGenre to resolve empty array if genre does not exist
            bookRepositoryStub.findByGenre.resolves([]);

            const result = await bookService.getBooksByGenre('NonExistingGenre');
            expect(result).to.be.an('array').that.is.empty;
        });
    });

    describe('Get Total Discounted Price By Genre', () => {
        it('should calculate the total discounted price', async () => {
            const books = [
                { id: 1, title: 'Discount Book 1', genre: 'Fiction', author: 'Author', price: 50 },
                { id: 2, title: 'Discount Book 2', genre: 'Fiction', author: 'Author', price: 75 },
            ];

            bookRepositoryStub.findByGenre.resolves(books);

            const result = await bookService.getTotalDiscountedPriceByGenre('Fiction', 10);
            expect(result).to.equal(112.5); // (50 + 75) - 10%
        });

        it('should return 0 if genre does not exist', async () => {
            bookRepositoryStub.findByGenre.resolves([]);

            const result = await bookService.getTotalDiscountedPriceByGenre('NonExistingGenre', 10);
            expect(result).to.equal(0);
        });
    });

    describe('Get All Books', () => {
        it('should retrieve all books', async () => {
            const books = [
                { id: 1, title: 'All Book 1', author: 'Test Author', genre: 'History', price: 150 },
                { id: 2, title: 'All Book 2', author: 'Test Author', genre: 'Science', price: 200 },
            ];

            // Stub getAllBooks to resolve books
            bookRepositoryStub.getAllBooks.resolves(books);

            const result = await bookService.getAllBooks();
            expect(result).to.deep.equal(books);
            expect(bookRepositoryStub.getAllBooks).to.have.been.calledOnce;
        });
    });
});
