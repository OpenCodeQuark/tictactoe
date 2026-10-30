import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import {
  RootScreen,
  GameMode,
  GameSetupParams,
  PlayerSymbol,
} from '../engine/gameTypes';
import { colors } from '../theme/colors';
import { SplashScreen } from '../screens/SplashScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { GameSetupScreen } from '../screens/GameSetupScreen';
import { GameScreen } from '../screens/GameScreen';
import { GameHistoryScreen } from '../screens/GameHistoryScreen';
import { StatisticsScreen } from '../screens/StatisticsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useGameStats } from '../hooks/useGameStats';
import { useGameHistory } from '../hooks/useGameHistory';
import { useSettings } from '../hooks/useSettings';

export const AppNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<RootScreen>('Splash');
  const [setupMode, setSetupMode] = useState<GameMode>('pvp');
  const [activeGameParams, setActiveGameParams] = useState<GameSetupParams | null>(null);

  const { stats, recordGameResult, resetStats } = useGameStats();
  const { history, addHistoryItem, clearHistory } = useGameHistory();
  const { settings, updateSetting } = useSettings();

  // Hardware Back Button Handler
  useEffect(() => {
    const onBackPress = () => {
      if (currentScreen === 'Home' || currentScreen === 'Splash') {
        return false; // Exit app
      }
      if (currentScreen === 'Game') {
        // Handled inside GameScreen modal or fallback to Home
        setCurrentScreen('Home');
        return true;
      }
      setCurrentScreen('Home');
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => subscription.remove();
  }, [currentScreen]);

  const handleSelectMode = useCallback((mode: GameMode) => {
    setSetupMode(mode);
    setCurrentScreen('GameSetup');
  }, []);

  const handleStartGame = useCallback((params: GameSetupParams) => {
    setActiveGameParams(params);
    setCurrentScreen('Game');
  }, []);

  const handleRecordHistory = useCallback(
    (winner: PlayerSymbol | 'draw', movesCount: number) => {
      if (!activeGameParams) return;

      const p1Name = activeGameParams.player1Name || 'Player 1';
      const p2Name = activeGameParams.player2Name || (activeGameParams.mode === 'ai' ? 'AI' : 'Player 2');
      const p1Symbol = activeGameParams.player1Symbol || 'X';

      // Record to history list
      addHistoryItem({
        mode: activeGameParams.mode,
        playerXName: p1Symbol === 'X' ? p1Name : p2Name,
        playerOName: p1Symbol === 'O' ? p1Name : p2Name,
        winner,
        difficulty: activeGameParams.difficulty,
        totalMoves: movesCount,
      });

      // Record to stats overview
      recordGameResult(
        winner,
        activeGameParams.mode,
        activeGameParams.difficulty,
        p1Symbol
      );
    },
    [activeGameParams, addHistoryItem, recordGameResult]
  );

  return (
    <View style={styles.container}>
      {currentScreen === 'Splash' && (
        <SplashScreen onFinish={() => setCurrentScreen('Home')} />
      )}

      {currentScreen === 'Home' && (
        <HomeScreen
          stats={stats}
          onSelectMode={handleSelectMode}
          onOpenHistory={() => setCurrentScreen('History')}
          onOpenStats={() => setCurrentScreen('Statistics')}
          onOpenSettings={() => setCurrentScreen('Settings')}
        />
      )}

      {currentScreen === 'GameSetup' && (
        <GameSetupScreen
          mode={setupMode}
          onBack={() => setCurrentScreen('Home')}
          onStartGame={handleStartGame}
        />
      )}

      {currentScreen === 'Game' && activeGameParams && (
        <GameScreen
          params={activeGameParams}
          onExit={() => setCurrentScreen('Home')}
          onRecordHistory={handleRecordHistory}
        />
      )}

      {currentScreen === 'History' && (
        <GameHistoryScreen
          history={history}
          onBack={() => setCurrentScreen('Home')}
          onClearHistory={clearHistory}
        />
      )}

      {currentScreen === 'Statistics' && (
        <StatisticsScreen
          stats={stats}
          onBack={() => setCurrentScreen('Home')}
          onResetStats={resetStats}
        />
      )}

      {currentScreen === 'Settings' && (
        <SettingsScreen
          settings={settings}
          onUpdateSetting={updateSetting}
          onBack={() => setCurrentScreen('Home')}
          onResetStats={resetStats}
          onClearHistory={clearHistory}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

