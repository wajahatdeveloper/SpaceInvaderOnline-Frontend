/* eslint-disable prefer-const */

export interface MatchUpdateObject {
  shootBullet: boolean;
  shipPositionX: number;
  playerUpdates: PlayerUpdateObject[];
}

export interface PlayerUpdateObject {
  x: number;
  y: number;
  score: number;
  isAlive: boolean;
}

export interface MatchInitalObject {
  playerInitals: PlayerInitalObject[];
}

export interface PlayerInitalObject {
  username: string;
  clientId: string;
  avatarIndex: number;
}

export interface PlayerState {
  x: number;
  y: number;
  score: number;
  isAlive: boolean;
}

class GameState {
  private _isGameOn: boolean = false;
  private _latestShipPosition: number = 0;
  private _bullet: number = 0;
  private _playerStates: PlayerState[] = [];
  private _matchInitalState: MatchInitalObject = {
    playerInitals: [],
  };

  private _matchOver: boolean = false;

  get isMatchOver(): boolean {
    return this._matchOver;
  }

  set isMatchOver(value: boolean) {
    this._matchOver = value;
  }

  private _winnerId: string = '';

  get winnerId(): string {
    return this._winnerId;
  }

  set winnerId(value: string) {
    this._winnerId = value;
  }

  private _loserId: string = '';

  get loserId(): string {
    return this._loserId;
  }

  set loserId(value: string) {
    this._loserId = value;
  }

  // Getter and Setter for matchInitalState
  get matchInitalState(): MatchInitalObject {
    return this._matchInitalState;
  }

  set matchInitalState(value: MatchInitalObject) {
    this._matchInitalState = value;
  }

  // Getter and Setter for isGameOn
  get isGameOn(): boolean {
    return this._isGameOn;
  }

  set isGameOn(value: boolean) {
    this._isGameOn = value;
  }

  // Getter and Setter for latestShipPosition
  get latestShipPosition(): number {
    return this._latestShipPosition;
  }

  set latestShipPosition(value: number) {
    this._latestShipPosition = value;
  }

  // Getter and Setter for bullet
  get bullet(): number {
    return this._bullet;
  }

  set bullet(value: number) {
    this._bullet = value;
  }

  // Getter and Setter for players
  get playerStates(): any[] {
    return this._playerStates;
  }

  set playerStates(value: any[]) {
    this._playerStates = value;
  }
}

export const gameState = new GameState();
