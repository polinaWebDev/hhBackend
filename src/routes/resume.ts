import express from "express";
import {AppDataSource} from "../data-source";
import {Resume} from "../entity/Resume";
import {checkAuth} from "../middleware/checkAuth";
import {Users} from "../entity/Users";

const router = express.Router();

router.put('/resume/update/:resumeId', checkAuth, async (req, res) => {
    const resumeId  = +(req.params.resumeId)
    const {data} = req.body;
    console.log({resumeId})

    try {
        const resumeRepo = AppDataSource.getRepository(Resume);
        const resumeToUpdate = await resumeRepo.findBy({ resume_id: resumeId });

        if (resumeToUpdate.length > 0) {
            const resume = resumeToUpdate[0];
            resume.content = data;
            await resumeRepo.save(resume);
            res.status(200).json({ "resumeId": resumeId });
            return;
        } else {
            res.status(404).json({message: "No resume found"});
            return
        }
    } catch (error) {
        console.log('Error during user registration:', error);
        res.status(500).json('Internal Server Error')
        return
    }
})

router.get('/resume/user/:userId', checkAuth, async (req:any, res) => {
    const {userId} = req.params;

    try {
        const resumeRepository = AppDataSource.getRepository(Resume);
        const foundResumes = await resumeRepository.findBy({ userId: { id: userId } });

        const resumes: Resume[] = foundResumes ? foundResumes : [];

        if (resumes.length > 0) {
            res.status(200).json({resumes});
            return
        } else {
            res.status(404).json({message: 'No resume found'});
            return
        }
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send('Internal Server Error')
        return
    }
})

router.post('/resume/create/:userId', checkAuth, async (req:any, res) => {
    const { data } = req.body;
    const {userId} = req.params;

    if (!data || !userId) {
        res.status(400).send({message: "Invalid data"});
        return
    }

    try {
        const resumeRepository = AppDataSource.getRepository(Resume);
        const userRepository =  AppDataSource.getRepository(Users);
        const user = await userRepository.findOne({where:{id:userId}});

        if (!user) {
            res.status(404).send("Пользователь не найден")
            return
        }

        const newResume = resumeRepository.create({ content: data, userId});
        await resumeRepository.save(newResume);
        res.status(201).json({message: "Resume created successfully.", resumeId: newResume.resume_id});
        return
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send('Internal Server Error')
        return
    }
})





export default router;







































