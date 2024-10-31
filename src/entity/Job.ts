import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Company} from "./Company";
import {application} from "express";
import {Application} from "./Application";

@Entity()
export class Job {
    @PrimaryGeneratedColumn("uuid")
    job_id: string

    @Column({nullable:true})
    salary: number

    @Column()
    title: string

    @Column()
    description: string

    @OneToMany(() => Application, (application) => application.job_id )
    applications: Application[];

    @ManyToOne(() => Company, (company) => company.jobs)
    @JoinColumn({ name: 'company_id', referencedColumnName: 'company_id' }) // Указал имена столбцов для внешнего ключа
    company: Company;
}