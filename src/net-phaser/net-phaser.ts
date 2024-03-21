import { Socket, io } from 'socket.io-client';
import { ServerEvent, eventManager } from './net-phaser-events';

let socket: Socket;

function connect(serverUrl: string, clientId: string): Socket {
  socket = io(serverUrl, {
    transports: ['websocket'],
    query: { clientId: `${clientId}` },
  });

  socket.on('connect', () => eventManager.triggerCallback(ServerEvent.ConnectionSuccess, ''));
  socket.on('disconnect', () => eventManager.triggerCallback(ServerEvent.ConnectionFailure, ''));

  return socket;
}

export { connect };

export { eventManager, ServerEvent } from './net-phaser-events';
