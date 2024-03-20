import { v4 as uuidv4 } from 'uuid';
import Globals from '../support/globals';
import { getState } from './socket-state';
import { Socket } from 'socket.io-client';

let callbackOnGameStart: any;

function requestAvailableRoom() {
  if (Globals.ClientId === '') {
    Globals.ClientId = localStorage.getItem('ClientId') ?? uuidv4();
    localStorage.setItem('ClientId', Globals.ClientId);
  }

  getState().socket!.emit('request-room', {
    username: Globals.UserName,
    clientId: Globals.ClientId,
  });
  console.log(
    `Requested available room : with UserName: ${Globals.UserName} and ClientId: ${Globals.ClientId}`,
  );

  console.log(`Waiting for available room..`);
  getState().socket!.on('joined-room', data => onJoinedRoom(data, getState().socket!));
}

function onJoinedRoom(data: any, socket: Socket) {
  console.log(`Entering room id : ${data.roomId}`);

  // wait for game to start
  socket.on('start-game', onGameStart);
}

function onGameStart() {
  console.log(`Game Started`);

  callbackOnGameStart();
}

function hookGameStart(callback: any) {
  callbackOnGameStart = callback;
}

function leaveRoom() {
  console.log(`Leaving room with UserName: ${Globals.UserName}`);
  getState().socket!.emit('leave-room', { username: Globals.UserName });
}

export { requestAvailableRoom, leaveRoom, hookGameStart };
