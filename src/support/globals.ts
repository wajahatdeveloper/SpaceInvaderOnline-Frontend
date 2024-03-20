/* eslint-disable prefer-const */
// RESOURCE IDS
const ID_SHIP: string = 'ship';
const ID_BULLET: string = 'bullet';
const ID_EXPLOSION: string = 'explosion';
const ID_EXPLOSION_ANIM: string = 'explosionAnim';
const ID_AVATAR_A: string = 'avatarA';
const ID_AVATAR_B: string = 'avatarB';
const ID_AVATAR_C: string = 'avatarC';

// GLOBAL CONSTANTS
const CANVAS_WIDTH: integer = 1400;
const CANVAS_HEIGHT: integer = 750;
const SERVER_URL: string = 'http://localhost:8000';

// GLOBAL VARIABLES
let UserName: string = '';
let ClientId: string = resolveClientId();

function resolveClientId(): string {
  let newId = (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString();
  if (localStorage.getItem('clientId') == null) {
    localStorage.setItem('clientId', newId);
  }
  return newId;
}

export default {
  ID_SHIP,
  ID_BULLET,
  ID_EXPLOSION,
  ID_EXPLOSION_ANIM,
  ID_AVATAR_A,
  ID_AVATAR_B,
  ID_AVATAR_C,

  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SERVER_URL,

  UserName,
  ClientId,
};
