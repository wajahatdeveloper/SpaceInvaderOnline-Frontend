import Phaser from 'phaser';
import * as socket from '../socket-handler';

interface Bullet {
  id: integer;
  toLaunch: boolean;
  bulletSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
}

interface Avatar {
  id: integer;
  x: integer | undefined;
  y: integer | undefined;
  avatarSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
}

interface Player {
  id: integer;
  score: integer;
  isAlive: boolean;
  avatar: Avatar;
}

interface GameStateUpdate {
  x: integer;
  y: integer;
  score: integer;
  isAlive: boolean;
}

export default class GameScene extends Phaser.Scene {
  canvasWidth: integer = 1400;
  canvasHeight: integer = 750;

  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  ship: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  visibleBullets: Bullet[] = [];
  avatars: Avatar[] = [];
  players: Player[] = [];
  gameState: GameStateUpdate | undefined;

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

  create() {
    this.cursorKeys = this.input.keyboard?.createCursorKeys();

    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion'),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });

    console.log(`Game Scene Loaded`);
    console.log(`My Unique Id is ${socket.myUniqueId}`);

    this.ship = this.physics.add
      .sprite(socket.latestShipPosition, this.canvasHeight - 32, 'ship')
      .setOrigin(0.5, 0.5);

    socket.enterRoom();
  }

  publishPlayerDeathNotification() {}
  publishPlayerInput() {}
  createBullet(bullet: Bullet) {}
  killPlayer(deadPlayerId: integer) {}

  update() {
    if (socket.isGameOn) {
      this.ship!.x = socket.latestShipPosition;

      for (const bullet of this.visibleBullets) {
        if (bullet.toLaunch) {
          bullet.toLaunch = false;
          this.createBullet(bullet);
        } else {
          bullet.bulletSprite.y -= 20;
          if (bullet.bulletSprite.y < 0 || bullet.id == bulletThatShotSomeone) {
            bullet.bulletSprite.destroy();
            const index = this.visibleBullets.indexOf(bullet);
            if (index !== -1) {
              this.visibleBullets.splice(index, 1);
            }
          }
        }
      }

      for (const avatar of this.avatars) {
        if (!this.players.filter(x => x.avatar === avatar)) {
          avatar.avatarSprite.destroy();
          const index = this.avatars.indexOf(avatar);
          if (index !== -1) {
            this.avatars.splice(index, 1);
          }
        }
      }

      for (const player of this.players) {
        if (player.isAlive) {
          player.avatar.x = this.gameState?.x;
          player.avatar.y = this.gameState?.y;
          //TODO: Display Score
        }
      }
    }
  }
}
