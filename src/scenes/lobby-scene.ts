import Phaser from 'phaser';
import { init, hookGameStart } from '../socket-handling/socket-lobby';
import Globals from '../support/globals';

export default class LobbyScene extends Phaser.Scene {
  textUserName: any;
  textStatus: any;

  constructor() {
    super('lobby-scene');
  }

  create() {
    this.add.tileSprite(0, 0, 0, 0, 'background');
    this.createUI();

    init();
    hookGameStart(() => {
      this.scene.run('game-scene');
      this.scene.remove('lobby-scene');
    });
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
}
