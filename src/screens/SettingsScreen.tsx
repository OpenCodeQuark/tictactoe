import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  Pressable,
} from 'react-native';
import { GameSettings } from '../engine/gameTypes';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { ConfirmModal } from '../components/ConfirmModal';
import { hapticsService } from '../services/hapticsService';

interface SettingsScreenProps {
  settings: GameSettings;
  onUpdateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
  onBack: () => void;
  onResetStats: () => void;
  onClearHistory: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSetting,
  onBack,
  onResetStats,
  onClearHistory,
}) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const handleToggleSound = (val: boolean) => {
    onUpdateSetting('soundEnabled', val);
    if (val) hapticsService.trigger('light');
  };

  const handleToggleHaptics = (val: boolean) => {
    onUpdateSetting('hapticsEnabled', val);
    if (val) hapticsService.trigger('medium');
  };

  const handleToggleAnimations = (val: boolean) => {
    onUpdateSetting('animationsEnabled', val);
    hapticsService.trigger('light');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Settings" subtitle="PREFERENCES" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Experience & Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>EXPERIENCE & FEEDBACK</Text>

          <View style={styles.settingsGroup}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Sound Effects</Text>
                <Text style={styles.settingDesc}>
                  Play audio cues on moves and victories
                </Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={handleToggleSound}
                trackColor={{ false: colors.cardBorder, true: colors.primaryAccent }}
                thumbColor={colors.primaryText}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Haptic Feedback</Text>
                <Text style={styles.settingDesc}>
                  Vibrate on cell selection and game events
                </Text>
              </View>
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={handleToggleHaptics}
                trackColor={{ false: colors.cardBorder, true: colors.primaryAccent }}
                thumbColor={colors.primaryText}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Visual Animations</Text>
                <Text style={styles.settingDesc}>
                  Enable smooth symbols and winning effects
                </Text>
              </View>
              <Switch
                value={settings.animationsEnabled}
                onValueChange={handleToggleAnimations}
                trackColor={{ false: colors.cardBorder, true: colors.primaryAccent }}
                thumbColor={colors.primaryText}
              />
            </View>
          </View>
        </View>

        {/* Data & Reset Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>DATA & STORAGE</Text>

          <View style={styles.settingsGroup}>
            <Pressable
              onPress={() => {
                hapticsService.trigger('light');
                setShowResetModal(true);
              }}
              style={styles.actionRow}
            >
              <Text style={styles.actionTitle}>Reset All Statistics</Text>
              <Text style={styles.actionDanger}>Reset</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              onPress={() => {
                hapticsService.trigger('light');
                setShowClearModal(true);
              }}
              style={styles.actionRow}
            >
              <Text style={styles.actionTitle}>Clear Game History</Text>
              <Text style={styles.actionDanger}>Clear</Text>
            </Pressable>
          </View>
        </View>

        {/* About App */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ABOUT APPLICATION</Text>

          <View style={styles.settingsGroup}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>App Name</Text>
              <Text style={styles.infoVal}>tictactoe neo</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Version</Text>
              <Text style={styles.infoVal}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>AI Engine</Text>
              <Text style={styles.infoVal}>Minimax Algorithm (Optimal)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Platform</Text>
              <Text style={styles.infoVal}>React Native Architecture</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modals */}
      <ConfirmModal
        visible={showResetModal}
        title="Reset All Statistics?"
        message="This will permanently delete your win-loss ratios and streaks."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          setShowResetModal(false);
          onResetStats();
        }}
        onCancel={() => setShowResetModal(false)}
      />

      <ConfirmModal
        visible={showClearModal}
        title="Clear Game History?"
        message="This will delete your entire list of past played matches."
        confirmLabel="Clear"
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
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
  settingsGroup: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    ...typography.h4,
    fontSize: 15,
    color: colors.primaryText,
    marginBottom: 2,
  },
  settingDesc: {
    ...typography.bodySmall,
    color: colors.secondaryText,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginHorizontal: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionTitle: {
    ...typography.bodyMedium,
    fontSize: 15,
    color: colors.primaryText,
    fontWeight: '600',
  },
  actionDanger: {
    ...typography.caption,
    fontSize: 12,
    color: colors.danger,
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  infoKey: {
    ...typography.bodyMedium,
    color: colors.secondaryText,
    fontSize: 14,
  },
  infoVal: {
    ...typography.bodyMedium,
    color: colors.primaryText,
    fontWeight: '600',
    fontSize: 14,
  },
});

