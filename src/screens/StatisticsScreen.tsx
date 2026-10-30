import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { GameStats, DifficultyStats } from '../engine/gameTypes';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatCard } from '../components/StatCard';
import { ConfirmModal } from '../components/ConfirmModal';
import { hapticsService } from '../services/hapticsService';

interface StatisticsScreenProps {
  stats: GameStats;
  onBack: () => void;
  onResetStats: () => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  stats,
  onBack,
  onResetStats,
}) => {
  const [showResetModal, setShowResetModal] = useState(false);

  const renderDifficultyRow = (
    label: string,
    diffStats: DifficultyStats,
    color: string
  ) => {
    const rate =
      diffStats.games > 0
        ? Math.round((diffStats.wins / diffStats.games) * 100)
        : 0;

    return (
      <View style={styles.diffCard}>
        <View style={styles.diffHeader}>
          <Text style={[styles.diffTitle, { color }]}>{label}</Text>
          <Text style={styles.diffGames}>{diffStats.games} Played</Text>
        </View>

        <View style={styles.diffStatsRow}>
          <View style={styles.diffStatCol}>
            <Text style={styles.diffStatVal}>{diffStats.wins}</Text>
            <Text style={styles.diffStatLabel}>WINS</Text>
          </View>
          <View style={styles.diffStatCol}>
            <Text style={styles.diffStatVal}>{diffStats.losses}</Text>
            <Text style={styles.diffStatLabel}>LOSSES</Text>
          </View>
          <View style={styles.diffStatCol}>
            <Text style={styles.diffStatVal}>{diffStats.draws}</Text>
            <Text style={styles.diffStatLabel}>DRAWS</Text>
          </View>
          <View style={styles.diffStatCol}>
            <Text style={[styles.diffStatVal, { color }]}>{rate}%</Text>
            <Text style={styles.diffStatLabel}>WIN RATE</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Statistics"
        subtitle="PERFORMANCE METRICS"
        onBack={onBack}
        rightAction={
          stats.totalGames > 0 ? (
            <Pressable
              onPress={() => {
                hapticsService.trigger('light');
                setShowResetModal(true);
              }}
              style={styles.resetBtn}
            >
              <Text style={styles.resetBtnText}>RESET</Text>
            </Pressable>
          ) : null
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Primary Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>MATCH OVERVIEW</Text>
          <View style={styles.statGrid}>
            <StatCard
              label="TOTAL GAMES"
              value={stats.totalGames}
              accentColor={colors.primaryAccent}
            />
            <View style={{ width: 10 }} />
            <StatCard
              label="WIN RATE"
              value={`${stats.winRate}%`}
              accentColor={colors.secondaryAccent}
            />
          </View>

          <View style={[styles.statGrid, { marginTop: 10 }]}>
            <StatCard
              label="WINS"
              value={stats.wins}
              accentColor={colors.success}
            />
            <View style={{ width: 10 }} />
            <StatCard
              label="LOSSES"
              value={stats.losses}
              accentColor={colors.danger}
            />
            <View style={{ width: 10 }} />
            <StatCard
              label="DRAWS"
              value={stats.draws}
              accentColor={colors.warning}
            />
          </View>
        </View>

        {/* Streaks */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>STREAKS</Text>
          <View style={styles.statGrid}>
            <StatCard
              label="CURRENT STREAK"
              value={stats.currentStreak}
              subValue="wins"
              accentColor={colors.primaryAccent}
            />
            <View style={{ width: 10 }} />
            <StatCard
              label="BEST STREAK"
              value={stats.bestStreak}
              subValue="wins"
              accentColor={colors.warning}
            />
          </View>
        </View>

        {/* Modes Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>MODES BREAKDOWN</Text>
          <View style={styles.statGrid}>
            <StatCard
              label="VS FRIENDS (PVP)"
              value={stats.pvpGames}
              subValue="matches"
              accentColor={colors.primaryAccent}
            />
            <View style={{ width: 10 }} />
            <StatCard
              label="VS AI (BOT)"
              value={stats.aiGames}
              subValue="matches"
              accentColor={colors.secondaryAccent}
            />
          </View>
        </View>

        {/* AI Difficulty Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>AI DIFFICULTY BREAKDOWN</Text>
          {renderDifficultyRow('EASY DIFFICULTY', stats.easyStats, colors.success)}
          <View style={{ height: 10 }} />
          {renderDifficultyRow('MEDIUM DIFFICULTY', stats.mediumStats, colors.warning)}
          <View style={{ height: 10 }} />
          {renderDifficultyRow('HARD (UNBEATABLE)', stats.hardStats, colors.danger)}
        </View>
      </ScrollView>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        visible={showResetModal}
        title="Reset All Statistics?"
        message="This will reset all your win counts, loss records, and streaks back to zero. This cannot be undone."
        confirmLabel="Reset Stats"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          setShowResetModal(false);
          onResetStats();
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  resetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  resetBtnText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.danger,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    ...typography.caption,
    color: colors.mutedText,
    marginBottom: 10,
    fontSize: 11,
  },
  statGrid: {
    flexDirection: 'row',
  },
  diffCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  diffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  diffTitle: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  diffGames: {
    ...typography.caption,
    color: colors.secondaryText,
    fontSize: 10,
  },
  diffStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diffStatCol: {
    alignItems: 'center',
    flex: 1,
  },
  diffStatVal: {
    ...typography.h4,
    fontSize: 16,
    color: colors.primaryText,
    marginBottom: 2,
  },
  diffStatLabel: {
    ...typography.caption,
    color: colors.mutedText,
    fontSize: 9,
  },
});

