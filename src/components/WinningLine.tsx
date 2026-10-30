import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { WinInfo } from '../engine/gameTypes';
import { colors } from '../theme/colors';

interface WinningLineProps {
  winInfo: WinInfo | null;
  boardSize: number;
  padding: number;
  gap: number;
  cellSize: number;
}

export const WinningLine: React.FC<WinningLineProps> = ({
  winInfo,
  boardSize,
  padding,
  gap,
  cellSize,
}) => {
  const lineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (winInfo) {
      lineAnim.setValue(0);
      Animated.timing(lineAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [winInfo, lineAnim]);

  if (!winInfo) return null;

  const isX = winInfo.winner === 'X';
  const lineColor = isX ? colors.playerX : colors.playerO;
  const glowColor = isX ? colors.playerXGlow : colors.playerOGlow;

  const { direction, line } = winInfo;
  const lineThickness = 6;

  let styleByDirection: any = {};

  if (direction === 'horizontal') {
    const row = Math.floor(line[0] / 3);
    const top = padding + row * (cellSize + gap) + cellSize / 2 - lineThickness / 2;
    styleByDirection = {
      top,
      left: padding + 6,
      right: padding + 6,
      height: lineThickness,
      transform: [{ scaleX: lineAnim }],
    };
  } else if (direction === 'vertical') {
    const col = line[0] % 3;
    const left = padding + col * (cellSize + gap) + cellSize / 2 - lineThickness / 2;
    styleByDirection = {
      left,
      top: padding + 6,
      bottom: padding + 6,
      width: lineThickness,
      transform: [{ scaleY: lineAnim }],
    };
  } else if (direction === 'diagonal-main') {
    // 0 -> 4 -> 8 (top-left to bottom-right)
    const length = Math.SQRT2 * (boardSize - padding * 2 - 12);
    styleByDirection = {
      top: boardSize / 2 - lineThickness / 2,
      left: boardSize / 2 - length / 2,
      width: length,
      height: lineThickness,
      transform: [
        { rotate: '45deg' },
        { scaleX: lineAnim },
      ],
    };
  } else if (direction === 'diagonal-anti') {
    // 2 -> 4 -> 6 (top-right to bottom-left)
    const length = Math.SQRT2 * (boardSize - padding * 2 - 12);
    styleByDirection = {
      top: boardSize / 2 - lineThickness / 2,
      left: boardSize / 2 - length / 2,
      width: length,
      height: lineThickness,
      transform: [
        { rotate: '-45deg' },
        { scaleX: lineAnim },
      ],
    };
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.line,
        {
          backgroundColor: lineColor,
          shadowColor: glowColor,
        },
        styleByDirection,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 12,
    zIndex: 10,
  },
});
