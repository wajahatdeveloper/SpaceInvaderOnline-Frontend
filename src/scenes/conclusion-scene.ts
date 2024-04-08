import Phaser from 'phaser';
import Globals from '../support/globals';
import { gameState } from '../socket-handling/socket-state';
import globals from '../support/globals';

export default class ConclusionScene extends Phaser.Scene {
  windialog: Phaser.GameObjects.DOMElement | undefined;
  losedialog: Phaser.GameObjects.DOMElement | undefined;

  constructor() {
    super('conclusion-scene');
  }

  preload() {
    this.load.html('winDialog', 'assets/windialog.html');
    this.load.html('loseDialog', 'assets/losedialog.html');
    this.load.image('background', 'assets/background.jpg');
    console.log(`Conclusion Scene Loaded.`);
  }

  create() {
    this.add.tileSprite(0, 0, 0, 0, 'background');
    this.createUI();

    if (gameState.loserId === globals.ClientId) {
      this.losedialog?.setVisible(true);
    } else {
      this.windialog?.setVisible(true);
    }
  }

  createUI() {
    this.windialog = this.add
      .dom(Globals.CANVAS_WIDTH / 2, Globals.CANVAS_HEIGHT / 2)
      .createFromCache('winDialog')
      .setVisible(false)
      .setPerspective(800)
      .addListener('click')
      .on('click', this.handleWinOkButton);

    this.losedialog = this.add
      .dom(Globals.CANVAS_WIDTH / 2, Globals.CANVAS_HEIGHT / 2)
      .createFromCache('loseDialog')
      .setVisible(false)
      .setPerspective(800)
      .addListener('click')
      .on('click', this.handleLoseOkButton);
  }

  handleWinOkButton = (event: any) => {
    if (event.target.name === 'okButton') {
      this.windialog!.removeListener('click');
      this.windialog!.setVisible(false);
      this.restartGame();
    }
  };

  handleLoseOkButton = (event: any) => {
    if (event.target.name === 'okButton') {
      this.losedialog!.removeListener('click');
      this.losedialog!.setVisible(false);
      this.restartGame();
    }
  };

  restartGame() {
    location.reload();
  }
}
