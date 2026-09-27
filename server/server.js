import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';


import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';
import { app, server } from './socket/socket.js';

dotenv.config(); // Must be called before accessing process.env

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json({ limit: "50mb" })); // Middleware for parsing JSON bodies(from req.body ) and increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Added for form-data if needed
app.use(cookieParser()); //Middleware for handling cookies



app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use( express.static( path.join(__dirname, "/client/dist")))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
})
server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on the PORT:${PORT}`);
})