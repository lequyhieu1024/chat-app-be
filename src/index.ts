import express from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser"

import indexRoute from "./routes/index.route";
import {createServer} from "node:http";
import {Server} from "socket.io";
import chatSocket from "./sockets/chat.socket";

const app = express();
const HTTP_PORT = 3000;
const SOCKET_PORT = 3001;

app.use(cors({
    origin: process.env.FRONT_END_URL ?? "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const socketServer = createServer(app);

const io = new Server(socketServer, {
    cors: {
        origin: process.env.FRONT_END_URL ?? "http://localhost:5173",
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }
});
chatSocket(io);

app.use('/api', indexRoute);

socketServer.listen(SOCKET_PORT, () => {
    console.log(`Socket server is running at http://localhost:${SOCKET_PORT}`);
});

app.listen(HTTP_PORT, () => {
    console.log(`HTTP server is running at http://localhost:${HTTP_PORT}`);
});
