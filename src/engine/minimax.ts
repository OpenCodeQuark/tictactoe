import { BoardState, PlayerSymbol } from './gameTypes';
import { checkWinner, getAvailableMoves, getOpponentSymbol } from './gameLogic';

interface MinimaxResult {
  score: number;
  bestMove: number;
}

/**
 * Depth-aware Minimax with Alpha-Beta Pruning.
 * Evaluates the board state recursively.
 * Positive score favors AI, negative favors opponent.
 * Depth penalty ensures AI picks faster wins and delays inevitable defeats.
 */
export function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  aiSymbol: PlayerSymbol,
  humanSymbol: PlayerSymbol,
  alpha = -Infinity,
  beta = Infinity
): MinimaxResult {
  const winInfo = checkWinner(board);
  if (winInfo) {
    if (winInfo.winner === aiSymbol) {
      return { score: 10 - depth, bestMove: -1 };
    } else {
      return { score: -10 + depth, bestMove: -1 };
    }
  }

  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return { score: 0, bestMove: -1 };
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = aiSymbol;
      const evaluation = minimax(board, depth + 1, false, aiSymbol, humanSymbol, alpha, beta);
      board[move] = null; // backtrack

      if (evaluation.score > maxScore) {
        maxScore = evaluation.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) {
        break; // Alpha-beta cutoff
      }
    }

    return { score: maxScore, bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = humanSymbol;
      const evaluation = minimax(board, depth + 1, true, aiSymbol, humanSymbol, alpha, beta);
      board[move] = null; // backtrack

      if (evaluation.score < minScore) {
        minScore = evaluation.score;
        bestMove = move;
      }
      beta = Math.min(beta, minScore);
      if (beta <= alpha) {
        break; // Alpha-beta cutoff
      }
    }

    return { score: minScore, bestMove };
  }
}

/**
 * Returns the best move for AI using minimax algorithm.
 * Guarantees unbeatable play.
 */
export function getBestMoveMinimax(
  board: BoardState,
  aiSymbol: PlayerSymbol
): number {
  const humanSymbol = getOpponentSymbol(aiSymbol);
  const result = minimax([...board], 0, true, aiSymbol, humanSymbol);
  return result.bestMove;
}
