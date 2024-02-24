import { Socket, io } from 'socket.io-client';
import { BulletState } from './types';
import Globals from './globals';

let isGameOn: boolean = false;
let latestShipPosition: integer = 0;
const bullets: BulletState[] = [];
let players: any[] = [];

let socket: Socket;

function init() {
  socket = io(Globals.SERVER_URL, {
    transports: ['websocket'],
  });

  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
}

function onConnect() {
  console.log(`Connected to server with id: ${socket.id}`);
  enterRoom();
}

function onDisconnect() {
  console.log(`Disconnected from server`);
}

function enterRoom() {
  console.log(`Entering room with UserName: ${Globals.UserName}`);
  socket.emit('enter-room', { username: Globals.UserName });

  socket.on('game-start', onGameStart);
}

function onGameStart() {
  console.log(`Game Started`);

  socket.on('game-state', onReceivedGameState);
  socket.on('player-states', onReceivedPlayerStates);
  socket.on('lost-notif', onReceivedLostNotifications);
}

function leaveRoom() {
  console.log(`Leaving room with UserName: ${Globals.UserName}`);
  socket.emit('leave-room', { username: Globals.UserName });
}

function onReceivedPlayerStates(updatedPlayerStates: any) {}

function onReceivedLostNotifications(updatedLostNotifications: any) {}

function onReceivedGameState(updatedState: any) {
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

function publishPlayerLostNotification(bulletId: integer, playerUniqueId: integer) {
  socket.emit('player-lost', { bulletId, playerUniqueId });
}

export {
  socket,
  isGameOn,
  latestShipPosition,
  bullets,
  players,
  init,
  enterRoom,
  leaveRoom,
  publishPlayerLostNotification,
  publishPlayerInput,
};
