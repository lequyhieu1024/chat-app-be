import { Server, Socket } from "socket.io";
const userSocketMap = new Map<number, string>();

export default function chatSocket(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log("Socket connected:", socket.id);

        socket.on('register_user', (userId: number) => {
            userSocketMap.set(userId, socket.id);
        });

        socket.on('send_message', async (data: any) => {
            socket.broadcast.emit('received_message', data);
            console.log('received job send message and emit job received_message, data emit: ', data)
        })

        socket.on('add_friend', (receive_id: number) => {
            const receiverSocketId = userSocketMap.get(receive_id);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('received_add_friend_request');
            }
        });

        socket.on('accept_friend', async (receive_id: number) => {
            console.log(receive_id)
            const receiverSocketId = userSocketMap.get(receive_id);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('has_been_accept_friend_request');
            }
        })

        socket.on("disconnect", () => {
            for (const [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
            console.log("Socket disconnected:", socket.id);
        });
    });
}