import { Request, Response } from 'express';
import { query } from '../db/db';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT * FROM categories';
    const categories = await query(sql);
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
