import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BoardState,
  PlayerSymbol,
  GameStatus,
  WinInfo,
  GameSetupParams,
} from '../engine/gameTypes';
import {
  createInitialBoard,
  checkWinner,
  isBoardFull,
  isValidMove,
  getOpponentSymbol,
} from '../engine/gameLogic';
import { getAIMove } from '../engine/aiEngine';
import { hapticsService } from '../services/hapticsService';
import { soundService } from '../services/soundService';

interface MoveRecord {
  cellIndex: number;
  symbol: PlayerSymbol;
}

export function useGame(
  params: GameSetupParams,
  onGameEnd?: (winner: PlayerSymbol | 'draw', totalMoves: number) => void
) {
  const {
    mode,
    player1Name = 'Player 1',
    player2Name = mode === 'ai' ? 'AI Bot' : 'Player 2',
    player1Symbol = 'X',
    difficulty = 'medium',
    firstTurn = 'player1',
  } = params;

  const player2Symbol = getOpponentSymbol(player1Symbol);
  const aiSymbol = player2Symbol;

  // Determine who plays first
  const getStartingSymbol = useCallback((): PlayerSymbol => {
    if (firstTurn === 'player1') return player1Symbol;
    if (firstTurn === 'player2') return player2Symbol;
    return Math.random() < 0.5 ? player1Symbol : player2Symbol;
  }, [firstTurn, player1Symbol, player2Symbol]);

  const [board, setBoard] = useState<BoardState>(createInitialBoard);
  const [currentTurn, setCurrentTurn] = useState<PlayerSymbol>(getStartingSymbol);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [winInfo, setWinInfo] = useState<WinInfo | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);

  const [scores, setScores] = useState({
    player1: 0,
    player2: 0,
    draws: 0,
  });

  // Ref to hold timeouts
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameEndedReportedRef = useRef(false);

  // Clear pending timers on unmount
  useEffect(() => {
    return () => {
      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
      }
    };
  }, []);

  const handleGameEnd = useCallback(
    (winner: PlayerSymbol | 'draw', movesCount: number) => {
      if (gameEndedReportedRef.current) return;
      gameEndedReportedRef.current = true;

      if (winner === 'draw') {
        setScores(s => ({ ...s, draws: s.draws + 1 }));
        hapticsService.trigger('warning');
        soundService.play('draw');
      } else {
        if (winner === player1Symbol) {
          setScores(s => ({ ...s, player1: s.player1 + 1 }));
        } else {
          setScores(s => ({ ...s, player2: s.player2 + 1 }));
        }
        hapticsService.trigger('success');
        soundService.play('win');
      }

      if (onGameEnd) {
        onGameEnd(winner, movesCount);
      }
    },
    [onGameEnd, player1Symbol]
  );

  // Trigger AI move when it's AI's turn
  useEffect(() => {
    if (
      mode === 'ai' &&
      status === 'playing' &&
      currentTurn === aiSymbol &&
      !isAIThinking
    ) {
      setIsAIThinking(true);

      aiTimerRef.current = setTimeout(() => {
        setBoard(currentBoard => {
          // Double check status and board state
          if (status !== 'playing' && checkWinner(currentBoard)) {
            setIsAIThinking(false);
            return currentBoard;
          }

          const aiMoveIndex = getAIMove(currentBoard, aiSymbol, difficulty);
          if (aiMoveIndex === -1 || !isValidMove(currentBoard, aiMoveIndex)) {
            setIsAIThinking(false);
            return currentBoard;
          }

          const newBoard = [...currentBoard];
          newBoard[aiMoveIndex] = aiSymbol;

          setMoveHistory(prev => [
            ...prev,
            { cellIndex: aiMoveIndex, symbol: aiSymbol },
          ]);

          hapticsService.trigger('light');
          soundService.play(aiSymbol === 'X' ? 'move_x' : 'move_o');

          const win = checkWinner(newBoard);
          if (win) {
            setWinInfo(win);
            setStatus('won');
            setIsAIThinking(false);
            handleGameEnd(aiSymbol, moveHistory.length + 1);
            return newBoard;
          }

          if (isBoardFull(newBoard)) {
            setStatus('draw');
            setIsAIThinking(false);
            handleGameEnd('draw', newBoard.filter(c => c !== null).length);
            return newBoard;
          }

          setCurrentTurn(player1Symbol);
          setIsAIThinking(false);
          return newBoard;
        });
      }, 550);
    }
  }, [
    board,
    currentTurn,
    status,
    mode,
    aiSymbol,
    difficulty,
    isAIThinking,
    player1Symbol,
    handleGameEnd,
    moveHistory.length,
  ]);

  // Human player move handler
  const makeMove = useCallback(
    (index: number) => {
      if (status !== 'playing') return;
      if (!isValidMove(board, index)) return;
      if (mode === 'ai' && (currentTurn === aiSymbol || isAIThinking)) return;

      const newBoard = [...board];
      newBoard[index] = currentTurn;

      const newHistory = [...moveHistory, { cellIndex: index, symbol: currentTurn }];
      setMoveHistory(newHistory);
      setBoard(newBoard);

      hapticsService.trigger('light');
      soundService.play(currentTurn === 'X' ? 'move_x' : 'move_o');

      const win = checkWinner(newBoard);
      if (win) {
        setWinInfo(win);
        setStatus('won');
        handleGameEnd(currentTurn, newHistory.length);
        return;
      }

      if (isBoardFull(newBoard)) {
        setStatus('draw');
        handleGameEnd('draw', newHistory.length);
        return;
      }

      const nextTurn = getOpponentSymbol(currentTurn);
      setCurrentTurn(nextTurn);
    },
    [
      board,
      currentTurn,
      status,
      mode,
      aiSymbol,
      isAIThinking,
      moveHistory,
      handleGameEnd,
    ]
  );

  // Undo move
  const undo = useCallback(() => {
    if (moveHistory.length === 0 || isAIThinking) return;

    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      setIsAIThinking(false);
    }

    if (mode === 'ai') {
      // In AI mode, undo the human move and AI move together
      // If AI won or human made the last move:
      const stepsToUndo = moveHistory.length % 2 === 0 ? 2 : 1;
      const targetHistory = moveHistory.slice(0, Math.max(0, moveHistory.length - stepsToUndo));
      
      const restoredBoard = createInitialBoard();
      targetHistory.forEach(record => {
        restoredBoard[record.cellIndex] = record.symbol;
      });

      setBoard(restoredBoard);
      setMoveHistory(targetHistory);
      setCurrentTurn(player1Symbol);
      setStatus('playing');
      setWinInfo(null);
      gameEndedReportedRef.current = false;
      hapticsService.trigger('medium');
    } else {
      // In PvP mode, undo the single last move
      const targetHistory = moveHistory.slice(0, moveHistory.length - 1);
      const restoredBoard = createInitialBoard();
      targetHistory.forEach(record => {
        restoredBoard[record.cellIndex] = record.symbol;
      });

      const lastMove = moveHistory[moveHistory.length - 1];
      setBoard(restoredBoard);
      setMoveHistory(targetHistory);
      setCurrentTurn(lastMove.symbol);
      setStatus('playing');
      setWinInfo(null);
      gameEndedReportedRef.current = false;
      hapticsService.trigger('medium');
    }
  }, [moveHistory, isAIThinking, mode, player1Symbol]);

  // Restart board (keeps scores)
  const restart = useCallback(() => {
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
    }
    setBoard(createInitialBoard());
    setWinInfo(null);
    setMoveHistory([]);
    setIsAIThinking(false);
    setStatus('playing');
    gameEndedReportedRef.current = false;
    setCurrentTurn(getStartingSymbol());
    hapticsService.trigger('medium');
    soundService.play('restart');
  }, [getStartingSymbol]);

  // Rematch (reset board and alternate starter if desired)
  const rematch = useCallback(() => {
    restart();
  }, [restart]);

  const canUndo =
    status === 'playing' &&
    moveHistory.length > (mode === 'ai' ? 1 : 0) &&
    !isAIThinking;

  return {
    board,
    currentTurn,
    status,
    winInfo,
    scores,
    isAIThinking,
    canUndo,
    totalMoves: moveHistory.length,
    makeMove,
    undo,
    restart,
    rematch,
    player1: {
      name: player1Name,
      symbol: player1Symbol,
      isAI: false,
    },
    player2: {
      name: player2Name,
      symbol: player2Symbol,
      isAI: mode === 'ai',
    },
  };
}
