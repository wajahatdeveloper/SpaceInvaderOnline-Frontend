import { Socket, io } from 'socket.io-client';
import { NetEvent, eventManager } from './net-phaser-events';

let socket: Socket;
let currentSessionId: string;

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

function JoinSession() {
  socket.emit('joinSession');
}

function onJoinedSession(sessionId: string) {
  currentSessionId = sessionId;
}

function onPlayerLeftSession(clientId: string) {
  console.log(`player ${clientId} left the session`);
}

function sendDataToAll(data: any) {
  socket.emit('sendDataToAll', currentSessionId, data);
}

function onReceivedData(fromClientId: string, data: any) {
  console.log(`received from ${fromClientId}, data: ${JSON.stringify(data)}`);
}

export {
  socket,
  currentSessionId,
  connectToServer,
  disconnectFromServer,
  JoinSession,
  sendDataToAll,
};

export { eventManager, NetEvent } from './net-phaser-events';
