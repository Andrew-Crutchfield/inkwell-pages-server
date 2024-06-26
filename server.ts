import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv'; 
import tokenCheck from './middlewares/tokenCheck';
import { loginUser, registerUser } from './controllers/authController';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';

console.log("inkwell-pages-server STARTING UP");

dotenv.config();

const isProduction: boolean = process.env.NODE_ENV === 'production';
const isDevelopment: boolean = process.env.NODE_ENV === 'development';

const app: Express = express();

app.use(cors());
app.use(express.json());

if (isDevelopment) {
  app.use(express.static('public'));
}

console.log("CONFIGURING ROUTES");

app.use('/api', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api/protected-route', tokenCheck);

app.get('/api/hello', (_, res: Response) => {
  res.json({ message: 'Hello World' });
});

app.post('/auth/login', loginUser);
app.post('/auth/register', registerUser);

console.log("ROUTES CONFIGURED");


if (isProduction) {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

const PORT: string | number = process.env.PORT || 3000;

console.log(`ABOUT TO START LISTENING ON ${PORT}`);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});