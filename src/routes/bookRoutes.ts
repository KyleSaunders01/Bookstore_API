import express from "express";
import { body, param, query } from 'express-validator';
import { bookController } from "../controllers/bookController";
import { BookService } from "../services/bookService";

const router = express.Router();

export default (bookService: BookService) => {
    const controller = bookController(bookService);

    // POST /books - Create a new book
    router.post(
        '/',
        [
            body('title').notEmpty().withMessage("Title is required"),
            body('author').notEmpty().withMessage("Author is required"),
            body('genre').notEmpty().withMessage("Genre is required"),
            body('price')
                .notEmpty().withMessage("Price is required")
                .isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
        ],
        controller.createBook
    );

    // GET /books/discounted-price?genre=&discount= - Get total discounted price by genre
    router.get(
        '/discounted-price',
        [
            query('genre').notEmpty().withMessage("Genre is required"),
            query('discount')
                .notEmpty().withMessage("Discount is required")
                .isFloat({ gt: 0, lt: 100 }).withMessage("Discount must be between 0 and 100"),
        ],
        controller.getTotalDiscountedPriceByGenre
    );

    // GET /books - Get all books
    router.get('/', controller.getAllBooks);

    // PUT /books/:id - Update a book by ID
    router.put(
        '/:id',
        [
            param('id').isInt({ gt: 0 }).withMessage("ID must be a positive integer"),
            body('title').optional().notEmpty().withMessage("Title cannot be empty if provided"),
            body('author').optional().notEmpty().withMessage("Author cannot be empty if provided"),
            body('genre').optional().notEmpty().withMessage("Genre cannot be empty if provided"),
            body('price')
                .optional()
                .isFloat({ gt: 0 }).withMessage("Price must be a positive number if provided"),
        ],
        controller.updateBook
    );

    // DELETE /books/:id - Delete a book by ID
    router.delete(
        '/:id',
        [
            param('id').isInt({ gt: 0 }).withMessage("ID must be a positive integer"),
        ],
        controller.deleteBook
    );

    // GET /books/:id - Get a book by ID
    router.get(
        '/:id',
        [
            param('id').isInt({ gt: 0 }).withMessage("ID must be a positive integer"),
        ],
        controller.getBookById
    );

    return router;
};
