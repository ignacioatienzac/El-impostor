export enum GameMode {
  SIMILAR = 'SIMILAR',
  NO_SIMILAR = 'NO_SIMILAR'
}

export enum GamePhase {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  SUMMARY = 'SUMMARY'
}

export interface WordPair {
  group: string;
  impostor: string;
}

export interface Player {
  id: string;
  name: string;
  isImpostor: boolean;
  word: string;
}

export interface GameState {
  phase: GamePhase;
  mode: GameMode;
  players: Player[];
  currentPlayerIndex: number;
  wordPair: WordPair | null;
  startingPlayerIndex: number;
}