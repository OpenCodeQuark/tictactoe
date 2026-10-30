export type PlayerSymbol = 'X' | 'O';
export type CellValue = PlayerSymbol | null;
export type BoardState = CellValue[];

export type GameMode = 'pvp' | 'ai';
export type AIDifficulty = 'easy' | 'medium' | 'hard';
export type FirstTurnChoice = 'player1' | 'player2' | 'random';

export type GameStatus = 'idle' | 'playing' | 'won' | 'draw';

export interface WinInfo {
  winner: PlayerSymbol;
  line: [number, number, number];
  direction: 'horizontal' | 'vertical' | 'diagonal-main' | 'diagonal-anti';
}

export interface PlayerConfig {
  name: string;
  symbol: PlayerSymbol;
  isAI?: boolean;
}

export interface GameHistoryItem {
  id: string;
  timestamp: number;
  mode: GameMode;
  playerXName: string;
  playerOName: string;
  winner: PlayerSymbol | 'draw';
  difficulty?: AIDifficulty;
  totalMoves: number;
  dateFormatted: string;
}

export interface DifficultyStats {
  games: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface GameStats {
  totalGames: number;
  pvpGames: number;
  aiGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number; // percentage 0-100
  currentStreak: number;
  bestStreak: number;
  easyStats: DifficultyStats;
  mediumStats: DifficultyStats;
  hardStats: DifficultyStats;
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  animationsEnabled: boolean;
  theme: 'cyber-midnight' | 'neon-pulse';
}

export type RootScreen = 
  | 'Splash'
  | 'Home'
  | 'GameSetup'
  | 'Game'
  | 'History'
  | 'Statistics'
  | 'Settings';

export interface GameSetupParams {
  mode: GameMode;
  player1Name?: string;
  player2Name?: string;
  player1Symbol?: PlayerSymbol;
  difficulty?: AIDifficulty;
  firstTurn?: FirstTurnChoice;
}

