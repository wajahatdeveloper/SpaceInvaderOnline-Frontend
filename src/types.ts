import Phaser from 'phaser';

export interface Bullet {
  [key: integer]: integer;
  id: integer;
  bulletSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
}
export interface Player {
  [key: integer]: integer;
  x: integer | undefined;
  y: integer | undefined;
  score: integer;
  isAlive: boolean;
  avatarSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
}
export interface GameStateUpdate {
  x: integer;
  y: integer;
  score: integer;
  isAlive: boolean;
}