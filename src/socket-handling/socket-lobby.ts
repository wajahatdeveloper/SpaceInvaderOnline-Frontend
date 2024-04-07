import Globals from '../support/globals';
import { JoinSession, NetEvent, connectToServer, eventManager, socket } from '../net-phaser-client';

let callbackOnGameStart: any;

function init() {
  eventManager.registerCallback(NetEvent.OnConnectedToServer, () => {
    console.log(`Connected to server`);
    requestAvailableRoom();
  });

  eventManager.registerCallback(NetEvent.OnDisconnectedFromServer, () => {
    console.log(`Disconnected from server`);
  });

  connectToServer(Globals.SERVER_URL, Globals.ClientId);
}

function requestAvailableRoom() {
  eventManager.registerCallback(NetEvent.OnSessionJoined, sessionId => {
    console.log(`Joined Room with Id ${sessionId}`);
    socket.on('match-inital', onGameStart);
  });

  eventManager.registerCallback(NetEvent.OnSessionLeft, clientId => {
    console.log(`Player with Id ${clientId} Left Room`);
  });

  JoinSession();

  console.log(`Waiting for available room..`);
}

function onGameStart() {
  console.log(`Game Started`);

  callbackOnGameStart();
}

function hookGameStart(callback: any) {
  callbackOnGameStart = callback;
}

export { init, requestAvailableRoom, hookGameStart };
