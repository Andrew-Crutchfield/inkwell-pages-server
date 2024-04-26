import { Request, Response } from 'express';
import { query } from '../db/db';
import { Book } from '../types';

const getAllBooks = async (req: Request, res: Response) => {
    try {
        const sql = 'SELECT * FROM books';
        const results = await query(sql);
        console.log(results.rows);
        const books : Book[] = results.rows;
        res.json({ books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getBookById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sql = 'SELECT * FROM books WHERE id = ?';
        const queryResult = await query(sql, [id]);
        const book = queryResult.rows[0];
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        console.error('Error fetching book details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createBook = async (req: Request, res: Response) => {
    try {
        const { title, author, categoryId, price } = req.body;

        if (categoryId === undefined) {
            return res.status(400).json({ message: 'Category ID is required' });
        }

        const sql = 'INSERT INTO books (title, author, category_id, price) VALUES (?, ?, ?, ?)';
        const result = await query(sql, [title, author, categoryId, price]);

        const newBook: Book = {
            id: result.rows[0].id,
            title,
            author,
            categoryId,
            price,
            createdAt: result.rows[0].created_at
        };
        res.json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, author, categoryid, price } = req.body;
        const sql = 'UPDATE books SET title = ?, author = ?, categoryid = ?, price = ? WHERE id = ?';
        const safePrice = price !== undefined ? price : null;

        const result = await query(sql, [title, author, categoryid, safePrice, id]);

        if (result && result.rowCount && result.rowCount > 0) {
            res.json({ message: 'Book updated successfully' });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM books WHERE id = ?';

        const result = await query(sql, [id]);

        if (result && result.rowCount && result.rowCount > 0) {
            res.json({ message: 'Book deleted successfully' });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
