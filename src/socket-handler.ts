import { Socket, io } from 'socket.io-client';

let myUniqueId: number = 0;

const serverUrl: string = 'http://localhost:8000';
const socket: Socket = io(serverUrl, {
  transports: ['websocket'],
});

socket.on('connect', onConnect);
socket.on('disconnect', onDisconnect);

function onConnect() {
  myUniqueId = Math.floor(Math.random() * 9999 + 1);
  socket.emit('enter', myUniqueId);
  console.log(`Connected to ws with id: ${socket.id}`);
}

function onDisconnect() {
  console.log(`Disconnected from ws`);
}

export { socket, myUniqueId };
