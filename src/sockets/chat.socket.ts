import { Server, Socket } from "socket.io";

export default function chatSocket(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("chat:send", async (data) => {
            io.emit("chat:receive");
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
}