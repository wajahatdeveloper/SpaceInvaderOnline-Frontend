import { Socket } from 'socket.io-client';
import { BulletState } from '../support/types';

const isGameOn: boolean = false;
const latestShipPosition: integer = 0;
const bullets: BulletState[] = [];
const players: any[] = [];

let socket: Socket | undefined;

export default {
  isGameOn,
  latestShipPosition,
  bullets,
  players,
  socket,
};
