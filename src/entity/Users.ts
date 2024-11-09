import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne, ManyToMany} from "typeorm"
import {Company} from "./Company";
import {Application} from "./Application";
import {Resume} from "./Resume";
import {CompanyMember} from "./CompanyMember";
import {UserRole} from "../Roles";


@Entity()
export class Users {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({unique:true})
    email: string

    @Column()
    password: string

    checkIfPasswordIsValid(password: string): boolean {
        return this.password === password;
    }

    @Column()
    name: string

    @Column({nullable: true})
    avatar: string

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;


    @ManyToMany(() => Company, (company) => company.members)
    companies: Company[];

    @OneToMany(() => Application, (application) => application.user, {nullable:true})
    applications: Application[];

    @OneToMany(() => Resume, (resume) => resume.userId)
    resumes: Resume[];

    @OneToMany(() => CompanyMember, (membership) => membership.user)
    memberships: CompanyMember[];

}

