const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
const authRoutes = require("./routes/auth");
const PORT = process.env.PORT||5000;
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
    },
});

const problemsRoutes = require("./routes/problems");
const executeRoutes = require("./routes/execute");
const submissionRoutes = require("./routes/submissions");
const profileRoutes = require("./routes/profile");
const contestsRoutes = require("./routes/contests");
const postsRoutes = require('./routes/posts');
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        return console.log("DB IS CONNECTED")
    }).catch((err) => console.log(err));
// app.use((req, res, next) => {
//     console.log(req.method, req.url);
//     next(); 
// });
// app.get("/api/test", (req, res) => {
//     console.log("API HIT");
//     res.json({ ok: true });
// });
// app.get("/", (req, res) => {
//     res.send("Api running");
// });
app.use("/api/problems", problemsRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/contests", contestsRoutes);
app.use("/api/posts", postsRoutes);
const Message = require("./models/Message");

const users = {};
app.get("/", (req, res) => {
    res.send("Zcoder API Running");
});
io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);
    socket.on("register", (userId) => {
        users[userId] = socket.id;
        socket.userId = userId;
    })
    socket.on("send_message", async ({ toUserId, message }) => {
        if (!socket.userId) {
            console.log("User not registered");
            return;
        }
        const fromUserId = socket.userId;
        const targetSocketId = users[toUserId];
        const newMessage = await Message.create({
            from: fromUserId,
            to: toUserId,
            message,
        })
        if (targetSocketId) {
            io.to(targetSocketId).emit("receive_message", {
                message,
                from: fromUserId,
                to: toUserId,
            })
        }
        socket.emit("receive_message", {
            message,
            from:fromUserId,
            to:toUserId,
        });

    });

    socket.on("disconnect", () => {
        
        if (socket.userId && users[socket.userId] === socket.id) {
            delete users[socket.userId];
        }
        console.log("User disconnected:", socket.id);
    });
});


server.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
});