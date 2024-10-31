import express from "express";
import {Company} from "../entity/Company";
import { Users} from "../entity/Users";
import {AppDataSource} from "../data-source";
import {checkAuth} from "../middleware/checkAuth";
import {UserRole} from "../Roles";
import {CompanyMember} from "../entity/CompanyMember";


const router = express.Router();

router.post('/company', checkAuth, async (req, res) => {
    const {name} = req.body;
    const userId = req.params.id;

    try {
        const companyRepository =  AppDataSource.getRepository(Company);
        const userRepository =  AppDataSource.getRepository(Users);
        const companyMemberRepository =  AppDataSource.getRepository(CompanyMember);

        const user = await userRepository.findOne({where:{id: userId}})

        if (!user) {
            res.status(404).send("Пользователь не найден")
            return
        }

        user.role = UserRole.MANAGER;
        await userRepository.save(user);

        const newCompany = companyRepository.create({
            name: name,
            members: [user]
        })

        const savedCompany = await companyRepository.save(newCompany);

        const companyMember = new CompanyMember()
        companyMember.company = savedCompany;
        companyMember.user = user;
        companyMember.role = UserRole.MANAGER;

        await companyMemberRepository.save(companyMember);

        res.json({message: "Updated successfully.", newCompany})
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500)
    }

})

export default router