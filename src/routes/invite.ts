import {Router} from "express";
import {checkAuth} from "../middleware/checkAuth";
import {AppDataSource} from "../data-source";
import {CompanyMember} from "../entity/CompanyMember";
import {Users} from "../entity/Users";
import {UserRole} from "../Roles";

const router =  Router()

router.post('/invite', checkAuth, async (req, res) => {
    const inviterId = req.params.id

    try {
        const companyMemberRepository = AppDataSource.getRepository(CompanyMember)
        const userRepository = AppDataSource.getRepository(Users)

        const userToInvite = await userRepository.findOne({where:{id:inviterId}});
        if (!userToInvite) {
            res.status(404).send("Пользователь не найден");
            return
        }

        const inviterMembership = await companyMemberRepository.findOne({
            where: {
                user: { id: inviterId },
                role: UserRole.MANAGER,
            },
            relations: ['company'],
        });

        if (!inviterMembership) {
            res.status(403).send('Вы не являетесь менеджером ни в одной компании')
            return
        }

        const company = inviterMembership!.company

        const existingMember = await companyMemberRepository.findOne({
            where: {id: userToInvite.id, company: company},
        });

        if (existingMember) {
            res.status(409).send("Пользователь уже существует")
        }

        const newCompanyMember = new CompanyMember();
        newCompanyMember.company = company;
        newCompanyMember.user = userToInvite;
        newCompanyMember.role = UserRole.MEMBER;

        await companyMemberRepository.save(newCompanyMember);

        res.json({message: "Пользователь приглашен"})
    } catch (error) {
        console.error('Ошибка при отправке приглашения:', error);
        res.status(500).send("Внутренняя ошибка сервера");
    }
})

export default router