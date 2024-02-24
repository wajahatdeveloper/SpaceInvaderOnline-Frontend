import Phaser from 'phaser';
import LoadingScene from './scenes/loading-scene';
import GameScene from './scenes/game-scene';

const config: Phaser.Types.Core.GameConfig = {
  parent: 'app',
  type: Phaser.AUTO,
  width: 1400,
  height: 750,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [LoadingScene, GameScene],
};

export default new Phaser.Game(config);
