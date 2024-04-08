import Phaser from 'phaser';

export interface Bullet {
  [key: integer]: integer;
  id: integer;
  bulletSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
}

export interface Player {
  [key: integer]: integer;
  username: string;
  clientId: string;
  score: integer;
  isAlive: boolean;
  avatarSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  avatarIndex: number;
}

export interface GameStateUpdate {
  x: integer;
  y: integer;
  score: integer;
  isAlive: boolean;
}
