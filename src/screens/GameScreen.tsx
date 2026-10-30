import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  GameSetupParams,
  PlayerSymbol,
} from '../engine/gameTypes';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { PlayerCard } from '../components/PlayerCard';
import { GameBoard } from '../components/GameBoard';
import { GameButton } from '../components/GameButton';
import { GameResultModal } from '../components/GameResultModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { useGame } from '../hooks/useGame';
import { hapticsService } from '../services/hapticsService';

interface GameScreenProps {
  params: GameSetupParams;
  onExit: () => void;
  onRecordHistory: (winner: PlayerSymbol | 'draw', movesCount: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  params,
  onExit,
  onRecordHistory,
}) => {
  const [showExitModal, setShowExitModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const {
    board,
    currentTurn,
    status,
    winInfo,
    scores,
    isAIThinking,
    canUndo,
    totalMoves,
    makeMove,
    undo,
    restart,
    rematch,
    player1,
    player2,
  } = useGame(params, (winner, moves) => {
    onRecordHistory(winner, moves);
    // Slight delay before opening modal to let user appreciate the winning line
    setTimeout(() => {
      setShowResultModal(true);
    }, 900);
  });

  const handleBackRequest = () => {
    if (status === 'playing' && totalMoves > 0) {
      setShowExitModal(true);
    } else {
      onExit();
    }
  };

  const handleRematchFromModal = () => {
    setShowResultModal(false);
    rematch();
  };

  const handleHomeFromModal = () => {
    setShowResultModal(false);
    onExit();
  };

  // Status message text
  let statusText = '';
  let statusColor = colors.secondaryText;

  if (status === 'playing') {
    if (params.mode === 'ai' && currentTurn === player2.symbol) {
      statusText = 'AI is calculating move...';
      statusColor = colors.secondaryAccent;
    } else {
      const activeName = currentTurn === player1.symbol ? player1.name : player2.name;
      statusText = `${activeName}'s Turn (${currentTurn})`;
      statusColor = currentTurn === 'X' ? colors.playerX : colors.playerO;
    }
  } else if (status === 'won') {
    const winnerName = winInfo?.winner === player1.symbol ? player1.name : player2.name;
    statusText = `${winnerName} Won!`;
    statusColor = winInfo?.winner === 'X' ? colors.playerX : colors.playerO;
  } else if (status === 'draw') {
    statusText = "It's a Draw!";
    statusColor = colors.warning;
  }

  const difficultyTag =
    params.mode === 'ai'
      ? params.difficulty?.toUpperCase()
      : 'PVP';

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title={params.mode === 'ai' ? 'Vs Computer' : 'Friend Match'}
        subtitle={`MODE: ${difficultyTag}`}
        onBack={handleBackRequest}
        rightAction={
          <Pressable
            onPress={() => {
              hapticsService.trigger('medium');
              restart();
            }}
            style={styles.headerRestartBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.headerRestartText}>RESET</Text>
          </Pressable>
        }
      />

      <View style={styles.content}>
        {/* Player Information Row */}
        <View style={styles.playersRow}>
          <PlayerCard
            name={player1.name}
            symbol={player1.symbol}
            score={scores.player1}
            isTurn={status === 'playing' && currentTurn === player1.symbol}
          />

          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          <PlayerCard
            name={player2.name}
            symbol={player2.symbol}
            score={scores.player2}
            isTurn={status === 'playing' && currentTurn === player2.symbol}
            isAI={player2.isAI}
            isThinking={isAIThinking}
          />
        </View>

        {/* Dynamic Status Banner */}
        <View style={styles.statusBanner}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>

        {/* Central 3x3 Game Board */}
        <View style={styles.boardWrapper}>
          <GameBoard
            board={board}
            winInfo={winInfo}
            onCellPress={makeMove}
            disabled={status !== 'playing' || isAIThinking}
          />
        </View>

        {/* Bottom Game Action Controls */}
        <View style={styles.controlsSection}>
          <View style={styles.controlsRow}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <GameButton
                title="Undo"
                variant="secondary"
                size="md"
                disabled={!canUndo}
                onPress={undo}
              />
            </View>

            <View style={{ flex: 1, marginHorizontal: 6 }}>
              <GameButton
                title="Restart"
                variant="outline"
                size="md"
                onPress={restart}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 6 }}>
              <GameButton
                title="Exit"
                variant="ghost"
                size="md"
                onPress={handleBackRequest}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Result Celebration Modal */}
      <GameResultModal
        visible={showResultModal}
        winner={status === 'won' ? winInfo?.winner ?? null : status === 'draw' ? 'draw' : null}
        mode={params.mode}
        player1Name={player1.name}
        player2Name={player2.name}
        player1Symbol={player1.symbol}
        scores={scores}
        onRematch={handleRematchFromModal}
        onHome={handleHomeFromModal}
      />

      {/* Exit Match Confirmation Modal */}
      <ConfirmModal
        visible={showExitModal}
        title="Leave Match?"
        message="An active game is in progress. Are you sure you want to abandon this match?"
        confirmLabel="Leave"
        cancelLabel="Stay"
        isDestructive={true}
        onConfirm={() => {
          setShowExitModal(false);
          onExit();
        }}
        onCancel={() => setShowExitModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  headerRestartBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  headerRestartText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.secondaryText,
    fontWeight: '800',
  },
  playersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  vsBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.cardBackgroundElevated,
    borderWidth: 1,
    borderColor: colors.cardBorderHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginHorizontal: -4,
  },
  vsText: {
    ...typography.caption,
    fontSize: 9,
    color: colors.mutedText,
    fontWeight: '900',
  },
  statusBanner: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  statusText: {
    ...typography.h4,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  boardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsSection: {
    paddingTop: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

