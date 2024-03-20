import { Player, GameStateUpdate } from '../support/types';
import Globals from '../support/globals';
import socketGameplay from '../socket-handling/socket-gameplay';
import { getState } from '../socket-handling/socket-state';

export default class GameScene extends Phaser.Scene {
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  ship: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  visibleBullets: any[] = [];
  players: Map<string, Player> = new Map();
  gameState: GameStateUpdate | undefined;
  amIAlive: boolean = true;
  bulletThatShotMe: integer = 0;
  bulletThatShotSomeone: integer = 0;

  constructor() {
    super('game-scene');
  }

  create() {
    this.cursorKeys = this.input.keyboard?.createCursorKeys();

    this.ship = this.physics.add
      .sprite(Globals.CANVAS_WIDTH / 2 - 32, Globals.CANVAS_HEIGHT - 32, 'ship')
      .setOrigin(0.5, 0.5);
    this.ship.setCollideWorldBounds(true);

    console.log(`Game Scene Loaded`);

    socketGameplay.onGameStart();
  }

  sendPlayerLostNotification() {
    if (this.amIAlive) {
      socketGameplay.publishPlayerLostNotification(this.bulletThatShotMe, Globals.UserName);
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

    socketGameplay.publishPlayerInput(keyPressed);
  }

  createBullet() {
    const bulletObject = this.physics.add
      .sprite(getState().latestShipPosition, Globals.CANVAS_HEIGHT - 32, 'bullet')
      .setOrigin(0.5, 0.5);

    bulletObject.setVelocityY(-5);

    this.visibleBullets.push(bulletObject);

    if (
      this.amIAlive &&
      this.players.get(Globals.UserName)?.avatarSprite &&
      this.physics.add.overlap(
        bulletObject,
        this.players.get(Globals.UserName)!.avatarSprite,
        this.sendPlayerLostNotification,
        undefined,
        this,
      )
    ) {
      bulletObject.destroy();
    }
  }

  killPlayer() {}

  update(time: number, delta: number) {
    if (getState().isGameOn) {
      // update ship position from state
      this.ship!.x = getState().latestShipPosition;

      // update bullet instantiation from state
      if (getState().bullet > 0) {
        this.createBullet();
      }

      getState().players.forEach((item, index, arr) => {
        this.players.set(item.id, item);
      });

      this.players.forEach((player, key, map) => {
        if (player.avatarSprite == undefined) {
          player.avatarSprite = this.physics.add
            .sprite(player.x!, player.y!, `${key}-avatar`, 'avatarA_1')
            .setOrigin(0.5, 0.5);
          player.avatarSprite.setCollideWorldBounds(true);
        }
      });
    }

    this.updatePlayerInput();
  }
}
