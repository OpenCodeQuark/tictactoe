import React, { useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { CellValue } from '../engine/gameTypes';
import { colors } from '../theme/colors';
import { AnimatedSymbol } from './AnimatedSymbol';

interface GameCellProps {
  index: number;
  value: CellValue;
  isWinning?: boolean;
  disabled?: boolean;
  onPress: (index: number) => void;
  cellSize: number;
}

export const GameCell: React.FC<GameCellProps> = ({
  index,
  value,
  isWinning = false,
  disabled = false,
  onPress,
  cellSize,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || value !== null) return;
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!disabled && value === null) {
      onPress(index);
    }
  };

  const winningBg = isWinning
    ? value === 'X'
      ? 'rgba(72, 201, 255, 0.22)'
      : 'rgba(255, 121, 184, 0.22)'
    : colors.cardBackground;

  const winningBorder = isWinning
    ? value === 'X'
      ? colors.playerX
      : colors.playerO
    : colors.cardBorder;

  return (
    <Animated.View
      style={[
        {
          width: cellSize,
          height: cellSize,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || value !== null}
        accessibilityRole="button"
        accessibilityLabel={`Cell ${index + 1}, ${value ? `marked with ${value}` : 'empty'}`}
        style={[
          styles.cell,
          {
            backgroundColor: winningBg,
            borderColor: winningBorder,
          },
          isWinning && styles.winningCellShadow,
        ]}
      >
        {value ? (
          <AnimatedSymbol
            symbol={value}
            size={Math.round(cellSize * 0.58)}
            isWinning={isWinning}
          />
        ) : (
          <View style={styles.emptyIndicator} />
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  winningCellShadow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 10,
  },
  emptyIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
