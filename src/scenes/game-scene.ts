import { Player, GameStateUpdate } from '../support/types';
import Globals from '../support/globals';
import socketGameplay from '../socket-handling/socket-gameplay';
import { gameState } from '../socket-handling/socket-state';

export default class GameScene extends Phaser.Scene {
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  ship: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  visibleBullets: any[] = [];
  players: Player[] = [];
  gameState: GameStateUpdate | undefined;
  amIAlive: boolean = true;
  bulletThatShotMe: integer = 0;
  bulletThatShotSomeone: integer = 0;

  getPlayerByUsername(username: string): Player | undefined {
    return this.players.find(p => p.username === username);
  }

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

    gameState.matchInitalState.playerInitals.forEach(playerInital => {
      const player: Player = {
        username: playerInital.username,
        x: 0,
        y: 0,
        score: 0,
        isAlive: true,
        avatarIndex: playerInital.avatarIndex,
        avatarSprite: undefined,
      };
      gameState.playerStates.push(player);
    });

    socketGameplay.onGameStart();
  }

  sendPlayerLostNotification() {
    if (this.amIAlive) {
      socketGameplay.publishPlayerHitNotification(Globals.UserName);
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
      .sprite(gameState.latestShipPosition, Globals.CANVAS_HEIGHT - 32, 'bullet')
      .setOrigin(0.5, 0.5);

    bulletObject.setVelocityY(-5);

    this.visibleBullets.push(bulletObject);

    const me = this.getPlayerByUsername(Globals.UserName);

    if (
      this.amIAlive &&
      me?.avatarSprite &&
      this.physics.add.overlap(
        bulletObject,
        me?.avatarSprite,
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
    if (gameState.isGameOn) {
      // update ship position from state
      this.ship!.x = gameState.latestShipPosition;

      // update bullet instantiation from state
      if (gameState.bullet > 0) {
        this.createBullet();
      }

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
