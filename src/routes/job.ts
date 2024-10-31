import {Router} from "express";
import {AppDataSource} from "../data-source";
import {Job} from "../entity/Job";
import {Like} from "typeorm";

const router = Router()

// router.get('/job/:jobId', async (req, res) => {
//     const jobId = req.params.jobId;
//     const jobRepository = AppDataSource.getRepository(Job);
//
//     try {
//         const job = await jobRepository.findOne({
//             where: { job_id: Number(jobId)}
//         })
//
//         if (!job) {
//             res.status(404).json({message: 'Job not found'});
//             return
//         }
//     } catch (error) {
//         res.status(505).json({message: 'Server Error'});
//     }
// })

router.get('/jobs', async (req, res) => {
    const jobRepository = AppDataSource.getRepository(Job);
    const titleQuery = req.query.title as string;

    try {
        let jobs;
        if (titleQuery) {
            jobs = await jobRepository.find({
                where: {title: Like(`%${titleQuery}%`)}
            })
        } else {
            jobs = await jobRepository.find()
        }
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json(error);
    }
})

export default router;