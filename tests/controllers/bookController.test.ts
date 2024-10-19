import { bookController } from '../../src/controllers/bookController';
import { Request, Response } from 'express';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { BookService } from '../../src/services/bookService';

chai.use(sinonChai);

const sampleBook = {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Fiction',
    price: 100,
};

describe('Book Controller', () => {
    let mockBookService: sinon.SinonStubbedInstance<BookService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        mockBookService = sinon.createStubInstance(BookService);

        req = {
            params: {},
            body: {},
        };

        res = {
            status: sinon.stub(),
            json: sinon.stub(),
        };
    });

    describe('createBook', () => {
        it('should create a book and return 201 status', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req.body = { title: 'Test Book', author: 'Test Author', genre: 'Fiction', price: 100 };

            mockBookService.createBook.resolves(sampleBook);
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.createBook(req as Request, res as Response);

            expect(res.status).to.have.been.calledWith(201);
            expect(res.json).to.have.been.calledWith(sampleBook);
        });

        it('should handle errors and return 500 status', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req.body = {};

            mockBookService.createBook.rejects(new Error('Database error'));
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.createBook(req as Request, res as Response);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({
                message: 'Failed to create the book',
                error: 'Database error',
            });
        });
    });

    describe('getBookById', () => {
        it('should retrieve a book and return 200 status', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req.params = { id: '1' };

            mockBookService.getBookById.resolves(sampleBook);
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.getBookById(req as Request, res as Response);

            expect(mockBookService.getBookById).to.have.been.calledWith(1);
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith(sampleBook);
        });

        it('should return 404 if the book is not found', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req.params = { id: '1' };

            mockBookService.getBookById.resolves(undefined);
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.getBookById(req as Request, res as Response);

            expect(res.status).to.have.been.calledWith(404);
            expect(res.json).to.have.been.calledWith({ message: 'Book not found' });
        });

        it('should handle errors and return 500 status', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req.params = { id: '1' };

            mockBookService.getBookById.rejects(new Error('Database error'));
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.getBookById(req as Request, res as Response);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({
                message: 'Failed to retrieve the book',
                error: 'Database error',
            });
        });
    });

    describe('updateBook', () => {
        it('should update a book and return 200 status', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req.params = { id: '1' };
            req.body = { title: 'Updated Title', author: 'Test Author', genre: 'Fiction', price: 80 };

            mockBookService.updateBook.resolves({
                id: 1,
                title: 'Updated Title',
                author: 'Test Author',
                genre: 'Fiction',
                price: 80,
            });
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.updateBook(req as Request, res as Response);

            expect(mockBookService.updateBook).to.have.been.calledWith(1, req.body);
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith({
                id: 1,
                title: 'Updated Title',
                author: 'Test Author',
                genre: 'Fiction',
                price: 80,
            });
        });

        it('should return 404 if the book is not found', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req.params = { id: '1' };
            req.body = { title: 'Updated Title' };

            // Simulate a not-found response
            mockBookService.updateBook.resolves(undefined);
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.updateBook(req as Request, res as Response);

            expect(res.status).to.have.been.calledWith(404);
            expect(res.json).to.have.been.calledWith({ message: 'Book not found' });
        });

        it('should handle errors and return 500 status', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req.params = { id: '1' };
            req.body = { title: 'Updated Title' };

            // Simulate an error
            mockBookService.updateBook.rejects(new Error('Database error'));
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.updateBook(req as Request, res as Response);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({
                message: 'Failed to update the book',
                error: 'Database error',
            });
        });
    });

    describe('deleteBook', () => {
        it('should delete a book and return 200 status', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req.params = { id: '1' };

            mockBookService.deleteBook.resolves(sampleBook);
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.deleteBook(req as Request, res as Response);

            expect(mockBookService.deleteBook).to.have.been.calledWith(1);
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith({ message: 'Book deleted successfully' });
        });

        it('should return 404 if the book is not found', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req.params = { id: '1' };

            mockBookService.deleteBook.resolves(undefined);
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.deleteBook(req as Request, res as Response);

            expect(res.status).to.have.been.calledWith(404);
            expect(res.json).to.have.been.calledWith({ message: 'Book not found' });
        });

        it('should handle errors and return 500 status', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req.params = { id: '1' };

            mockBookService.deleteBook.rejects(new Error('Database error'));
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.deleteBook(req as Request, res as Response);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({
                message: 'Failed to delete the book',
                error: 'Database error',
            });
        });
    });

    describe('getAllBooks', () => {
        it('should retrieve all books and return 200 status', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req = {};

            mockBookService.getAllBooks.resolves([sampleBook]);
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.getAllBooks(req as Request, res as Response);

            expect(mockBookService.getAllBooks).to.have.been.calledOnce;
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith([sampleBook]);
        });

        it('should handle errors and return 500 status', async () => {
            const controller = bookController(mockBookService as unknown as BookService);

            req = {};

            mockBookService.getAllBooks.rejects(new Error('Database error'));
            (res.status as sinon.SinonStub).returns(res);
            (res.json as sinon.SinonStub).returns(res);

            await controller.getAllBooks(req as Request, res as Response);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({
                message: 'Failed to retrieve books',
                error: 'Database error',
            });
        });
    });
});
