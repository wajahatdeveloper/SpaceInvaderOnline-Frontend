import Phaser from 'phaser';
import Globals from '../globals';

export default class LobbyScene extends Phaser.Scene {
  constructor() {
    super('lobby-scene');
  }

  preload() {
    this.load.html('inputform', 'assets/inputform.html');
    this.load.image('background', 'assets/background.jpg');
    console.log(`Lobby Loaded.`);
  }

  create() {
    this.add.tileSprite(0, 0, 0, 0, 'background');
    const element = this.add
      .dom(Globals.CANVAS_WIDTH / 2, Globals.CANVAS_HEIGHT / 2)
      .createFromCache('inputform');
  }

  update() {}

  onStartGameplay() {
    //this.scene.switch('game-scene');
  }
}
