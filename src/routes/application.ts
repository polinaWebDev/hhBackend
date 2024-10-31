import express from "express";
import {checkAuth} from "../middleware/checkAuth";
import {AppDataSource} from "../data-source";
import {Users} from "../entity/Users";
import {Job} from "../entity/Job";
import {Application} from "../entity/Application";
import {Status} from "../status";

const router = express.Router();

router.post("/application/:jobId", checkAuth, async (req:any, res) => {
    const userId = req.user.id
    const { jobId } = req.params
    const { coverLetter } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(Users);
        const jobRepository = AppDataSource.getRepository(Job);
        const applicationRepository = AppDataSource.getRepository(Application);

        const user = await userRepository.findOne({
            where: {
                id: userId,
            }
        });

        const job = await jobRepository.findOne({
            where: {
                job_id: jobId
            }
        });

        if (!user || !job) {
            res.status(404).json({message: 'Job or User not found'})
            return
        }

        const existingApplication = await applicationRepository.findOne({
            where: {
                user: {id: userId},
                job_id: jobId
            }
        })

        if (existingApplication) {
            res.status(400).json({message: 'You have already applied for this job'})
            return
        }

        const newApplication = applicationRepository.create({
            user: user,
            job_id: jobId,
            coverLetter: coverLetter,
            status: Status.PENDING
        });

        await applicationRepository.save(newApplication);
        res.status(200).json({message: 'Application saved'})
        return
    } catch (error) {
        res.status(500).send('Internal Server Error')
        return
    }
})

export default router;