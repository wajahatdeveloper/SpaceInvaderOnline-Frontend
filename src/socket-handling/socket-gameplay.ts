import { setState, getState } from './socket-state';

function onGameStart() {
  console.log(`On Game Start`);

  getState().socket!.on('game-state', onReceivedGameState);
  getState().socket!.on('lost-notif', onReceivedLostNotifications);
}

function onReceivedLostNotifications(updatedLostNotifications: any) {
  console.log(`onReceivedLostNotifications: ${JSON.stringify(updatedLostNotifications)}`);
}

function onReceivedGameState(updatedState: any) {
  console.log(`${JSON.stringify(updatedState)}`);
  setState({
    latestShipPosition: updatedState.shipPositionX,
    isGameOn: updatedState.isGameOn,
    players: updatedState.playerUpdates,
    bullet: updatedState.bulletState,
  });
}

function publishPlayerInput(payload: any) {
  getState().socket!.emit('player-input', payload);
}

function publishPlayerLostNotification(bulletId: integer, username: string) {
  getState().socket!.emit('player-lost', { bulletId, username });
}

export default {
  onGameStart,
  onReceivedLostNotifications,
  onReceivedGameState,
  publishPlayerInput,
  publishPlayerLostNotification,
};
