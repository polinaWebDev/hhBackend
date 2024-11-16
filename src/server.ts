import express from 'express'
import {AppDataSource} from "./data-source";
import authRoutes from './routes/auth';
import update from "./routes/update";
import createCompany from "./routes/company";
import profile from "./routes/profile";
import invite from "./routes/invite";
import posting from "./routes/posting";
import application from "./routes/application";

import cors from "cors";
import job from "./routes/job";
import {checkAuth} from "./middleware/checkAuth";
import { Server } from 'socket.io';
import * as http from "node:http";
import resume from "./routes/resume";
import avatar from "./routes/avatar";
import company from "./routes/company";
import details from "./routes/details";

const app = express();
const server = http.createServer(app);
const io = new Server(server)
app.use(cors({origin: '*',  credentials: true}))

AppDataSource.initialize()
    .then(() => {
        console.log('Server started');
    })
    .catch((error) => {
        console.log(error)
})

io.on('connection', (socket) => {
    console.log('Client connected:');

    socket.on('chat message', msg => {
        console.log('Message received', msg);
        io.emit('chat message', msg);
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    })
})

app.use(express.json());

//routs
app.use('/auth', authRoutes);
app.use('/update', update);
app.use(profile);
app.use('/companies', company);
app.use(invite)
app.use(posting)
app.use(application)
app.use(job);
app.use(resume)
app.use(details)
app.use('/api/uploads', avatar);
app.use('/api/uploads', express.static('src/uploads'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
