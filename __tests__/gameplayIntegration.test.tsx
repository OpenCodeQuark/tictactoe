import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useGame } from '../src/hooks/useGame';

describe('Gameplay Integration Tests', () => {
  it('simulates a complete Human vs Human match to win and verifies score', () => {
    let capturedWinner: any = null;
    let capturedMoves: any = null;

    const TestComponent: React.FC = () => {
      const game = useGame(
        {
          mode: 'pvp',
          player1Name: 'Alice',
          player2Name: 'Bob',
          player1Symbol: 'X',
          firstTurn: 'player1',
        },
        (winner, moves) => {
          capturedWinner = winner;
          capturedMoves = moves;
        }
      );

      (TestComponent as any).game = game;
      return null;
    };

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestComponent />);
    });

    const instance: any = TestComponent as any;

    // Alice moves
    ReactTestRenderer.act(() => {
      instance.game.makeMove(0);
    });
    // Bob moves
    ReactTestRenderer.act(() => {
      instance.game.makeMove(3);
    });
    // Alice moves
    ReactTestRenderer.act(() => {
      instance.game.makeMove(1);
    });
    // Bob moves
    ReactTestRenderer.act(() => {
      instance.game.makeMove(4);
    });
    // Alice wins
    ReactTestRenderer.act(() => {
      instance.game.makeMove(2);
    });

    expect(capturedWinner).toBe('X');
    expect(capturedMoves).toBe(5);
    expect(instance.game.scores.player1).toBe(1);
    expect(instance.game.scores.player2).toBe(0);
    expect(instance.game.status).toBe('won');
    expect(instance.game.winInfo.line).toEqual([0, 1, 2]);
  });

  it('validates PvP undo functionality', () => {
    const TestComponent: React.FC = () => {
      const game = useGame({
        mode: 'pvp',
        player1Name: 'Player 1',
        player2Name: 'Player 2',
        player1Symbol: 'X',
        firstTurn: 'player1',
      });
      (TestComponent as any).game = game;
      return null;
    };

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestComponent />);
    });

    const instance: any = TestComponent as any;

    // Move 1
    ReactTestRenderer.act(() => {
      instance.game.makeMove(4);
    });
    expect(instance.game.board[4]).toBe('X');
    expect(instance.game.canUndo).toBe(true);

    // Undo move 1
    ReactTestRenderer.act(() => {
      instance.game.undo();
    });
    expect(instance.game.board[4]).toBeNull();
    expect(instance.game.currentTurn).toBe('X');
    expect(instance.game.canUndo).toBe(false);
  });

  it('validates rematch reset functionality', () => {
    const TestComponent: React.FC = () => {
      const game = useGame({
        mode: 'pvp',
        player1Name: 'P1',
        player2Name: 'P2',
        player1Symbol: 'X',
        firstTurn: 'player1',
      });
      (TestComponent as any).game = game;
      return null;
    };

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestComponent />);
    });

    const instance: any = TestComponent as any;

    ReactTestRenderer.act(() => {
      instance.game.makeMove(0);
    });
    ReactTestRenderer.act(() => {
      instance.game.makeMove(1);
    });
    expect(instance.game.totalMoves).toBe(2);

    // Restart/Rematch
    ReactTestRenderer.act(() => {
      instance.game.restart();
    });
    expect(instance.game.totalMoves).toBe(0);
    expect(instance.game.board.every((c: any) => c === null)).toBe(true);
    expect(instance.game.status).toBe('playing');
  });
});
