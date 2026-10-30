import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { PlayerSymbol } from '../engine/gameTypes';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { AnimatedSymbol } from './AnimatedSymbol';

interface PlayerCardProps {
  name: string;
  symbol: PlayerSymbol;
  score: number;
  isTurn: boolean;
  isAI?: boolean;
  isThinking?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  symbol,
  score,
  isTurn,
  isAI = false,
  isThinking = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(isTurn ? 1 : 0)).current;

  useEffect(() => {
    if (isTurn) {
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      Animated.timing(glowOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
      pulseAnim.setValue(1);
    }
  }, [isTurn, pulseAnim, glowOpacity]);

  const isX = symbol === 'X';
  const playerColor = isX ? colors.playerX : colors.playerO;
  const playerGlow = isX ? colors.playerXGlow : colors.playerOGlow;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: pulseAnim }],
          borderColor: isTurn ? playerColor : colors.cardBorder,
        },
        isTurn && {
          shadowColor: playerGlow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 10,
          elevation: 6,
        },
      ]}
    >
      {/* Turn indicator badge */}
      {isTurn && (
        <View style={[styles.turnBadge, { backgroundColor: playerColor }]}>
          <Text style={styles.turnBadgeText}>
            {isAI && isThinking ? 'THINKING...' : 'YOUR TURN'}
          </Text>
        </View>
      )}

      {/* Symbol & Avatar Row */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.symbolBadge,
            { backgroundColor: isX ? colors.playerXBg : colors.playerOBg },
          ]}
        >
          <AnimatedSymbol symbol={symbol} size={28} animate={false} />
        </View>

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {name}
            </Text>
            {isAI && (
              <View style={styles.aiTag}>
                <Text style={styles.aiTagText}>AI</Text>
              </View>
            )}
          </View>
          <Text style={styles.subText}>
            {isAI ? 'Opponent' : `Player ${symbol}`}
          </Text>
        </View>
      </View>

      {/* Score Row */}
      <View style={styles.scoreRow}>
        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={[styles.scoreValue, { color: isTurn ? playerColor : colors.primaryText }]}>
          {score}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    position: 'relative',
    marginHorizontal: 4,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  turnBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 5,
  },
  turnBadgeText: {
    color: '#090D1A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  symbolBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    ...typography.h4,
    fontSize: 14,
    color: colors.primaryText,
    flexShrink: 1,
  },
  aiTag: {
    backgroundColor: colors.primaryAccent,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 4,
  },
  aiTagText: {
    color: colors.primaryText,
    fontSize: 9,
    fontWeight: '800',
  },
  subText: {
    ...typography.bodySmall,
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.mutedText,
    fontSize: 10,
  },
  scoreValue: {
    ...typography.statNumber,
    fontSize: 22,
  },
});

