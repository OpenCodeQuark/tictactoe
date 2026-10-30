import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { GameModeCard } from '../components/GameModeCard';
import { StatCard } from '../components/StatCard';
import { AnimatedSymbol } from '../components/AnimatedSymbol';
import { GameStats, GameMode } from '../engine/gameTypes';
import { hapticsService } from '../services/hapticsService';

interface HomeScreenProps {
  stats: GameStats;
  onSelectMode: (mode: GameMode) => void;
  onOpenHistory: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  onSelectMode,
  onOpenHistory,
  onOpenStats,
  onOpenSettings,
}) => {
  const winRatePercent = Math.min(100, Math.max(0, stats.winRate));

  return (
    <View style={styles.container}>
      {/* Ambient background glow orbs */}
      <View style={styles.ambientOrb1} pointerEvents="none" />
      <View style={styles.ambientOrb2} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Bar with Brand Badge, Status Pill, and Settings Cog */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.miniLogo}>
              <AnimatedSymbol symbol="X" size={18} animate={false} />
            </View>
            <View>
              <Text style={styles.brandText}>TICTACTOE NEO</Text>
              <View style={styles.statusPillRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>READY TO PLAY</Text>
              </View>
            </View>
          </View>

          <View style={styles.topRightRow}>
            {stats.currentStreak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥 {stats.currentStreak}</Text>
              </View>
            )}

            <Pressable
              onPress={() => {
                hapticsService.trigger('light');
                onOpenSettings();
              }}
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel="Open settings"
            >
              <View style={styles.settingsIcon}>
                <View style={styles.cogCenter} />
                <View style={[styles.cogTooth, styles.cogTooth0]} />
                <View style={[styles.cogTooth, styles.cogTooth45]} />
                <View style={[styles.cogTooth, styles.cogTooth90]} />
                <View style={[styles.cogTooth, styles.cogTooth135]} />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Hero Player Progress Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.welcomeSubtitle}>TACTICAL ARENA</Text>
              <Text style={styles.welcomeTitle}>Ready to Play?</Text>
            </View>
            <View style={styles.rateBadge}>
              <Text style={styles.rateVal}>{winRatePercent}%</Text>
              <Text style={styles.rateLabel}>WIN RATE</Text>
            </View>
          </View>

          {/* Illuminated Progress Track */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${winRatePercent}%` },
              ]}
            />
          </View>

          <View style={styles.heroFooter}>
            <Text style={styles.heroMetaText}>
              {stats.wins} Wins  •  {stats.losses} Losses  •  {stats.draws} Ties
            </Text>
            <Text style={styles.heroTotalText}>
              {stats.totalGames} Matches
            </Text>
          </View>
        </View>

        {/* Game Mode Cards */}
        <View style={styles.modeSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CHOOSE CHALLENGE</Text>
            <Text style={styles.sectionSubtitle}>2 MODES AVAILABLE</Text>
          </View>

          <GameModeCard
            mode="pvp"
            tag="LOCAL 1V1"
            title="Play with Friends"
            subtitle="Pass and play on the same device with custom rules"
            onPress={() => onSelectMode('pvp')}
          />

          <GameModeCard
            mode="ai"
            tag="MINIMAX ENGINE"
            title="Play with AI"
            subtitle="Face calibrated Easy, Medium, or Unbeatable Hard AI"
            onPress={() => onSelectMode('ai')}
          />
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PERFORMANCE SNAPSHOT</Text>
            <Pressable
              onPress={() => {
                hapticsService.trigger('light');
                onOpenStats();
              }}
              hitSlop={8}
            >
              <Text style={styles.viewAllText}>Analytics ›</Text>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <StatCard
              label="GAMES"
              value={stats.totalGames}
              accentColor={colors.primaryAccent}
              icon="🎮"
            />
            <View style={styles.gapHorizontal} />
            <StatCard
              label="WINS"
              value={stats.wins}
              accentColor={colors.success}
              icon="🏆"
            />
          </View>

          <View style={[styles.statsRow, styles.gapVertical]}>
            <StatCard
              label="WIN RATE"
              value={`${stats.winRate}%`}
              accentColor={colors.secondaryAccent}
              icon="⚡"
            />
            <View style={styles.gapHorizontal} />
            <StatCard
              label="BEST STREAK"
              value={stats.bestStreak}
              subValue="wins"
              accentColor={colors.warning}
              icon="🔥"
            />
          </View>
        </View>

        {/* Quick Navigation Cards */}
        <View style={styles.quickNavRow}>
          <Pressable
            onPress={() => {
              hapticsService.trigger('light');
              onOpenHistory();
            }}
            style={styles.navButton}
          >
            <Text style={styles.navIcon}>📜</Text>
            <View>
              <Text style={styles.navButtonTitle}>Match History</Text>
              <Text style={styles.navButtonSub}>Review past games</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              hapticsService.trigger('light');
              onOpenStats();
            }}
            style={styles.navButton}
          >
            <Text style={styles.navIcon}>📊</Text>
            <View>
              <Text style={styles.navButtonTitle}>Statistics</Text>
              <Text style={styles.navButtonSub}>Deep metrics & tiers</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },
  ambientOrb1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(128, 103, 255, 0.12)',
    zIndex: 0,
  },
  ambientOrb2: {
    position: 'absolute',
    bottom: 60,
    left: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(53, 200, 255, 0.08)',
    zIndex: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    zIndex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniLogo: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.cardBackground,
    borderWidth: 1.5,
    borderColor: colors.cardBorderHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: colors.playerXGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  brandText: {
    ...typography.caption,
    fontSize: 14,
    color: colors.primaryText,
    letterSpacing: 1.5,
    fontWeight: '900',
  },
  statusPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 5,
  },
  onlineText: {
    ...typography.caption,
    fontSize: 9,
    color: colors.secondaryText,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 202, 112, 0.15)',
    borderWidth: 1,
    borderColor: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 10,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.warning,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.cardBackground,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cogCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryText,
    zIndex: 2,
  },
  cogTooth: {
    position: 'absolute',
    width: 18,
    height: 3,
    backgroundColor: colors.primaryText,
    borderRadius: 1.5,
  },
  cogTooth0: {
    transform: [{ rotate: '0deg' }],
  },
  cogTooth45: {
    transform: [{ rotate: '45deg' }],
  },
  cogTooth90: {
    transform: [{ rotate: '90deg' }],
  },
  cogTooth135: {
    transform: [{ rotate: '135deg' }],
  },
  heroCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.cardBorderHighlight,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    ...typography.caption,
    color: colors.secondaryAccent,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  welcomeTitle: {
    ...typography.h1,
    fontSize: 24,
    color: colors.primaryText,
  },
  rateBadge: {
    backgroundColor: colors.cardBackgroundElevated,
    borderWidth: 1,
    borderColor: colors.secondaryAccent,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  rateVal: {
    ...typography.statNumber,
    fontSize: 18,
    color: colors.secondaryAccent,
  },
  rateLabel: {
    ...typography.caption,
    fontSize: 8,
    color: colors.secondaryText,
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.secondaryAccent,
    shadowColor: colors.secondaryAccentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroMetaText: {
    ...typography.bodySmall,
    color: colors.secondaryText,
    fontSize: 11,
    fontWeight: '600',
  },
  heroTotalText: {
    ...typography.caption,
    color: colors.mutedText,
    fontSize: 10,
  },
  modeSection: {
    marginBottom: 22,
  },
  statsSection: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.mutedText,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '800',
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.secondaryText,
    fontSize: 9,
  },
  viewAllText: {
    ...typography.caption,
    color: colors.secondaryAccent,
    fontSize: 11,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gapHorizontal: {
    width: 10,
  },
  gapVertical: {
    marginTop: 10,
  },
  quickNavRow: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  navIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  navButtonTitle: {
    ...typography.h4,
    fontSize: 13,
    color: colors.primaryText,
    fontWeight: '700',
  },
  navButtonSub: {
    ...typography.bodySmall,
    fontSize: 10,
    color: colors.mutedText,
    marginTop: 1,
  },
});
