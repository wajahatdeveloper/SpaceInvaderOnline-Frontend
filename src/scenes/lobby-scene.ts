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
    const text = this.add.text(10, 10, 'Please enter name to play', {
      color: 'white',
      fontFamily: 'Arial',
      fontSize: '32px ',
    });
    const element: any = this.add
      .dom(Globals.CANVAS_WIDTH / 2, Globals.CANVAS_HEIGHT / 2)
      .createFromCache('inputform');
    element.setPerspective(800);
    element.addListener('click');
    element.on('click', (event: any) => {
      if (event.target.name === 'loginButton') {
        const inputField = element.getChildByName('username');
        if (inputField!.value === '') {
          //  Flash the prompt
          this.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
        } else {
          element.removeListener('click');
          this.tweens.add({
            targets: element.rotate3d,
            x: 1,
            w: 90,
            duration: 1500,
            ease: 'Power3',
          });
          this.tweens.add({
            targets: element,
            scaleX: 2,
            scaleY: 2,
            y: 700,
            duration: 1500,
            ease: 'Power3',
            onComplete: function () {
              element.setVisible(false);
            },
          });

          //  Populate the text with whatever they typed in as the username!
          text.setText(`Welcome ${inputField!.value}`);
        }
      } else {
        // Flash the prompt
        this.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
      }
    });

    this.tweens.add({
      targets: element,
      y: 300,
      duration: 3000,
      ease: 'Power3',
    });
  }

  update() {}

  onStartGameplay() {
    //this.scene.switch('game-scene');
  }
}
