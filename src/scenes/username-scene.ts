import Phaser from 'phaser';
import Globals from '../globals';

export default class UsernameScene extends Phaser.Scene {
  element: any;
  text: any;

  constructor() {
    super('username-scene');
  }

  preload() {
    this.load.html('inputform', 'assets/inputform.html');
    this.load.image('background', 'assets/background.jpg');
    console.log(`Username Scene Loaded.`);
  }

  create() {
    this.add.tileSprite(0, 0, 0, 0, 'background');
    this.createUI();
  }

  createUI() {
    this.text = this.add.text(10, 10, 'Please enter name to play', {
      color: 'white',
      fontFamily: 'Arial',
      fontSize: '32px ',
    });
    this.element = this.add
      .dom(Globals.CANVAS_WIDTH / 2, Globals.CANVAS_HEIGHT / 2)
      .createFromCache('inputform');
    this.element.setPerspective(800);
    this.element.addListener('click');
    this.element.on('click', this.handleEventButton);

    this.tweens.add({
      targets: this.element,
      y: 300,
      duration: 3000,
      ease: 'Power3',
    });
  }

  handleEventButton = (event: any) => {
    if (event.target.name === 'loginButton') {
      const inputField = this.element.getChildByName('username');
      if (inputField!.value === '') {
        //  Flash the prompt
        this.tweens.add({
          targets: this.text,
          alpha: 0.1,
          duration: 200,
          ease: 'Power3',
          yoyo: true,
        });
      } else {
        this.element.removeListener('click');
        this.tweens.add({
          targets: this.element.rotate3d,
          x: 1,
          w: 90,
          duration: 1500,
          ease: 'Power3',
        });
        this.tweens.add({
          targets: this.element,
          scaleX: 2,
          scaleY: 2,
          y: 700,
          duration: 1500,
          ease: 'Power3',
          onComplete: function () {
            this.element.setVisible(false);
          },
        });

        //  Populate the text with whatever they typed in as the username!
        this.text.setText(`Welcome ${inputField!.value}`);
        Globals.UserName = inputField!.value;
        this.gotoLobbyScene();
      }
    } else {
      // Flash the prompt
      this.tweens.add({
        targets: this.text,
        alpha: 0.1,
        duration: 200,
        ease: 'Power3',
        yoyo: true,
      });
    }
  };

  update() {}

  gotoLobbyScene() {
    this.scene.switch('lobby-scene');
  }
}
