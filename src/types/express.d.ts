import {Users} from "../entity/Users";

declare global {
    namespace Express {
        interface Request {
            user?: Users;
        }
    }
}