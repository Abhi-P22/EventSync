import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import setupSocket from './socket.js';
dotenv.config();
connectDB();

const app = express();
const server = createServer(app);
const io = setupSocket(server); // Initialize Socket.IO

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  
}));
app.use(express.json());
// app.use('/api',uploadRoutes)
// 🔥 Middleware to attach `io` to requests
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

server.listen(5000, () => console.log('Server running on port 5000'));
