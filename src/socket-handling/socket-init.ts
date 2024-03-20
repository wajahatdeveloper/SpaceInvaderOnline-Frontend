import { io } from 'socket.io-client';
import Globals from '../support/globals';
import { requestAvailableRoom } from './socket-lobby';
import { setSocket } from './socket-state';

function init() {
  const newSocket = io(Globals.SERVER_URL, {
    transports: ['websocket'],
    query: { clientId: `${Globals.ClientId}` },
  });
  setSocket(newSocket);

  newSocket.on('connect', () => {
    console.log(`Connected to server`);
    requestAvailableRoom();
  });
  newSocket.on('disconnect', () => {
    console.log(`Disconnected from server`);
  });
}

export { init };
