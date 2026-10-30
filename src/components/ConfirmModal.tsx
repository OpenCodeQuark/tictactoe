import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { GameButton } from './GameButton';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.modalCard} onPress={e => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <GameButton
                title={cancelLabel}
                variant="outline"
                size="md"
                onPress={onCancel}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <GameButton
                title={confirmLabel}
                variant={isDestructive ? 'danger' : 'primary'}
                size="md"
                onPress={onConfirm}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.cardBackgroundElevated,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.cardBorderHighlight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    ...typography.h3,
    color: colors.primaryText,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMedium,
    color: colors.secondaryText,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

