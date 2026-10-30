import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { hapticsService } from '../services/hapticsService';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
}) => {
  const handleBack = () => {
    hapticsService.trigger('light');
    if (onBack) onBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        {onBack ? (
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.backArrow}>
              <View style={styles.arrowStem} />
              <View style={styles.arrowHead} />
            </View>
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <View style={styles.centerCol}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightCol}>
        {rightAction ? rightAction : <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  leftCol: {
    width: 44,
    justifyContent: 'center',
  },
  centerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightCol: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    ...typography.h3,
    fontSize: 17,
    color: colors.primaryText,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.caption,
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  arrowStem: {
    width: 12,
    height: 2,
    backgroundColor: colors.primaryText,
    borderRadius: 1,
  },
  arrowHead: {
    position: 'absolute',
    left: 0,
    width: 7,
    height: 7,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.primaryText,
    transform: [{ rotate: '-45deg' }],
  },
  placeholder: {
    width: 36,
  },
});

