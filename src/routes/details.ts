import express from "express";
import {AppDataSource} from "../data-source";
import {Company} from "../entity/Company";
import {Users} from "../entity/Users";
import {CompanyMember} from "../entity/CompanyMember";
import {checkAuth} from "../middleware/checkAuth";

const router = express.Router();

router.get('/details/:companyId', async (req, res) => {
    const companyId = req.params.companyId;

    try {
        const companyRepo = AppDataSource.getRepository(Company);
        const company = await companyRepo.findOne({
            where: { company_id: companyId,  /*owner:?*/ },
            relations: ['members', 'members.user', 'owner'],
        })

        console.log(company)

        if (!company) {
            res.status(404).json({message: 'Company not found'})
            return
        }

        const companyDetails = {
            ...company,
            members: company.members.map((member) => ({
                role: member.role,
                user: {
                    id: member.user.id,
                    name: member.user.name,
                }
            })),
        }

        console.log(companyDetails)

        res.status(200).json(companyDetails);
    } catch (error) {
        console.log('Error fetching company details:', error);
        res.status(500).json({message: 'Server error'})
    }

})

router.put('/company/:companyId/user/:userId/role', checkAuth, async (req:any, res) => {
    const {companyId, userId} = req.params;
    const {role: newRole} = req.body;
    const currentUserId = req.user.id;

    try {
        const companyRepository = AppDataSource.getRepository(Company);
        const companyMemberRepository = AppDataSource.getRepository(CompanyMember);

        // Найти компанию
        const company = await companyRepository.findOne({
            where: { company_id: companyId },
            relations: ['owner', 'members', 'members.user'],
        });

        if (!company) {
            res.status(404).json({ message: 'Company not found.' });
            return;
        }


        const isOwner = company.owner.id === currentUserId;

        // Если владелец компании, вручную создать членство
        const currentMembership =
            isOwner
                ? { user: { id: currentUserId }, role: 'owner' } // Владелец компании
                : company.members.find((member) => member.user.id === currentUserId); // Остальные участники

        if (!currentMembership) {
            res.status(403).json({ message: 'You are not a member of this company.' });
            return;
        }

        // Проверить права текущего пользователя
        const isManager = currentMembership.role === 'manager';

        if (!isManager && !isOwner) {
            res.status(403).json({ message: 'Access denied.' });
            return;
        }

        // Нельзя менять роль владельцу компании
        if (userId === company.owner.id) {
            res.status(403).json({ message: "Cannot change the role of the owner." });
            return;
        }

        // Нельзя менять свою роль
        if (userId === currentUserId) {
            res.status(403).json({ message: "Cannot change your own role." });
            return;
        }

        // Найти членство пользователя, чью роль нужно изменить
        const membershipToUpdate = company.members.find((member) => member.user.id === userId);
        if (!membershipToUpdate) {
            res.status(404).json({ message: 'User not found in the company.' });
            return;
        }

        // Обновить роль
        membershipToUpdate.role = newRole;
        await companyMemberRepository.save(membershipToUpdate);
        console.log("User role update", membershipToUpdate)

        res.status(200).json({ message: 'Role updated successfully.' });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
})


export default router;

