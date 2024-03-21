import { Socket, io } from 'socket.io-client';
import { ServerEvent, eventManager } from './net-phaser-events';

let socket: Socket;
const clientPool: Map<string, any> = new Map(); // clinetId, clientData

function connect(serverUrl: string, clientId: string): Socket {
  socket = io(serverUrl, {
    transports: ['websocket'],
    query: { clientId: `${clientId}` },
  });

  eventManager.registerCallback(ServerEvent.ConnectionSuccess, () => {
    clientPool.set(clientId, {});
  });

  eventManager.registerCallback(ServerEvent.ConnectionFailure, () => {
    clientPool.delete(clientId);
  });

  socket.on('connect', () => eventManager.triggerCallback(ServerEvent.ConnectionSuccess, ''));
  socket.on('disconnect', () => eventManager.triggerCallback(ServerEvent.ConnectionFailure, ''));

  return socket;
}

function disconnect() {
  socket.disconnect();
}

export { connect, disconnect };
