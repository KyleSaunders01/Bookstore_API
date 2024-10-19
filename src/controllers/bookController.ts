import { Request, Response } from "express";
import { BookService } from "../services/bookService";

export const bookController = (bookService: BookService) => ({

    createBook: async (req: Request, res: Response): Promise<void> => {
        try {
            const book = await bookService.createBook(req.body);
            res.status(201).json(book);
        } catch (error) {
            res.status(500).json({ message: "Failed to create the book", error: (error as Error).message });
        }
    },


    getBookById: async (req: Request, res: Response): Promise<void> => {
        const id = parseInt(req.params.id);
        try {
            const book = await bookService.getBookById(id);
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        } catch (error) {
            res.status(500).json({ message: "Failed to retrieve the book", error: (error as Error).message });
        }
    },

    updateBook: async (req: Request, res: Response): Promise<void> => {
        const id = parseInt(req.params.id);
        try {
            const updatedBook = await bookService.updateBook(id, req.body);
            if (updatedBook) {
                res.status(200).json(updatedBook);
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        } catch (error) {
            res.status(500).json({ message: "Failed to update the book", error: (error as Error).message });
        }
    },

    deleteBook: async (req: Request, res: Response): Promise<void> => {
        const id = parseInt(req.params.id);
        try {
            const deletedBook = await bookService.deleteBook(id);
            if (deletedBook) {
                res.status(200).json({ message: 'Book deleted successfully' });
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        } catch (error) {
            res.status(500).json({ message: "Failed to delete the book", error: (error as Error).message });
        }
    },

    getAllBooks: async (req: Request, res: Response): Promise<void> => {
        try {
            const books = await bookService.getAllBooks();
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ message: "Failed to retrieve books", error: (error as Error).message });
        }
    },

    getTotalDiscountedPriceByGenre: async (req: Request, res: Response): Promise<void> => {
        console.log("Hit controller");
        const genre = req.query.genre as string;
        const discount = parseFloat(req.query.discount as string);

        if (!genre) {
            res.status(400).json({ message: 'Genre is required' });
            return;
        }

        if (isNaN(discount)) {
            res.status(400).json({ message: 'Discount must be a valid number' });
            return;
        }

        try {
            const totalDiscountPrice = await bookService.getTotalDiscountedPriceByGenre(genre, discount);
            res.status(200).json({
                genre,
                discount_percentage: discount,
                total_discount_price: totalDiscountPrice
            });
        } catch (error) {
            res.status(500).json({ message: "Failed to calculate discounted price", error: (error as Error).message });
        }
    }
});
