import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { GameHistoryItem, PlayerSymbol } from '../engine/gameTypes';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { ConfirmModal } from '../components/ConfirmModal';
import { AnimatedSymbol } from '../components/AnimatedSymbol';
import { hapticsService } from '../services/hapticsService';

interface GameHistoryScreenProps {
  history: GameHistoryItem[];
  onBack: () => void;
  onClearHistory: () => void;
}

export const GameHistoryScreen: React.FC<GameHistoryScreenProps> = ({
  history,
  onBack,
  onClearHistory,
}) => {
  const [filter, setFilter] = useState<'all' | 'pvp' | 'ai'>('all');
  const [showClearModal, setShowClearModal] = useState(false);

  const filteredData =
    filter === 'all'
      ? history
      : history.filter(item => item.mode === filter);

  const renderItem = ({ item }: { item: GameHistoryItem }) => {
    const isDraw = item.winner === 'draw';
    const isPvP = item.mode === 'pvp';

    return (
      <View style={styles.historyCard}>
        {/* Left Symbol / Result Icon */}
        <View style={styles.cardLeft}>
          {isDraw ? (
            <View style={styles.drawBadge}>
              <Text style={styles.drawBadgeText}>DRAW</Text>
            </View>
          ) : (
            <View
              style={[
                styles.winnerBadge,
                {
                  backgroundColor:
                    item.winner === 'X' ? colors.playerXBg : colors.playerOBg,
                },
              ]}
            >
              <AnimatedSymbol symbol={item.winner as PlayerSymbol} size={24} animate={false} />
            </View>
          )}
        </View>

        {/* Center Details */}
        <View style={styles.cardCenter}>
          <View style={styles.playersRow}>
            <Text style={styles.playersText} numberOfLines={1}>
              {item.playerXName} vs {item.playerOName}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View
              style={[
                styles.modeTag,
                {
                  backgroundColor: isPvP
                    ? 'rgba(128, 103, 255, 0.15)'
                    : 'rgba(53, 200, 255, 0.15)',
                },
              ]}
            >
              <Text
                style={[
                  styles.modeTagText,
                  { color: isPvP ? colors.primaryAccent : colors.secondaryAccent },
                ]}
              >
                {isPvP ? 'FRIENDS' : `AI (${item.difficulty?.toUpperCase()})`}
              </Text>
            </View>

            <Text style={styles.dateText}>{item.dateFormatted}</Text>
          </View>
        </View>

        {/* Right Winner Summary */}
        <View style={styles.cardRight}>
          <Text
            style={[
              styles.winnerText,
              {
                color: isDraw
                  ? colors.warning
                  : item.winner === 'X'
                  ? colors.playerX
                  : colors.playerO,
              },
            ]}
          >
            {isDraw ? 'TIE' : `${item.winner} WON`}
          </Text>
          <Text style={styles.movesText}>{item.totalMoves} moves</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Game History"
        subtitle={`${history.length} MATCHES RECORDED`}
        onBack={onBack}
        rightAction={
          history.length > 0 ? (
            <Pressable
              onPress={() => {
                hapticsService.trigger('light');
                setShowClearModal(true);
              }}
              style={styles.clearBtn}
            >
              <Text style={styles.clearBtnText}>CLEAR</Text>
            </Pressable>
          ) : null
        }
      />

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        {[
          { key: 'all', label: 'All Matches' },
          { key: 'pvp', label: 'Friends' },
          { key: 'ai', label: 'Against AI' },
        ].map(tab => {
          const isSelected = filter === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                hapticsService.trigger('light');
                setFilter(tab.key as any);
              }}
              style={[
                styles.filterTab,
                isSelected && styles.filterTabActive,
              ]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isSelected && styles.filterTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* List or Empty State */}
      {filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <AnimatedSymbol symbol="X" size={32} animate={false} />
          </View>
          <Text style={styles.emptyTitle}>No Games Yet</Text>
          <Text style={styles.emptySubtitle}>
            Play a match against friends or AI to start logging your gameplay history!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        visible={showClearModal}
        title="Clear Game History?"
        message="This will delete all past recorded match outcomes. This cannot be undone."
        confirmLabel="Clear All"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          setShowClearModal(false);
          onClearHistory();
        }}
        onCancel={() => setShowClearModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  clearBtnText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.danger,
    fontWeight: '800',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    borderColor: colors.primaryAccent,
    backgroundColor: 'rgba(128, 103, 255, 0.16)',
  },
  filterTabText: {
    ...typography.caption,
    color: colors.secondaryText,
    fontSize: 11,
  },
  filterTabTextActive: {
    color: colors.primaryText,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 4,
    gap: 10,
  },
  historyCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLeft: {
    marginRight: 12,
  },
  winnerBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.warningBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawBadgeText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '900',
    color: colors.warning,
  },
  cardCenter: {
    flex: 1,
  },
  playersRow: {
    marginBottom: 4,
  },
  playersText: {
    ...typography.h4,
    fontSize: 14,
    color: colors.primaryText,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modeTagText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '800',
  },
  dateText: {
    ...typography.caption,
    color: colors.mutedText,
    fontSize: 10,
  },
  cardRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  winnerText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '800',
  },
  movesText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.mutedText,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.cardBackground,
    borderWidth: 1.5,
    borderColor: colors.cardBorderHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    ...typography.h2,
    fontSize: 20,
    color: colors.primaryText,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...typography.bodyMedium,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
  },
});
