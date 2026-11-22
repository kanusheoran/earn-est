import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const setIO = (serverIO: SocketIOServer) => {
  io = serverIO;
};

export const getIO = (): SocketIOServer | null => {
  return io;
};

export const emitQueueUpdate = (departmentId?: string, payload?: any) => {
  if (!io) return;
  // Broadcast to global display & admin
  io.emit('queue:updated', payload || { departmentId, timestamp: new Date() });
  
  // Broadcast to specific department room
  if (departmentId) {
    io.to(`dept:${departmentId}`).emit('department:updated', payload || { departmentId });
  }
};

export const emitTicketNotification = (queueEntryId: string, payload: any) => {
  if (!io) return;
  io.to(`ticket:${queueEntryId}`).emit('ticket:called', payload);
};
