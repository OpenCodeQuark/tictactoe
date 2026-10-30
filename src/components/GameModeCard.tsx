import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { hapticsService } from '../services/hapticsService';
import { AnimatedSymbol } from './AnimatedSymbol';

interface GameModeCardProps {
  title: string;
  subtitle: string;
  tag: string;
  mode: 'pvp' | 'ai';
  onPress: () => void;
}

export const GameModeCard: React.FC<GameModeCardProps> = ({
  title,
  subtitle,
  tag,
  mode,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    hapticsService.trigger('light');
    onPress();
  };

  const isPvP = mode === 'pvp';
  const accentColor = isPvP ? colors.primaryAccent : colors.secondaryAccent;
  const glowColor = isPvP ? colors.primaryAccentGlow : colors.secondaryAccentGlow;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[
          styles.card,
          {
            borderColor: isPvP ? 'rgba(128, 103, 255, 0.4)' : 'rgba(53, 200, 255, 0.4)',
            shadowColor: glowColor,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${subtitle}`}
      >
        {/* Subtle decorative background watermark */}
        <View style={styles.watermark}>
          <AnimatedSymbol
            symbol={isPvP ? 'X' : 'O'}
            size={90}
            animate={false}
          />
        </View>

        <View style={styles.contentRow}>
          {/* Visual Illustration Badge */}
          <View
            style={[
              styles.visualBadge,
              {
                backgroundColor: isPvP
                  ? 'rgba(128, 103, 255, 0.16)'
                  : 'rgba(53, 200, 255, 0.16)',
                borderColor: isPvP
                  ? 'rgba(128, 103, 255, 0.35)'
                  : 'rgba(53, 200, 255, 0.35)',
              },
            ]}
          >
            {isPvP ? (
              <View style={styles.pvpVisual}>
                <View style={styles.symbolLeft}>
                  <AnimatedSymbol symbol="X" size={28} animate={false} />
                </View>
                <View style={styles.symbolRight}>
                  <AnimatedSymbol symbol="O" size={28} animate={false} />
                </View>
              </View>
            ) : (
              <View style={styles.aiVisual}>
                <View style={[styles.robotAntenna, { backgroundColor: accentColor }]} />
                <View style={[styles.robotHead, { borderColor: accentColor }]}>
                  <View style={styles.robotEyesRow}>
                    <View style={[styles.robotEye, { backgroundColor: accentColor }]} />
                    <View style={[styles.robotEye, { backgroundColor: accentColor }]} />
                  </View>
                  <View style={[styles.robotMouth, { backgroundColor: accentColor }]} />
                </View>
              </View>
            )}
          </View>

          {/* Texts & Tag */}
          <View style={styles.textColumn}>
            <View style={styles.tagRow}>
              <View style={[styles.modeTag, { backgroundColor: accentColor }]}>
                <Text style={styles.modeTagText}>{tag}</Text>
              </View>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* Play Pill Action Button */}
          <View style={[styles.playPill, { borderColor: accentColor }]}>
            <View style={styles.playArrow}>
              <View style={[styles.arrowHead, { borderColor: accentColor }]} />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: 7,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    right: -20,
    top: -15,
    opacity: 0.06,
    zIndex: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  visualBadge: {
    width: 62,
    height: 62,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  pvpVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolLeft: {
    marginRight: -6,
    zIndex: 2,
  },
  symbolRight: {
    marginLeft: -6,
    zIndex: 1,
  },
  aiVisual: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  robotAntenna: {
    width: 4,
    height: 6,
    borderRadius: 2,
    marginBottom: 2,
  },
  robotHead: {
    width: 32,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 3,
  },
  robotEyesRow: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
  },
  robotEye: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  robotMouth: {
    width: 12,
    height: 2,
    borderRadius: 1,
  },
  textColumn: {
    flex: 1,
    paddingRight: 8,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  modeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modeTagText: {
    color: '#090D1A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  title: {
    ...typography.h3,
    fontSize: 18,
    color: colors.primaryText,
    marginBottom: 2,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.secondaryText,
    fontSize: 12,
    lineHeight: 16,
  },
  playPill: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.cardBackgroundElevated,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  playArrow: {
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowHead: {
    width: 8,
    height: 8,
    borderRightWidth: 2.5,
    borderTopWidth: 2.5,
    transform: [{ rotate: '45deg' }],
    marginLeft: -2,
  },
});
