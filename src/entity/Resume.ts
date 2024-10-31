import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "./Users";


@Entity()
export class Resume {
    @PrimaryGeneratedColumn()
    resume_id: number;

    @Column()
    content: string

    @OneToOne(() => Users, (user) => user.resume)
    @JoinColumn()
    user: Users
}
