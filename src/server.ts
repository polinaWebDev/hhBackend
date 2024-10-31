import express from 'express'
import {AppDataSource} from "./data-source";
import authRoutes from './routes/auth';
import update from "./routes/update";
import createCompany from "./routes/create-company";
import profile from "./routes/profile";
import invite from "./routes/invite";
import posting from "./routes/posting";
import application from "./routes/application";

import cors from "cors";
import job from "./routes/job";
import {checkAuth} from "./middleware/checkAuth";

const app = express();
app.use(cors({origin: '*',  credentials: true}))

AppDataSource.initialize()
    .then(() => {
        console.log('Server started');
    })
    .catch((error) => {
        console.log(error)
})

app.use(express.json());

//routs
app.use('/auth', authRoutes);
app.use('/update', update);
app.use(profile);
app.use('/create', createCompany);
app.use(invite)
app.use(posting)
app.use(application)
app.use(job);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})