import { Request, Response } from 'express';
import {Users} from "../entity/Users";
import {AppDataSource} from "../data-source";


export const uploadUserAvatar = async (req: Request<{ userId: string }>, res: Response) => {
    const {userId} = req.params;

    if (!userId) {
        res.status(400).json({ message: 'userId is required' });
        return
    }

    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return
    }

    const avatarPath = `/uploads/user_avatars/${req.file.filename}`;

    try {
        const userRepo = await AppDataSource.getRepository(Users);
        await userRepo.update({id:userId},{avatar: avatarPath });
        res.status(200).json({ message: 'User avatar uploaded successfully', avatarPath });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
}