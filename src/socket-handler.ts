import { Socket, io } from 'socket.io-client';

let myUniqueId: integer = 0;
let isGameOn: boolean = false;
let latestShipPosition: integer = 0;

const serverUrl: string = 'http://localhost:8000';
const socket: Socket = io(serverUrl, {
  transports: ['websocket'],
});

socket.on('connect', onConnect);
socket.on('disconnect', onDisconnect);
socket.on('game-state', onUpdate);

function onConnect() {
  myUniqueId = Math.floor(Math.random() * 9999 + 1);
  console.log(`Connected to ws with id: ${socket.id}`);
}

function onDisconnect() {
  console.log(`Disconnected from ws`);
}

function onUpdate(updatedState: any) {
  console.log(`${updatedState.shipPositionX}`);
  latestShipPosition = updatedState.shipPositionX;
  isGameOn = updatedState.isMatchStarted;
}

function enterRoom() {
  console.log(`Entering room with unique id ${myUniqueId}`);
  socket.emit('enter', { id: myUniqueId });
}

export { socket, myUniqueId, isGameOn, latestShipPosition, enterRoom };
