import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BoardState, WinInfo } from '../engine/gameTypes';
import { colors } from '../theme/colors';
import { GameCell } from './GameCell';
import { WinningLine } from './WinningLine';

interface GameBoardProps {
  board: BoardState;
  winInfo: WinInfo | null;
  onCellPress: (index: number) => void;
  disabled?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const BOARD_PADDING = 14;
export const CELL_GAP = 10;

// Responsively compute board and cell dimensions
const MAX_BOARD_WIDTH = Math.min(SCREEN_WIDTH - 44, 340);
export const CELL_SIZE = Math.floor((MAX_BOARD_WIDTH - BOARD_PADDING * 2 - CELL_GAP * 2) / 3);
export const BOARD_SIZE = BOARD_PADDING * 2 + CELL_GAP * 2 + CELL_SIZE * 3;

// Explicit 3x3 rows definition to guarantee no layout wrapping issues
const BOARD_ROWS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  winInfo,
  onCellPress,
  disabled = false,
}) => {
  const winningIndices = new Set(winInfo?.line ?? []);

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.boardContainer, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
        <View style={styles.grid}>
          {BOARD_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map(cellIndex => (
                <GameCell
                  key={cellIndex}
                  index={cellIndex}
                  value={board[cellIndex]}
                  cellSize={CELL_SIZE}
                  isWinning={winningIndices.has(cellIndex)}
                  disabled={disabled}
                  onPress={onCellPress}
                />
              ))}
            </View>
          ))}
        </View>

        <WinningLine
          winInfo={winInfo}
          boardSize={BOARD_SIZE}
          padding={BOARD_PADDING}
          gap={CELL_GAP}
          cellSize={CELL_SIZE}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  boardContainer: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 24,
    padding: BOARD_PADDING,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
