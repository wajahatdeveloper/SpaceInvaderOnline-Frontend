import { Player } from '../support/types';
import Globals from '../support/globals';
import socketGameplay from '../socket-handling/socket-gameplay';
import { gameState } from '../socket-handling/socket-state';

export default class GameScene extends Phaser.Scene {
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  ship: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  visibleBullets: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
  players: Player[] = [];
  amIAlive: boolean = true;

  getPlayerByClientId(clientId: string): Player | undefined {
    return this.players.find(p => p.clientId === clientId);
  }

  constructor() {
    super('game-scene');
  }

  create() {
    this.cursorKeys = this.input.keyboard?.createCursorKeys();

    this.ship = this.physics.add
      .sprite(Globals.CANVAS_WIDTH / 2 - 32, Globals.CANVAS_HEIGHT - 32, Globals.ID_SHIP)
      .setOrigin(0.5, 0.5);
    this.ship.setCollideWorldBounds(true);

    console.log(`Game Scene Loaded`);

    // initialize local player states from match initial state
    gameState.matchInitalState.playerInitals.forEach(playerInital => {
      const player: Player = {
        username: playerInital.username,
        clientId: playerInital.clientId,
        score: 0,
        isAlive: true,
        avatarIndex: playerInital.avatarIndex,
        avatarSprite: undefined,
      };
      gameState.playerStates.push(player);
      this.players.push(player);
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
      .sprite(gameState.latestShipPosition, Globals.CANVAS_HEIGHT - 32, Globals.ID_BULLET)
      .setOrigin(0.5, 0.5)
      .setVelocityY(Globals.BULLET_VELOCITY_Y);
    this.visibleBullets.push(bulletObject);

    const me = this.getPlayerByClientId(Globals.UserName);

    // register bullet collision with player avatar
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

  killPlayer() {
    this.amIAlive = false;
  }

  update(time: number, delta: number) {
    if (gameState.isGameOn) {
      // update ship position from state
      this.ship!.x = gameState.latestShipPosition;

      // update bullet instantiation from state
      if (gameState.bullet > 0) {
        this.createBullet();
        gameState.bullet = 0;
      }

      // clean up bullets no longer in view
      this.visibleBullets.forEach(bullet => {
        if (!bullet.visible) {
          bullet.destroy();
        }
      });

      for (let index = 0; index < this.players.length; index++) {
        if (this.players[index].avatarSprite === undefined) {
          // instantiate player avatars (one time only)
          this.players[index].avatarSprite = this.physics.add
            .sprite(0, 0, index === 0 ? Globals.ID_AVATAR_A : Globals.ID_AVATAR_B)
            .setOrigin(0.5, 0.5)
            .setCollideWorldBounds(true);
        } else {
          // update local player states from match update state
          gameState.playerStates.forEach((playerState, index) => {
            this.players[index].avatarSprite!.x = playerState.x;
            this.players[index].avatarSprite!.y = playerState.y;
            this.players[index].score = playerState.score;
            this.players[index].isAlive = playerState.isAlive;
          });
        }
      }

      this.updatePlayerInput();
    }
  }
}
