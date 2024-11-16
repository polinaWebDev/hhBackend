import express from "express";
import {Company} from "../entity/Company";
import { Users} from "../entity/Users";
import {AppDataSource} from "../data-source";
import {checkAuth} from "../middleware/checkAuth";
import {UserRole} from "../Roles";
import {CompanyMember} from "../entity/CompanyMember";


const router = express.Router();


router.post('/create', checkAuth, async (req:any, res) => {
    const {name} = req.body;
    const {description} = req.body;
    const user = req.user;



    try {
        const companyRepository =  AppDataSource.getRepository(Company);
        const companyMemberRepository =  AppDataSource.getRepository(CompanyMember);

        console.log("Пользователь",user)

        if (!user) {
            res.status(404).send("Пользователь не найден")
            return
        }

        const newCompany = companyRepository.create({
            name: name,
            members: [user],
            owner: user,
            description: description
        })



        const savedCompany = await companyRepository.save(newCompany);

        const companyMember = companyMemberRepository.create({
            company: savedCompany,
            user: user,
            role: UserRole.OWNER,
        });
        await companyMemberRepository.save(companyMember);


        res.status(201).json({message: "Updated successfully.", newCompany})
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500)
    }

})
router.get('/my-companies/:userId', checkAuth, async (req:any, res) => {
    const {userId} = req.params;
    try {
        const companyRepository =  AppDataSource.getRepository(Company);

        const userCompanies = await companyRepository.find({
            where:{
                owner: {id: userId}
            }
        })

        if (userCompanies.length > 0) {
            res.status(200).json(userCompanies);
        } else {
            res.status(404).json({message: 'No company has been found'})
        }
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send('Internal Server Error')}
})

export default router