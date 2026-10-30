import { AIDifficulty, BoardState, PlayerSymbol } from './gameTypes';
import {
  checkWinner,
  getAvailableMoves,
  getOpponentSymbol,
  CENTER,
  CORNERS,
} from './gameLogic';
import { getBestMoveMinimax } from './minimax';

/**
 * Checks if a player can win in one move and returns that move index, or -1.
 */
function findImmediateWinningMove(
  board: BoardState,
  player: PlayerSymbol
): number {
  const availableMoves = getAvailableMoves(board);
  for (const move of availableMoves) {
    board[move] = player;
    const win = checkWinner(board);
    board[move] = null;
    if (win && win.winner === player) {
      return move;
    }
  }
  return -1;
}

/**
 * Picks an easy move: largely random moves with occasional sensible placement.
 */
function getEasyMove(
  board: BoardState,
  aiSymbol: PlayerSymbol,
  _humanSymbol: PlayerSymbol
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  // 35% chance to do something tactical (either take an immediate win or center)
  if (Math.random() < 0.35) {
    const winMove = findImmediateWinningMove(board, aiSymbol);
    if (winMove !== -1) return winMove;

    if (board[CENTER] === null) {
      return CENTER;
    }
  }

  // Otherwise, pick a random available cell
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}

/**
 * Picks a medium move:
 * - 100% takes immediate winning move
 * - 85% blocks immediate human win
 * - Prefers center
 * - Prefers corners
 * - Fallbacks to available moves
 */
function getMediumMove(
  board: BoardState,
  aiSymbol: PlayerSymbol,
  humanSymbol: PlayerSymbol
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  // 1. Take immediate win if present
  const winMove = findImmediateWinningMove(board, aiSymbol);
  if (winMove !== -1) return winMove;

  // 2. Block immediate human win (85% probability)
  if (Math.random() < 0.85) {
    const blockMove = findImmediateWinningMove(board, humanSymbol);
    if (blockMove !== -1) return blockMove;
  }

  // 3. Take center if available (70% probability)
  if (board[CENTER] === null && Math.random() < 0.7) {
    return CENTER;
  }

  // 4. Take an open corner (60% probability)
  const openCorners = CORNERS.filter(c => board[c] === null);
  if (openCorners.length > 0 && Math.random() < 0.6) {
    return openCorners[Math.floor(Math.random() * openCorners.length)];
  }

  // 5. Pick random available
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

/**
 * Main AI move generator based on selected difficulty.
 */
export function getAIMove(
  board: BoardState,
  aiSymbol: PlayerSymbol,
  difficulty: AIDifficulty
): number {
  const humanSymbol = getOpponentSymbol(aiSymbol);
  const available = getAvailableMoves(board);

  if (available.length === 0) {
    return -1;
  }

  switch (difficulty) {
    case 'easy':
      return getEasyMove(board, aiSymbol, humanSymbol);
    case 'medium':
      return getMediumMove(board, aiSymbol, humanSymbol);
    case 'hard':
    default:
      return getBestMoveMinimax(board, aiSymbol);
  }
}
