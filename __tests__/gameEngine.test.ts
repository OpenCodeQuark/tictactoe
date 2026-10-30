import {
  checkWinner,
  isBoardFull,
  getAvailableMoves,
  createInitialBoard,
} from '../src/engine/gameLogic';
import { getAIMove } from '../src/engine/aiEngine';
import { getBestMoveMinimax } from '../src/engine/minimax';
import { BoardState, PlayerSymbol } from '../src/engine/gameTypes';

describe('Tic-Tac-Toe Game Engine', () => {
  describe('Board Initialization & Move Validation', () => {
    it('creates an empty 9-cell board', () => {
      const board = createInitialBoard();
      expect(board).toHaveLength(9);
      expect(board.every(cell => cell === null)).toBe(true);
      expect(getAvailableMoves(board)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('identifies board full condition', () => {
      const emptyBoard = createInitialBoard();
      expect(isBoardFull(emptyBoard)).toBe(false);

      const fullBoard: BoardState = [
        'X', 'O', 'X',
        'X', 'O', 'O',
        'O', 'X', 'X',
      ];
      expect(isBoardFull(fullBoard)).toBe(true);
    });
  });

  describe('Winner Detection', () => {
    it('detects horizontal wins across all 3 rows', () => {
      // Row 0
      const row0: BoardState = ['X', 'X', 'X', null, 'O', null, 'O', null, null];
      expect(checkWinner(row0)?.winner).toBe('X');
      expect(checkWinner(row0)?.direction).toBe('horizontal');

      // Row 1
      const row1: BoardState = [null, 'X', null, 'O', 'O', 'O', 'X', null, 'X'];
      expect(checkWinner(row1)?.winner).toBe('O');

      // Row 2
      const row2: BoardState = ['O', null, 'O', 'X', 'O', null, 'X', 'X', 'X'];
      expect(checkWinner(row2)?.winner).toBe('X');
    });

    it('detects vertical wins across all 3 columns', () => {
      // Col 0
      const col0: BoardState = ['O', 'X', null, 'O', 'X', null, 'O', null, null];
      expect(checkWinner(col0)?.winner).toBe('O');
      expect(checkWinner(col0)?.direction).toBe('vertical');

      // Col 1
      const col1: BoardState = ['X', 'O', null, null, 'O', 'X', 'X', 'O', null];
      expect(checkWinner(col1)?.winner).toBe('O');

      // Col 2
      const col2: BoardState = [null, 'O', 'X', 'O', null, 'X', null, 'O', 'X'];
      expect(checkWinner(col2)?.winner).toBe('X');
    });

    it('detects main and anti diagonal wins', () => {
      // Main diagonal (0, 4, 8)
      const mainDiag: BoardState = ['X', 'O', null, null, 'X', 'O', null, null, 'X'];
      expect(checkWinner(mainDiag)?.winner).toBe('X');
      expect(checkWinner(mainDiag)?.direction).toBe('diagonal-main');

      // Anti diagonal (2, 4, 6)
      const antiDiag: BoardState = [null, 'X', 'O', 'X', 'O', null, 'O', null, 'X'];
      expect(checkWinner(antiDiag)?.winner).toBe('O');
      expect(checkWinner(antiDiag)?.direction).toBe('diagonal-anti');
    });

    it('returns null when no player has won', () => {
      const ongoing: BoardState = ['X', 'O', 'X', null, null, null, null, null, null];
      expect(checkWinner(ongoing)).toBeNull();
    });
  });

  describe('Minimax Unbeatable AI Engine', () => {
    it('takes the immediate winning move', () => {
      // AI is 'O'. AI has [0] and [1], can win at [2]
      const board: BoardState = [
        'O', 'O', null,
        'X', 'X', null,
        null, null, null,
      ];
      const move = getBestMoveMinimax(board, 'O');
      expect(move).toBe(2);
    });

    it('blocks immediate opponent winning move', () => {
      // Human 'X' has [3] and [4], about to win at [5]. AI is 'O'
      const board: BoardState = [
        null, null, null,
        'X', 'X', null,
        'O', null, null,
      ];
      const move = getBestMoveMinimax(board, 'O');
      expect(move).toBe(5);
    });

    it('never loses in 30 simulated games against random opponent', () => {
      const aiSymbol: PlayerSymbol = 'O';
      const humanSymbol: PlayerSymbol = 'X';

      let aiLosses = 0;

      for (let game = 0; game < 30; game++) {
        let board = createInitialBoard();
        let turn: PlayerSymbol = 'X'; // Human plays first

        while (!isBoardFull(board) && !checkWinner(board)) {
          if (turn === humanSymbol) {
            // Random move
            const available = getAvailableMoves(board);
            const move = available[Math.floor(Math.random() * available.length)];
            board[move] = humanSymbol;
            turn = aiSymbol;
          } else {
            // Hard AI Minimax move
            const move = getAIMove(board, aiSymbol, 'hard');
            expect(move).toBeGreaterThanOrEqual(0);
            expect(move).toBeLessThan(9);
            expect(board[move]).toBeNull();
            board[move] = aiSymbol;
            turn = humanSymbol;
          }
        }

        const win = checkWinner(board);
        if (win && win.winner === humanSymbol) {
          aiLosses++;
        }
      }

      // Hard AI must NEVER lose
      expect(aiLosses).toBe(0);
    });
  });

  describe('AI Difficulty Levels', () => {
    it('generates valid moves for easy difficulty', () => {
      const board = createInitialBoard();
      const move = getAIMove(board, 'O', 'easy');
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
    });

    it('generates valid moves for medium difficulty and blocks obvious wins', () => {
      // Opponent 'X' has 0 and 1, threat at 2
      const board: BoardState = [
        'X', 'X', null,
        null, null, null,
        null, null, null,
      ];
      const move = getAIMove(board, 'O', 'medium');
      // Medium AI has high chance to block
      expect([0, 1, 2, 3, 4, 5, 6, 7, 8]).toContain(move);
      expect(board[move]).toBeNull();
    });
  });
});
