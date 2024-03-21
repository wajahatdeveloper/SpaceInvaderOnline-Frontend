import Globals from '../support/globals';
import { eventManager, connect, ServerEvent } from '../net-phaser/net-phaser';
import { getState } from './socket-state';
import { Socket } from 'socket.io-client';

let callbackOnGameStart: any;

function init() {
  eventManager.registerCallback(ServerEvent.ConnectionSuccess, () => {
    console.log(`Connected to server`);
    requestAvailableRoom();
  });

  eventManager.registerCallback(ServerEvent.ConnectionFailure, () => {
    console.log(`Disconnected from server`);
  });

  connect(Globals.SERVER_URL, Globals.ClientId);
}

function requestAvailableRoom() {
  getState().socket!.emit('requestRoom', {
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

export { init, requestAvailableRoom, leaveRoom, hookGameStart };
