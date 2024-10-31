import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Job} from "./Job";
import { Users} from "./Users";
import {CompanyMember} from "./CompanyMember";
import {UserRole} from "../Roles";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    company_id: number

    @Column()
    name: string

    @Column({nullable: true})
    avatar_id: string



    @OneToMany(() => Job, (job) => job.company)
    jobs: Job[];

    @OneToMany(() => CompanyMember, (member) => member.company)
    members: CompanyMember[];
}