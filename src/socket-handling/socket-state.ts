/* eslint-disable prefer-const */
import { Socket } from 'socket.io-client';

let isGameOn: boolean = false;
let latestShipPosition: integer = 0;
let bullet: integer = 0;
let players: any[] = [];

let socket: Socket | undefined;

function setSocket(newSocket: Socket) {
  socket = newSocket;
}

function setState(state: any) {
  isGameOn = state.isGameOn;
  latestShipPosition = state.latestShipPosition;
  bullet = state.bullet;
  players = state.playerUpdates;
}

function getState() {
  return { isGameOn, latestShipPosition, bullet, players, socket };
}

export { setSocket, getState, setState };
