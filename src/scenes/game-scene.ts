import Phaser from 'phaser';
import * as socket from '../socket-handler';

interface Bullet {
  [key: integer]: integer;
  id: integer;
  bulletSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
}

interface Player {
  [key: integer]: integer;
  x: integer | undefined;
  y: integer | undefined;
  score: integer;
  isAlive: boolean;
  avatarSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
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
  visibleBullets: Map<integer, Bullet> = new Map();
  players: Map<integer, Player> = new Map();
  gameState: GameStateUpdate | undefined;
  amIAlive: boolean = true;
  bulletThatShotMe: integer = 0;
  bulletThatShotSomeone: integer = 0;

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
    this.ship.setCollideWorldBounds(true);

    socket.enterRoom();
  }

  sendPlayerLostNotification() {
    if (this.amIAlive) {
      socket.publishPlayerLostNotification(this.bulletThatShotMe, socket.myUniqueId);
    }
  }

  updatePlayerInput() {
    let keyPressed = '';

    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys!.left) && this.amIAlive) {
      keyPressed = 'left';
    } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys!.right) && this.amIAlive) {
      keyPressed = 'right';
    }

    if (keyPressed === '') return;

    const payload = {
      keyPressed,
      playerId: socket.myUniqueId,
    };

    socket.publishPlayerInput(payload);
  }

  createBullet(bulletState: any) {
    const bullet: Bullet = {
      id: bulletState.id,
      bulletSprite: this.physics.add
        .sprite(socket.latestShipPosition, this.canvasHeight - 32, 'bullet')
        .setOrigin(0.5, 0.5),
    };
    this.visibleBullets.set(bulletState.id, bullet);

    if (
      this.amIAlive &&
      this.players.get(socket.myUniqueId)?.avatarSprite &&
      this.physics.add.overlap(
        this.visibleBullets.get(bulletState.id)!.bulletSprite,
        this.players.get(socket.myUniqueId)!.avatarSprite,
        this.sendPlayerLostNotification,
        undefined,
        this,
      )
    ) {
      this.bulletThatShotMe = bulletState.id;
    }
  }

  killPlayer() {}

  update() {
    if (socket.isGameOn) {
      // update ship position from state
      this.ship!.x = socket.latestShipPosition;

      // update bullet instantiation from state
      for (const bullet of socket.bullets) {
        if (this.visibleBullets.get(bullet.id)) {
          // const sprite = this.visibleBullets.get(bullet.id)!.bulletSprite;
          // sprite.setX(bullet.y);
        } else {
          this.createBullet(bullet);
        }
      }

      // update bullet positions and check bounds
      for (const bullet of this.visibleBullets) {
        bullet[1].bulletSprite.y -= 20;
        if (bullet[1].bulletSprite.y < 0 || bullet[1].id == this.bulletThatShotSomeone) {
          bullet[1].bulletSprite.destroy();
          this.visibleBullets.delete(bullet[0]);
        }
      }

      socket.players.forEach((item, index, arr) => {
        this.players.set(item.id, item);
      });

      this.players.forEach((player, key, map) => {
        if (player.avatarSprite == undefined) {
          player.avatarSprite = this.physics.add
            .sprite(player.x!, player.y!, `${key}-avatar`, 'avatarA_1')
            .setOrigin(0.5, 0.5);
          player.avatarSprite.setCollideWorldBounds(true);
        }
        // if (player.isAlive) {
        //   player.avatarSprite.x = this.gameState!.x;
        //   player.avatarSprite.y = this.gameState!.y;
        // }
      });
    }

    this.updatePlayerInput();
  }
}
