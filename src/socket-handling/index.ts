import state from './socket-state';
import socketInit from './socket-init';
import socketLobby from './socket-lobby';
import socketGameplay from './socket-gameplay';

export default {
  ...state,
  ...socketInit,
  ...socketLobby,
  ...socketGameplay,
};
