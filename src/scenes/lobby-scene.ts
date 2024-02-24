import Phaser from 'phaser';

export default class LobbyScene extends Phaser.Scene {
  constructor() {
    super('lobby-scene');
  }

  preload() {}

  update() {}

  onStartGameplay() {
    this.scene.switch('game-scene');
  }
}
