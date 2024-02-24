import Phaser from 'phaser';
import Globals from '../globals';

export default class LobbyScene extends Phaser.Scene {
  textUserName: any;
  textStatus: any;

  constructor() {
    super('lobby-scene');
  }

  preload() {}

  create() {
    this.add.tileSprite(0, 0, 0, 0, 'background');
    this.createUI();
  }

  private createUI() {
    this.textUserName = this.add.text(10, 10, `Welcome ${Globals.UserName}`, {
      color: 'white',
      fontFamily: 'Arial',
      fontSize: '32px ',
    });
    this.textStatus = this.add
      .text(Globals.CANVAS_WIDTH / 2, Globals.CANVAS_HEIGHT / 2, 'Searching for Players..', {
        color: 'white',
        fontFamily: 'Arial',
        fontSize: '32px ',
      })
      .setOrigin(0.5, 0.5);
  }

  gotoGameplay() {
    //this.scene.switch('game-scene');
  }
}
