import { socket } from '../net-phaser-client';
import { MatchUpdateObject, gameState } from './socket-state';

function onGameStart() {
  console.log(`On Game Start`);
  gameState.isGameOn = true;
  socket.on('match-state', onReceivedGameState);
  socket.on('player-won', onPlayerWon);
  socket.on('player-lost', onPlayerLost);
}

function onPlayerWon(winnerId: string) {
  console.log(`Player ${winnerId} Won`);
}

function onPlayerLost(loserId: string) {
  console.log(`Player ${loserId} Lost`);
}

function onReceivedGameState(updatedState: MatchUpdateObject) {
  gameState.latestShipPosition = updatedState.shipPositionX;
  gameState.playerStates = updatedState.playerUpdates;
  gameState.bullet = updatedState.shootBullet === true ? 1 : 0;
  console.log(`${gameState.latestShipPosition} ${gameState.bullet}`);
  console.log(`${JSON.stringify(gameState.playerStates)}`);
}

function publishPlayerInput(payload: any) {
  socket.emit('player-input', payload);
}

function publishPlayerHitNotification(username: string) {
  socket.emit('player-hit', { username });
}

export default {
  onGameStart,
  onReceivedGameState,
  publishPlayerInput,
  publishPlayerHitNotification,
};
