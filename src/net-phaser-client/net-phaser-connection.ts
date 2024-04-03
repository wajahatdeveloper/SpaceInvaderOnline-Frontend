import { Socket, io } from 'socket.io-client';
import { NetEvent, eventManager } from './net-phaser-events';
import { onJoinedSession, onPlayerLeftSession } from './net-phaser-session';
import { onReceivedData } from './net-phaser-session-sync';

let socket: Socket;

function connectToServer(serverUrl: string, clientId: string): Socket {
  // attempt connection to server
  socket = io(serverUrl, {
    transports: ['websocket'],
    query: { clientId: `${clientId}` },
  });

  // listen for server response events
  socket.on('connect', () => eventManager.triggerCallback(NetEvent.OnConnectedToServer, ''));
  socket.on('disconnect', () =>
    eventManager.triggerCallback(NetEvent.OnDisconnectedFromServer, ''),
  );
  socket.on('sessionJoined', (sessionId: string) => {
    onJoinedSession(sessionId);
    eventManager.triggerCallback(NetEvent.OnSessionJoined, sessionId);
  });
  socket.on('playerLeftSession', (clientId: string) => {
    onPlayerLeftSession(clientId);
    eventManager.triggerCallback(NetEvent.OnSessionJoined, clientId);
  });
  socket.on('receiveData', (fromClientId: string, data: any) => {
    onReceivedData(fromClientId, data);
    eventManager.triggerCallback(NetEvent.OnDataReceived, { fromClientId, data });
  });

  return socket;
}

function disconnectFromServer() {
  socket.disconnect();
}

export { socket, connectToServer, disconnectFromServer };
