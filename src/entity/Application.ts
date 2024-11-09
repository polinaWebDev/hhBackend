import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "./Users";
import {Status} from "../status";

@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    application_id: number;

    @Column()
    job_id: number;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.PENDING
    })
    status: Status;

    @Column()
    coverLetter:string


    @ManyToOne(() => Users, (user) => user.applications)
    user: Users;

} 