import { Socket, io } from 'socket.io-client';

interface BulletState {
  id: integer;
}

let myUniqueId: integer = 0;
let isGameOn: boolean = false;
let latestShipPosition: integer = 0;
const bullets: BulletState[] = [];
let players: any[] = [];

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
  console.log(`${JSON.stringify(updatedState)}`);
  latestShipPosition = updatedState.shipPositionX;
  isGameOn = updatedState.isMatchStarted;
  players = updatedState.players;
  const bulletState = updatedState.bulletState;
  bullets.length = 0;
  if (bulletState && Object.keys(bulletState).length > 0) {
    const bullet = bullets.find(x => x.id === bulletState.id);
    if (bullet) {
      // bullet.y = bulletState.y;
    } else {
      bullets.push(bulletState);
    }
  }
}

function publishPlayerInput(payload: any) {
  socket.emit('pos', payload);
}

function enterRoom() {
  console.log(`Entering room with unique id ${myUniqueId}`);
  socket.emit('enter', { id: myUniqueId });
}

function publishPlayerLostNotification(bulletId: integer, playerUniqueId: integer) {
  socket.emit('player-lost', { bulletId, playerUniqueId });
}

export {
  socket,
  myUniqueId,
  isGameOn,
  latestShipPosition,
  bullets,
  players,
  enterRoom,
  publishPlayerLostNotification,
  publishPlayerInput,
};
