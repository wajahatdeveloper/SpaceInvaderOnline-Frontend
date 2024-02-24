import Phaser from 'phaser';
import LoadingScene from './scenes/loading-scene';
import GameScene from './scenes/game-scene';
import LobbyScene from './scenes/lobby-scene';
import Globals from './globals';

const config: Phaser.Types.Core.GameConfig = {
  parent: 'app',
  type: Phaser.AUTO,
  width: Globals.CANVAS_WIDTH,
  height: Globals.CANVAS_HEIGHT,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [LoadingScene, LobbyScene, GameScene],
};

export default new Phaser.Game(config);
