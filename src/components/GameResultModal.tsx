import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { PlayerSymbol, GameMode } from '../engine/gameTypes';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { AnimatedSymbol } from './AnimatedSymbol';
import { GameButton } from './GameButton';

interface GameResultModalProps {
  visible: boolean;
  winner: PlayerSymbol | 'draw' | null;
  mode: GameMode;
  player1Name: string;
  player2Name: string;
  player1Symbol: PlayerSymbol;
  scores: { player1: number; player2: number; draws: number };
  onRematch: () => void;
  onHome: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  visible,
  winner,
  mode,
  player1Name,
  player2Name,
  player1Symbol,
  scores,
  onRematch,
  onHome,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  if (!visible || !winner) return null;

  const isDraw = winner === 'draw';
  const isPlayer1Winner = winner === player1Symbol;
  const winnerName = isDraw
    ? ''
    : isPlayer1Winner
    ? player1Name
    : player2Name;

  const title = isDraw
    ? "IT'S A DRAW!"
    : mode === 'ai'
    ? isPlayer1Winner
      ? 'YOU WON!'
      : 'AI WON!'
    : `${winnerName.toUpperCase()} WON!`;

  const subtitle = isDraw
    ? 'Well played! Both players showed great strategy.'
    : mode === 'ai'
    ? isPlayer1Winner
      ? 'Impressive victory against the AI opponent!'
      : 'Better luck next time! Try another strategy.'
    : `Congratulations, ${winnerName}! Outstanding match.`;

  const accentColor = isDraw
    ? colors.warning
    : winner === 'X'
    ? colors.playerX
    : colors.playerO;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
              borderColor: accentColor,
              shadowColor: accentColor,
            },
          ]}
        >
          {/* Trophy / Illustration */}
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: isDraw ? colors.warningBg : colors.cardBackground },
            ]}
          >
            {isDraw ? (
              <View style={styles.drawGraphic}>
                <View style={[styles.drawBar, { backgroundColor: colors.warning }]} />
                <View style={[styles.drawBar, { backgroundColor: colors.warning }]} />
              </View>
            ) : (
              <AnimatedSymbol symbol={winner as PlayerSymbol} size={48} isWinning={true} />
            )}
          </View>

          {/* Title & Subtitle */}
          <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Scores Overview Card */}
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCol}>
              <Text style={styles.scoreName} numberOfLines={1}>
                {player1Name}
              </Text>
              <Text style={[styles.scoreVal, { color: colors.playerX }]}>
                {scores.player1}
              </Text>
            </View>

            <View style={styles.scoreDivider}>
              <Text style={styles.drawsVal}>DRAWS: {scores.draws}</Text>
            </View>

            <View style={styles.scoreCol}>
              <Text style={styles.scoreName} numberOfLines={1}>
                {player2Name}
              </Text>
              <Text style={[styles.scoreVal, { color: colors.playerO }]}>
                {scores.player2}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsCol}>
            <GameButton
              title="Play Again"
              variant="primary"
              size="lg"
              fullWidth
              onPress={onRematch}
            />
            <View style={{ height: 10 }} />
            <GameButton
              title="Back to Home"
              variant="ghost"
              size="md"
              fullWidth
              onPress={onHome}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.cardBackgroundElevated,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 12,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  drawGraphic: {
    height: 28,
    justifyContent: 'space-between',
  },
  drawBar: {
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  title: {
    ...typography.h2,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  scoreContainer: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
  },
  scoreName: {
    ...typography.caption,
    color: colors.secondaryText,
    fontSize: 11,
    marginBottom: 4,
  },
  scoreVal: {
    ...typography.statNumber,
    fontSize: 22,
  },
  scoreDivider: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  drawsVal: {
    ...typography.caption,
    color: colors.mutedText,
    fontSize: 9,
  },
  actionsCol: {
    width: '100%',
  },
});

