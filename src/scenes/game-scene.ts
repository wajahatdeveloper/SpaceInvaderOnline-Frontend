import Phaser from 'phaser';
import { Socket, io } from 'socket.io-client';

export default class GameScene extends Phaser.Scene {
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  serverUrl: string = 'http://localhost:8000';
  socket: Socket = io(this.serverUrl);
  myClientId: number = 0;

  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image(
      'avatarA_1',
      'https://cdn.glitch.com/f66772e3-bbf6-4f6d-b5d5-94559e3c1c6f%2FInvaderA_00%402x.png?v=1589228669385',
    );
    this.load.image(
      'avatarA_2',
      'https://cdn.glitch.com/f66772e3-bbf6-4f6d-b5d5-94559e3c1c6f%2FInvaderB_00%402x.png?v=1589228660870',
    );
    this.load.image(
      'avatarA_3',
      'https://cdn.glitch.com/f66772e3-bbf6-4f6d-b5d5-94559e3c1c6f%2FInvaderC_00%402x.png?v=1589228654058',
    );
    this.load.image(
      'ship',
      'https://cdn.glitch.com/f66772e3-bbf6-4f6d-b5d5-94559e3c1c6f%2FShip%402x.png?v=1589228730678',
    );
    this.load.image(
      'bullet',
      'https://cdn.glitch.com/f66772e3-bbf6-4f6d-b5d5-94559e3c1c6f%2Fbullet.png?v=1589229887570',
    );
    this.load.spritesheet(
      'explosion',
      'https://cdn.glitch.com/f66772e3-bbf6-4f6d-b5d5-94559e3c1c6f%2Fexplosion57%20(2).png?v=1589491279459',
      {
        frameWidth: 32,
        frameHeight: 48,
      },
    );
  }

  onConnect() {
    this.myClientId = Math.random() * 9999 + 1;
    this.socket.emit('enter', this.myClientId);
    console.log(`Connected to ws with id: ${this.socket.id}`);
  }

  onDisconnect() {
    console.log(`Disconnected from ws`);
  }

  create() {
    this.cursorKeys = this.input.keyboard?.createCursorKeys();

    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion'),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });

    this.socket.on('connect', this.onConnect);
    this.socket.on('disconnect', this.onDisconnect);

    console.log(`Game Scene Loaded`);
  }

  updateGameState() {}
  checkGameOver() {}

  publishPlayerDeathNotification() {}
  publishPlayerInput() {}
  createBullet() {}
  killPlayer(deadPlayerId: integer) {}

  update() {
    this.updateGameState();
    this.checkGameOver();
  }
}
