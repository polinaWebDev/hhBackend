import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "./Users";


@Entity()
export class Resume {
    @PrimaryGeneratedColumn()
    resume_id: number;

    @Column()
    content: string

    @ManyToOne(() => Users, (user) => user.resumes)
    @JoinColumn({ name: 'userId'})
    userId: Users;
}
