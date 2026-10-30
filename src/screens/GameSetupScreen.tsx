import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  GameMode,
  PlayerSymbol,
  AIDifficulty,
  FirstTurnChoice,
  GameSetupParams,
} from '../engine/gameTypes';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { DifficultySelector } from '../components/DifficultySelector';
import { GameButton } from '../components/GameButton';
import { AnimatedSymbol } from '../components/AnimatedSymbol';
import { hapticsService } from '../services/hapticsService';

interface GameSetupScreenProps {
  mode: GameMode;
  onBack: () => void;
  onStartGame: (params: GameSetupParams) => void;
}

export const GameSetupScreen: React.FC<GameSetupScreenProps> = ({
  mode,
  onBack,
  onStartGame,
}) => {
  const isPvP = mode === 'pvp';

  const [player1Name, setPlayer1Name] = useState(isPvP ? 'Player 1' : 'You');
  const [player2Name, setPlayer2Name] = useState(isPvP ? 'Player 2' : 'AI Master');
  const [player1Symbol, setPlayer1Symbol] = useState<PlayerSymbol>('X');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const [firstTurn, setFirstTurn] = useState<FirstTurnChoice>('player1');

  const handleStart = () => {
    onStartGame({
      mode,
      player1Name: player1Name.trim() || (isPvP ? 'Player 1' : 'You'),
      player2Name: isPvP
        ? player2Name.trim() || 'Player 2'
        : difficulty === 'hard'
        ? 'Unbeatable AI'
        : difficulty === 'medium'
        ? 'Tactical AI'
        : 'Casual AI',
      player1Symbol,
      difficulty,
      firstTurn,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScreenHeader
        title={isPvP ? 'PvP Setup' : 'AI Setup'}
        subtitle={isPvP ? 'Local 2 Players' : 'Human vs Computer'}
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Symbol Choice Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CHOOSE YOUR SYMBOL</Text>
          <View style={styles.symbolChoiceRow}>
            {(['X', 'O'] as PlayerSymbol[]).map(symbol => {
              const isSelected = player1Symbol === symbol;
              const isX = symbol === 'X';
              const activeColor = isX ? colors.playerX : colors.playerO;

              return (
                <Pressable
                  key={symbol}
                  onPress={() => {
                    hapticsService.trigger('light');
                    setPlayer1Symbol(symbol);
                  }}
                  style={[
                    styles.symbolCard,
                    isSelected && {
                      borderColor: activeColor,
                      backgroundColor: 'rgba(23, 34, 58, 0.95)',
                      shadowColor: activeColor,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                      elevation: 6,
                    },
                  ]}
                >
                  <AnimatedSymbol symbol={symbol} size={36} animate={false} />
                  <Text
                    style={[
                      styles.symbolLabel,
                      isSelected && { color: activeColor, fontWeight: '700' },
                    ]}
                  >
                    Play as {symbol}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Player Names Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PLAYER DETAILS</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {isPvP ? 'Player 1 Name' : 'Your Name'}
            </Text>
            <TextInput
              style={styles.textInput}
              value={player1Name}
              onChangeText={setPlayer1Name}
              placeholder="Enter name"
              placeholderTextColor={colors.mutedText}
              maxLength={15}
            />
          </View>

          {isPvP && (
            <View style={[styles.inputGroup, { marginTop: 12 }]}>
              <Text style={styles.inputLabel}>Player 2 Name</Text>
              <TextInput
                style={styles.textInput}
                value={player2Name}
                onChangeText={setPlayer2Name}
                placeholder="Enter name"
                placeholderTextColor={colors.mutedText}
                maxLength={15}
              />
            </View>
          )}
        </View>

        {/* AI Difficulty Selector (HvC mode only) */}
        {!isPvP && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SELECT AI DIFFICULTY</Text>
            <DifficultySelector
              selected={difficulty}
              onSelect={setDifficulty}
            />
          </View>
        )}

        {/* First Turn Choice (PvP mode only) */}
        {isPvP && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>WHO PLAYS FIRST?</Text>
            <View style={styles.turnRow}>
              {[
                { key: 'player1', label: 'Player 1' },
                { key: 'random', label: 'Random' },
                { key: 'player2', label: 'Player 2' },
              ].map(opt => {
                const isSelected = firstTurn === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => {
                      hapticsService.trigger('light');
                      setFirstTurn(opt.key as FirstTurnChoice);
                    }}
                    style={[
                      styles.turnOption,
                      isSelected && styles.turnOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.turnOptionText,
                        isSelected && styles.turnOptionTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Start Game Action */}
        <View style={styles.bottomAction}>
          <GameButton
            title="Start Match"
            size="lg"
            variant="primary"
            fullWidth
            onPress={handleStart}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 22,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.mutedText,
    marginBottom: 10,
    fontSize: 11,
  },
  symbolChoiceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  symbolCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    marginTop: 8,
    fontSize: 12,
  },
  inputGroup: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 12,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.mutedText,
    fontSize: 10,
    marginBottom: 4,
  },
  textInput: {
    ...typography.bodyMedium,
    color: colors.primaryText,
    fontSize: 16,
    paddingVertical: 4,
  },
  turnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  turnOption: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnOptionActive: {
    borderColor: colors.primaryAccent,
    backgroundColor: 'rgba(128, 103, 255, 0.16)',
  },
  turnOptionText: {
    ...typography.caption,
    color: colors.secondaryText,
    fontSize: 11,
    fontWeight: '600',
  },
  turnOptionTextActive: {
    color: colors.primaryText,
    fontWeight: '800',
  },
  bottomAction: {
    marginTop: 10,
  },
});

