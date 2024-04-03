import { currentSessionId } from '.';
import { socket } from './net-phaser-connection';

function sendDataToAll(data: any) {
  socket.emit('sendDataToAll', currentSessionId, data);
}

function onReceivedData(fromClientId: string, data: any) {
  console.log(`received from ${fromClientId}, data: ${JSON.stringify(data)}`);
}

export { sendDataToAll, onReceivedData };
