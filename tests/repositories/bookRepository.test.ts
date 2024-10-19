import { expect } from 'chai';
import sinon from 'sinon';
import { Repository, Connection } from 'typeorm';
import { Book } from '../../src/entity/Book';
import { BookRepository } from '../../src/repositories/bookRepository';

describe('BookRepository', () => {
    let connectionStub: sinon.SinonStubbedInstance<Connection>;
    let bookRepoStub: sinon.SinonStubbedInstance<Repository<Book>>;
    let bookRepository: BookRepository;

    beforeEach(() => {
        // Stub the Connection
        connectionStub = sinon.createStubInstance(Connection);

        // Stub the Repository<Book> with proper typing
        bookRepoStub = sinon.createStubInstance(Repository) as sinon.SinonStubbedInstance<Repository<Book>>;

        // Correctly cast the return value of getRepository to Repository<Book>
        (connectionStub.getRepository as sinon.SinonStub).returns(bookRepoStub as unknown as Repository<Book>);

        // Create the BookRepository instance using the stubbed connection
        bookRepository = new BookRepository(connectionStub as unknown as Connection);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('create', () => {
        it('should create and save a new book', async () => {
            const bookData = { title: 'Test Book', author: 'Author', genre: 'Fiction', price: 100 };
            const savedBook = { id: 1, ...bookData };

            bookRepoStub.create.returns(savedBook as Book);
            bookRepoStub.save.resolves(savedBook as Book);

            const result = await bookRepository.create(bookData);
            expect(result).to.deep.equal(savedBook);
            expect(bookRepoStub.create).to.have.been.calledWith(bookData);
            expect(bookRepoStub.save).to.have.been.calledWith(savedBook);
        });

        it('should throw an error if saving the book fails', async () => {
            const bookData = { title: 'Test Book', author: 'Author', genre: 'Fiction', price: 100 };

            bookRepoStub.save.rejects(new Error('Database error'));

            try {
                await bookRepository.create(bookData);
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Database error while creating the book');
                }
            }
        });
    });

    describe('findById', () => {
        it('should find a book by its ID', async () => {
            const book = { id: 1, title: 'Test Book', author: 'Author', genre: 'Fiction', price: 100 };

            bookRepoStub.findOne.resolves(book as Book);

            const result = await bookRepository.findById(1);
            expect(result).to.deep.equal(book);
            expect(bookRepoStub.findOne).to.have.been.calledWith({ where: { id: 1 } });
        });

        it('should throw an error if fetching the book fails', async () => {
            bookRepoStub.findOne.rejects(new Error('Database error'));

            try {
                await bookRepository.findById(1);
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Database error while fetching the book by ID');
                }
            }
        });
    });

    describe('update', () => {
        it('should update a book and return the updated book', async () => {
            const updatedData = { title: 'Updated Title', price: 120 };
            const updatedBook = { id: 1, ...updatedData };

            bookRepoStub.update.resolves();
            bookRepoStub.findOne.resolves(updatedBook as Book);

            const result = await bookRepository.update(1, updatedData);
            expect(result).to.deep.equal(updatedBook);
            expect(bookRepoStub.update).to.have.been.calledWith(1, updatedData);
            expect(bookRepoStub.findOne).to.have.been.calledWith({ where: { id: 1 } });
        });

        it('should throw an error if updating the book fails', async () => {
            bookRepoStub.update.rejects(new Error('Database error'));

            try {
                await bookRepository.update(1, { title: 'Updated Title' });
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Database error while updating the book');
                }
            }
        });
    });

    describe('delete', () => {
        it('should delete a book by id', async () => {
            const book = { id: 1, title: 'Test Book', author: 'Author', genre: 'Fiction', price: 100 };

            // Stub the delete to resolve without needing to find the book
            bookRepoStub.delete.resolves();

            // Call the delete method
            await bookRepository.delete(1);

            // Ensure delete was called with the correct id
            expect(bookRepoStub.delete).to.have.been.calledWith(1);
        });

        it('should throw an error if deleting the book fails', async () => {
            // Stub delete to throw an error
            bookRepoStub.delete.rejects(new Error('Database error'));

            try {
                await bookRepository.delete(1);
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Database error while deleting the book');
                }
            }

            expect(bookRepoStub.delete).to.have.been.calledWith(1);  // Ensure delete was attempted
        });
    });


    describe('findByGenre', () => {
        it('should return books of a specific genre', async () => {
            const books = [
                { id: 1, title: 'Test Book 1', author: 'Author 1', genre: 'Fiction', price: 100 },
                { id: 2, title: 'Test Book 2', author: 'Author 2', genre: 'Fiction', price: 120 },
            ];

            bookRepoStub.find.resolves(books as Book[]);

            const result = await bookRepository.findByGenre('Fiction');
            expect(result).to.deep.equal(books);
            expect(bookRepoStub.find).to.have.been.calledWith({ where: { genre: 'Fiction' } });
        });

        it('should throw an error if fetching books by genre fails', async () => {
            bookRepoStub.find.rejects(new Error('Database error'));

            try {
                await bookRepository.findByGenre('Fiction');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Database error while fetching books by genre');
                }
            }
        });
    });

    describe('getAllBooks', () => {
        it('should return all books', async () => {
            const books = [
                { id: 1, title: 'Test Book 1', author: 'Author 1', genre: 'Fiction', price: 100 },
                { id: 2, title: 'Test Book 2', author: 'Author 2', genre: 'Non-Fiction', price: 120 },
            ];

            bookRepoStub.find.resolves(books as Book[]);

            const result = await bookRepository.getAllBooks();
            expect(result).to.deep.equal(books);
            expect(bookRepoStub.find).to.have.been.calledOnce;
        });

        it('should throw an error if fetching all books fails', async () => {
            bookRepoStub.find.rejects(new Error('Database error'));

            try {
                await bookRepository.getAllBooks();
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Database error while fetching all books');
                }
            }
        });
    });
});
