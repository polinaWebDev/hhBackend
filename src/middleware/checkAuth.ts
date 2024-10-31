import express, { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
    const token: string|undefined = req.headers['authorization']?.split(' ')[1]!;

    if (!token) {
        res.status(401).send('No token provided');
        return;
    }

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        (req as any).user = decoded;
        next();
    } catch (err) {
        console.error('Ошибка проверки токена:', err);
        res.sendStatus(403).send('Access denied. Invalid token.');
        return;
    }
};

const app = express()
app.get('/api/check-auth', checkAuth);