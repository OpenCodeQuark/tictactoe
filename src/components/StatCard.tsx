import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  accentColor?: string;
  icon?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  accentColor = colors.primaryAccent,
  icon,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        {icon && <Text style={styles.icon}>{icon}</Text>}
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
        {subValue && <Text style={styles.subValue}>{subValue}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 76,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  label: {
    ...typography.caption,
    fontSize: 10,
    color: colors.secondaryText,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  icon: {
    fontSize: 12,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    ...typography.statNumber,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subValue: {
    ...typography.bodySmall,
    color: colors.mutedText,
    marginLeft: 4,
    fontSize: 11,
  },
});
