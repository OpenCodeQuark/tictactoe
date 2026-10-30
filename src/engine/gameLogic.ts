import { BoardState, PlayerSymbol, WinInfo } from './gameTypes';

export const WINNING_COMBINATIONS: Array<{
  line: [number, number, number];
  direction: 'horizontal' | 'vertical' | 'diagonal-main' | 'diagonal-anti';
}> = [
  // Rows
  { line: [0, 1, 2], direction: 'horizontal' },
  { line: [3, 4, 5], direction: 'horizontal' },
  { line: [6, 7, 8], direction: 'horizontal' },
  // Columns
  { line: [0, 3, 6], direction: 'vertical' },
  { line: [1, 4, 7], direction: 'vertical' },
  { line: [2, 5, 8], direction: 'vertical' },
  // Diagonals
  { line: [0, 4, 8], direction: 'diagonal-main' },
  { line: [2, 4, 6], direction: 'diagonal-anti' },
];

export const CORNERS = [0, 2, 6, 8];
export const CENTER = 4;
export const EDGES = [1, 3, 5, 7];

export function createInitialBoard(): BoardState {
  return Array(9).fill(null);
}

export function checkWinner(board: BoardState): WinInfo | null {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo.line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as PlayerSymbol,
        line: combo.line,
        direction: combo.direction,
      };
    }
  }
  return null;
}

export function isBoardFull(board: BoardState): boolean {
  return board.every(cell => cell !== null);
}

export function getAvailableMoves(board: BoardState): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

export function isValidMove(board: BoardState, index: number): boolean {
  return index >= 0 && index < 9 && board[index] === null;
}

export function getOpponentSymbol(symbol: PlayerSymbol): PlayerSymbol {
  return symbol === 'X' ? 'O' : 'X';
}
