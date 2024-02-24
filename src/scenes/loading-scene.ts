import Phaser from 'phaser';
import Globals from '../globals';

export default class LoadingScene extends Phaser.Scene {
  loadingTime: Phaser.Time.TimerEvent | undefined;
  loadingProgress: Phaser.GameObjects.Rectangle | undefined;
  loadingBarValue: integer | undefined;

  constructor() {
    super('loading-scene');
  }

  preload() {
    this.loadGameResources();
    this.loadSceneResources();
  }

  loadGameResources() {
    this.load.image(
      Globals.ID_AVATAR_A,
      'https://cdn.glitch.com/f66772e3-bbf6-4f6d-b5d5-94559e3c1c6f%2FInvaderA_00%402x.png?v=1589228669385',
    );
    this.load.image(
      Globals.ID_AVATAR_B,
      'https://cdn.glitch.com/f66772e3-bbf6-4f6d-b5d5-94559e3c1c6f%2FInvaderB_00%402x.png?v=1589228660870',
    );
    this.load.image(
      Globals.ID_AVATAR_C,
      'https://cdn.glitch.com/f66772e3-bbf6-4f6d-b5d5-94559e3c1c6f%2FInvaderC_00%402x.png?v=1589228654058',
    );
    this.load.image(
      Globals.ID_SHIP,
      'https://cdn.glitch.com/f66772e3-bbf6-4f6d-b5d5-94559e3c1c6f%2FShip%402x.png?v=1589228730678',
    );
    this.load.image(
      Globals.ID_BULLET,
      'https://cdn.glitch.com/f66772e3-bbf6-4f6d-b5d5-94559e3c1c6f%2Fbullet.png?v=1589229887570',
    );
    this.load.spritesheet(
      Globals.ID_EXPLOSION,
      'https://cdn.glitch.com/f66772e3-bbf6-4f6d-b5d5-94559e3c1c6f%2Fexplosion57%20(2).png?v=1589491279459',
      {
        frameWidth: 32,
        frameHeight: 48,
      },
    );
  }

  loadSceneResources() {
    this.loadingProgress = this.add.rectangle(
      400,
      500,
      0,
      60,
      Phaser.Display.Color.GetColor(0, 0, 255),
      1,
    );
    this.loadingTime = this.time.delayedCall(1000, this.onLoadingComplete, [], this);
    this.loadingBarValue = 0;
    const text = this.add.text(620, 550, 'Loading..');
    text.setScale(2);
  }

  create() {
    this.anims.create({
      key: Globals.ID_EXPLOSION_ANIM,
      frames: this.anims.generateFrameNumbers(Globals.ID_EXPLOSION),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  update() {
    this.loadingBarValue = this.loadingTime!.getProgress();
    if (this.loadingProgress!.width < 600) {
      this.loadingProgress!.width += this.loadingBarValue * 40;
    }
  }

  onLoadingComplete() {
    console.log(`Loading Complete.`);
    this.scene.run('lobby-scene');
    this.scene.remove('loading-scene');
  }
}
