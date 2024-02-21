import Phaser from 'phaser';
import LoadingScene from './scenes/LoadingScene';

const config: Phaser.Types.Core.GameConfig = {
  parent: 'app',
  type: Phaser.AUTO,
  width: 1400,
  height: 750,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [LoadingScene],
};

export default new Phaser.Game(config);
