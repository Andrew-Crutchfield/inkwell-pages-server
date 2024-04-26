import express from 'express';
import { getAllCategories } from '../controllers/categoryController';

const router = express.Router();

router.get('/categories', getAllCategories);

export default router;