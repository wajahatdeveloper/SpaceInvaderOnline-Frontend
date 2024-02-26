import { io } from 'socket.io-client';
import Globals from '../support/globals';
import lobby from './socket-lobby';
import state from './socket-state';

function init() {
  state.socket = io(Globals.SERVER_URL, {
    transports: ['websocket'],
  });

  state.socket.on('connect', () => {
    console.log(`Connected to server`);
    lobby.requestAvailableRoom();
  });
  state.socket.on('disconnect', () => {
    console.log(`Disconnected from server`);
  });
}

export default { init };
