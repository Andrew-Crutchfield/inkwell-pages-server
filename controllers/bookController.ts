import { Request, Response } from 'express';
import { query } from '../db/db';
import { Book } from '../types/types';
import debug from 'debug';

debug.enable('pg:sql');

const getAllBooks = async (req: Request, res: Response) => {
    try {
        const sql = 'SELECT * FROM books';
        const results = await query(sql);
        console.log('Fetched all books:', results.rows);
        const books: Book[] = results.rows.map((row: any) => ({
            id: row.id,
            categoryId: row.category_id,
            title: row.title,
            author: row.author,
            price: row.price,
            createdAt: row.created_at
        }));
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
            console.log('Fetched book by ID:', book);
            res.json(book);
        } else {
            console.log('Book not found with ID:', id);
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
        console.log('Created book:', result.rows[0]);

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
        console.log("updateBook");
        console.log(req.params);
        console.log(req.body);
        const { id } = req.params;
        const { title, author, categoryId, price } = req.body;
        console.log('Updating book with ID:', id);
        const sql = 'UPDATE books SET title = ?, author = ?, category_id = ?, price = ? WHERE id = ?';
        const safePrice = price !== undefined ? price : null;

        const result = await query(sql, [title, author, categoryId, safePrice, id]);
        console.log('Update result:', result);

        if (result && result.rowCount && result.rowCount > 0) {
            res.json({ message: 'Book updated successfully' });
        } else {
            console.log('Book not found with ID:', id);
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
        console.log('Deleting book with ID:', id);
        const sql = 'DELETE FROM books WHERE id = ?';

        const result = await query(sql, [id]);
        console.log('Delete result:', result);

        if (result && result.rowCount && result.rowCount > 0) {
            res.json({ message: 'Book deleted successfully' });
        } else {
            console.log('Book not found with ID:', id);
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
