import "reflect-metadata"
import { DataSource } from "typeorm"
import { Users } from "./entity/Users"
import {Company} from "./entity/Company";
import {Job} from "./entity/Job";
import {Application} from "./entity/Application";
import {Resume} from "./entity/Resume";
import {CompanyMember} from "./entity/CompanyMember";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "31011995pL_",
    database: "backend",
    entities: [Users, Company, Job, Application, Resume, CompanyMember],
    synchronize: true,
    logging: false,
})


AppDataSource.initialize()
    .then(() => {

    })
    .catch((error) => console.log(error))