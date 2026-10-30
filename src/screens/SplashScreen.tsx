import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { AnimatedSymbol } from '../components/AnimatedSymbol';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(20)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        delay: 250,
        useNativeDriver: true,
      }),
      Animated.spring(textTranslate, {
        toValue: 0,
        friction: 6,
        tension: 80,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle floating loop
    const floatLoop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(floatAnim1, {
            toValue: -12,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim1, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(floatAnim2, {
            toValue: 12,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim2, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    floatLoop.start();

    const timer = setTimeout(() => {
      onFinish();
    }, 1800);

    return () => {
      clearTimeout(timer);
      floatLoop.stop();
    };
  }, [logoScale, logoOpacity, textOpacity, textTranslate, floatAnim1, floatAnim2, onFinish]);

  return (
    <Pressable style={styles.container} onPress={onFinish}>
      {/* Floating decorative symbols */}
      <Animated.View
        style={[
          styles.floatingSymbol1,
          { transform: [{ translateY: floatAnim1 }] },
        ]}
      >
        <AnimatedSymbol symbol="X" size={50} animate={false} />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingSymbol2,
          { transform: [{ translateY: floatAnim2 }] },
        ]}
      >
        <AnimatedSymbol symbol="O" size={58} animate={false} />
      </Animated.View>

      {/* Main Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        <View style={styles.logoBadge}>
          <View style={styles.logoGrid}>
            <View style={styles.logoCell}>
              <AnimatedSymbol symbol="X" size={32} animate={false} />
            </View>
            <View style={styles.logoCellDivider} />
            <View style={styles.logoCell}>
              <AnimatedSymbol symbol="O" size={32} animate={false} />
            </View>
          </View>
        </View>
      </Animated.View>

      {/* App Title & Subtitle */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslate }],
          },
        ]}
      >
        <Text style={styles.appTitle}>TICTACTOE NEO</Text>
        <Text style={styles.subtitle}>PREMIUM EDITION</Text>
      </Animated.View>

      {/* Footer loading indicator hint */}
      <View style={styles.footer}>
        <Text style={styles.tapHint}>Tap to continue</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  floatingSymbol1: {
    position: 'absolute',
    top: '18%',
    left: '12%',
    opacity: 0.22,
  },
  floatingSymbol2: {
    position: 'absolute',
    bottom: '22%',
    right: '12%',
    opacity: 0.22,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: colors.cardBorderHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryAccent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  logoGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCell: {
    padding: 4,
  },
  logoCellDivider: {
    width: 2,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
  },
  titleContainer: {
    alignItems: 'center',
  },
  appTitle: {
    ...typography.h1,
    fontSize: 28,
    color: colors.primaryText,
    letterSpacing: 2,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: colors.secondaryAccent,
    letterSpacing: 3,
    marginTop: 6,
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  tapHint: {
    ...typography.caption,
    color: colors.mutedText,
    letterSpacing: 1,
    fontSize: 11,
  },
});

