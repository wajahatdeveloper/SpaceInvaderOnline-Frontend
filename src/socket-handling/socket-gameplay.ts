import state from './socket-state';

function onGameStart() {
  state.socket!.on('game-state', onReceivedGameState);
  state.socket!.on('lost-notif', onReceivedLostNotifications);
}

function onReceivedLostNotifications(updatedLostNotifications: any) {
  console.log(`onReceivedLostNotifications: ${JSON.stringify(updatedLostNotifications)}`);
}

function onReceivedGameState(updatedState: any) {
  console.log(`${JSON.stringify(updatedState)}`);
  state.latestShipPosition = updatedState.shipPositionX;
  state.isGameOn = updatedState.isMatchStarted;
  state.players = updatedState.players;
  const bulletState = updatedState.bulletState;
  state.bullets.length = 0;
  if (bulletState && Object.keys(bulletState).length > 0) {
    const bullet = state.bullets.find(x => x.id === bulletState.id);
    if (bullet) {
      // bullet.y = bulletState.y;
    } else {
      state.bullets.push(bulletState);
    }
  }
}

function publishPlayerInput(payload: any) {
  state.socket!.emit('player-input', payload);
}

function publishPlayerLostNotification(bulletId: integer, username: string) {
  state.socket!.emit('player-lost', { bulletId, username });
}

export default {
  onGameStart,
  onReceivedLostNotifications,
  onReceivedGameState,
  publishPlayerInput,
  publishPlayerLostNotification,
};
