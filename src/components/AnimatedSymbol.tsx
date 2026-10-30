import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { PlayerSymbol } from '../engine/gameTypes';
import { colors } from '../theme/colors';

interface AnimatedSymbolProps {
  symbol: PlayerSymbol;
  size?: number;
  isWinning?: boolean;
  animate?: boolean;
}

export const AnimatedSymbol: React.FC<AnimatedSymbolProps> = ({
  symbol,
  size = 56,
  isWinning = false,
  animate = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(animate ? 0.3 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animate) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animate, scaleAnim, opacityAnim]);

  useEffect(() => {
    if (isWinning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isWinning, pulseAnim]);

  const barThickness = Math.max(5, Math.round(size * 0.14));
  const isX = symbol === 'X';
  const symbolColor = isX ? colors.playerX : colors.playerO;
  const glowColor = isX ? colors.playerXGlow : colors.playerOGlow;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [
            { scale: scaleAnim },
            { scale: pulseAnim },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      {isX ? (
        <View style={[styles.symbolBox, { width: size, height: size }]}>
          {/* Diagonal Bar 1 */}
          <View
            style={[
              styles.xBar,
              {
                width: size * 0.88,
                height: barThickness,
                backgroundColor: symbolColor,
                borderRadius: barThickness / 2,
                shadowColor: glowColor,
                transform: [{ rotate: '45deg' }],
              },
            ]}
          />
          {/* Diagonal Bar 2 */}
          <View
            style={[
              styles.xBar,
              {
                width: size * 0.88,
                height: barThickness,
                backgroundColor: symbolColor,
                borderRadius: barThickness / 2,
                shadowColor: glowColor,
                transform: [{ rotate: '-45deg' }],
              },
            ]}
          />
        </View>
      ) : (
        <View
          style={[
            styles.oRing,
            {
              width: size * 0.82,
              height: size * 0.82,
              borderRadius: (size * 0.82) / 2,
              borderWidth: barThickness,
              borderColor: symbolColor,
              shadowColor: glowColor,
            },
          ]}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbolBox: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  xBar: {
    position: 'absolute',
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  oRing: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
});
