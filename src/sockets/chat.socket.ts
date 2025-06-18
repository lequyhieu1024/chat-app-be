import { Server, Socket } from "socket.io";

export default function chatSocket(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log("Socket connected:", socket.id);

        socket.on('send_message', async (data: any) => {
            socket.broadcast.emit('received_message', data);
            console.log('received job send message and emit job received_message, data emit: ', data)
        })

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
}