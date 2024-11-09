import express, {Router} from "express";
import {checkAuth} from "../middleware/checkAuth";
import {AppDataSource} from "../data-source";
import {Users} from "../entity/Users";

const router = express.Router();


router.get('/profile', checkAuth, async (req:any, res) => {
    const userRepository = AppDataSource.getRepository(Users)
    try {
        const userId = req.user.userId;
        console.log(req.user);
        const user = await userRepository.findOne({
            where: {id: userId},
            select: ['name', 'email', 'id']
        });
        console.log(user);

        if (!user) {
             res.status(404).json({ message: 'User not found' });
             return
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
})
export default router;