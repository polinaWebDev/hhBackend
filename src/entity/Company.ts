import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Job} from "./Job";
import { Users} from "./Users";
import {CompanyMember} from "./CompanyMember";

@Entity()
export class Company {
    @PrimaryGeneratedColumn("uuid")
    company_id: string

    @Column()
    name: string

    @Column({nullable: true})
    avatar: string

    @Column({nullable:true})
    description: string

    @ManyToOne(() => Users, (user) => user.companies)
    owner: Users;


    @OneToMany(() => Job, (job) => job.company)
    jobs: Job[];

    @OneToMany(() => CompanyMember, (member) => member.company)
    members: CompanyMember[];
}