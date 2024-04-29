import { Request, Response } from 'express';
import { query } from '../db/db';
import { Category } from '../types/types';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT * FROM categories';
    const results = await query(sql);
    console.log(results.rows);
    const categories : Category[] = results.rows;
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
