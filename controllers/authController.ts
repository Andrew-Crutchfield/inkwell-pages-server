import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { jwtConfig } from '../config/config';
import { query } from '../db/db';

interface User {
  id: number;
  email: string;
  password: string;
  role: string;
  created_at: Date;
}
export const authenticateUser = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
        const userResults = await query('SELECT id, email, password, role, created_at FROM Users WHERE email = ?', [email]);

        console.log(userResults);

        if (!userResults || userResults.rows.length === 0) {
            return { success: false, user: undefined };
        }

        const user = userResults.rows[0];

        if (!user || !user.password) {
            return { success: false, user: undefined };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return { success: true, user };
        } else {
            return { success: false, user: undefined };
        }
    } catch (error) {
        console.error('Error authenticating user', error);
        return { success: false, user: undefined };
    }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const authenticationResult = await authenticateUser(email, password);

    if (authenticationResult.success) {
      const token: string = jwt.sign(
        { email, role: authenticationResult.user?.role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiration }
      );
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login failed', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const queryResult = await query(
      'INSERT INTO Users (email, password, role, created_at) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, 'user', new Date()]
    );

    if (queryResult.rowCount && queryResult.rowCount > 0) {
      const token: string = jwt.sign({ email }, jwtConfig.secret, { expiresIn: jwtConfig.expiration });
      res.json({ token });
    } else {
      res.status(400).json({ message: 'Failed to register' });
    }
  } catch (error) {
    console.error('Registration failed', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
