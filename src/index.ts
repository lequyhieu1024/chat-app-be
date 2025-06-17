import express from 'express';
import cors from 'cors'

import indexRoute from "./routes/index.route";
import * as http from "node:http";
import {createServer} from "node:http";
import {Server} from "socket.io";
import chatSocket from "./sockets/chat.socket";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONT_END_URL ?? "http://localhost:5173",
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }
});
chatSocket(io);

app.use('/api', indexRoute);

httpServer.listen(PORT, () => {
    console.log(`HTTP & Socket.IO server is running at http://localhost:${PORT}`);
});
