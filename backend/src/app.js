import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { Server } from "socket.io"
// import { getSocketId } from './utils/SocketId.js'

const app = express()
const server = http.createServer(app)

// socket.io
const io = new Server(server, {
    cors: {
        origin: [`${process.env.CORS_ORIGIN}`],
        credentials: true,
    }
})

io.on("connection", (socket) => {
    socket.on("user-online", async ({ userId }) => {
        await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    socketId: socket.id,
                    isOnline: true
                }
            },
            { new: true })
    })

})

app.use(cors({
    origin: [`${process.env.CORS_ORIGIN}`],
    credentials: true
}))

app.use(cookieParser())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import followRouter from "./routes/follow.routes.js"
import postRouter from "./routes/post.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import groupRouter from "./routes/group.routes.js"
import { User } from './models/user.model.js'

app.use("/api/v1/user", userRouter)
app.use("/api/v1/message", messageRouter)
app.use("/api/v1/follow", followRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/group", groupRouter)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500)
        .json({
            status: err.statusCode || 500,
            message: err.message || "internal server error",
            success: false
        })
})


export { server, io }