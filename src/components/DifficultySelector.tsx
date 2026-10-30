import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AIDifficulty } from '../engine/gameTypes';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { hapticsService } from '../services/hapticsService';

interface DifficultySelectorProps {
  selected: AIDifficulty;
  onSelect: (diff: AIDifficulty) => void;
}

interface DifficultyOption {
  key: AIDifficulty;
  title: string;
  badge: string;
  description: string;
  color: string;
}

const OPTIONS: DifficultyOption[] = [
  {
    key: 'easy',
    title: 'Easy',
    badge: 'CASUAL',
    description: 'AI makes occasional mistakes, fun and relaxed',
    color: colors.success,
  },
  {
    key: 'medium',
    title: 'Medium',
    badge: 'TACTICAL',
    description: 'Smart moves, blocks threats with occasional slips',
    color: colors.warning,
  },
  {
    key: 'hard',
    title: 'Hard',
    badge: 'UNBEATABLE',
    description: 'Minimax AI engine. Plays perfectly, never loses',
    color: colors.danger,
  },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {OPTIONS.map(opt => {
        const isSelected = selected === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => {
              hapticsService.trigger('light');
              onSelect(opt.key);
            }}
            style={[
              styles.optionCard,
              isSelected && {
                borderColor: opt.color,
                backgroundColor: 'rgba(23, 34, 58, 0.95)',
                shadowColor: opt.color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 4,
              },
            ]}
          >
            <View style={styles.headerRow}>
              <View style={styles.titleGroup}>
                <View
                  style={[
                    styles.radioIndicator,
                    isSelected && { borderColor: opt.color, backgroundColor: opt.color },
                  ]}
                />
                <Text style={styles.titleText}>{opt.title}</Text>
              </View>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: isSelected ? opt.color : 'rgba(255, 255, 255, 0.08)' },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: isSelected ? '#090D1A' : colors.secondaryText },
                  ]}
                >
                  {opt.badge}
                </Text>
              </View>
            </View>

            <Text style={styles.descText}>{opt.description}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    gap: 10,
  },
  optionCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.secondaryText,
    marginRight: 10,
  },
  titleText: {
    ...typography.h4,
    fontSize: 16,
    color: colors.primaryText,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  descText: {
    ...typography.bodySmall,
    color: colors.secondaryText,
    marginLeft: 24,
    fontSize: 12,
  },
});

