/* eslint-disable prefer-const */

let isGameOn: boolean = false;
let latestShipPosition: integer = 0;
let bullet: integer = 0;
let players: any[] = [];

function setState(state: any) {
  isGameOn = state.isGameOn;
  latestShipPosition = state.latestShipPosition;
  bullet = state.bullet;
  players = state.playerUpdates;
}

function getState() {
  return { isGameOn, latestShipPosition, bullet, players };
}

export { getState, setState };
