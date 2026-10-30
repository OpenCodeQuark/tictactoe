import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { hapticsService } from '../services/hapticsService';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface GameButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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
    if (!disabled) {
      hapticsService.trigger('light');
      onPress();
    }
  };

  const getVariantStyles = (): { btn: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          btn: {
            backgroundColor: colors.primaryAccent,
            shadowColor: colors.primaryAccentGlow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.6,
            shadowRadius: 10,
            elevation: 6,
          },
          text: {
            color: colors.primaryText,
          },
        };
      case 'secondary':
        return {
          btn: {
            backgroundColor: colors.cardBackgroundElevated,
            borderWidth: 1.5,
            borderColor: colors.cardBorderHighlight,
          },
          text: {
            color: colors.secondaryAccent,
          },
        };
      case 'outline':
        return {
          btn: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.cardBorderHighlight,
          },
          text: {
            color: colors.primaryText,
          },
        };
      case 'danger':
        return {
          btn: {
            backgroundColor: colors.danger,
            shadowColor: colors.dangerGlow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 4,
          },
          text: {
            color: colors.primaryText,
          },
        };
      case 'ghost':
        return {
          btn: {
            backgroundColor: 'transparent',
          },
          text: {
            color: colors.secondaryText,
          },
        };
    }
  };

  const getSizeStyles = (): { btn: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          btn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12 },
          text: { fontSize: 13 },
        };
      case 'lg':
        return {
          btn: { paddingVertical: 16, paddingHorizontal: 28, borderRadius: 18 },
          text: { fontSize: 17 },
        };
      case 'md':
      default:
        return {
          btn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14 },
          text: { fontSize: 15 },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        style={[
          styles.buttonBase,
          vStyles.btn,
          sStyles.btn,
          disabled && styles.disabledBtn,
          fullWidth && { width: '100%' },
        ]}
      >
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.textBase,
              vStyles.text,
              sStyles.text,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  textBase: {
    ...typography.button,
  },
  disabledBtn: {
    backgroundColor: '#17223A',
    borderColor: '#233252',
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: colors.disabledText,
  },
});

