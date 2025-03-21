const {Server} = require('socket.io');
const Message = require('./models/MessageModel');

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            // Update CORS configuration to include localhost:5174
            origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
            methods: ["GET", "POST", "OPTIONS"],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }
    });

    const userSocketMap = new Map();

    const sendMessage = async (message) => {
        try {
            const senderSocketId = userSocketMap.get(message.sender);
            const recipientSocketId = userSocketMap.get(message.recipient);

            const createdMessage = await Message.create(message);

            // Fix the population fields
            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "_id firstName lastName email image")
                .populate("recipient", "_id firstName lastName email image");

            if(senderSocketId){
                io.to(senderSocketId).emit("receiveMessage", messageData);
            }

            if(recipientSocketId){
                io.to(recipientSocketId).emit("receiveMessage", messageData);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;

        if(userId){
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket id: ${socket.id}`);
        } else {
            console.log("User connected without userId");
        }

        socket.on('sendMessage', sendMessage);

        socket.on('disconnect', () => {
            userSocketMap.delete(userId);
            console.log(`User disconnected: ${userId}`);
        });
    })
};

module.exports = setupSocket;