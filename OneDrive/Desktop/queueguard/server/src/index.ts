import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { setIO } from './socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
setIO(io);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Socket connection management
io.on('connection', (socket) => {
  // Join department room for filtered updates
  socket.on('join:department', (departmentId: string) => {
    socket.join(`dept:${departmentId}`);
  });

  // Join ticket room for individual notifications
  socket.on('join:ticket', (ticketId: string) => {
    socket.join(`ticket:${ticketId}`);
  });

  socket.on('disconnect', () => {
    // cleanup
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🚀 QueueGuard Server running on port ${PORT}`);
  });
}

export { app, server, io };
