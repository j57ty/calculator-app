import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { Icon } from './Icon';
import { useTheme } from '../theme/ThemeContext';
import { HistoryItem } from '../types/calculator';
import { formatDisplayExpression } from '../utils/calculatorEngine';

interface HistoryModalProps {
  visible: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  visible,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  const { colors } = useTheme();

  const formatTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Icon name="time" size={22} color={colors.accent} />
              <Text style={[styles.title, { color: colors.textPrimary }]}>History</Text>
            </View>

            <View style={styles.headerActions}>
              {history.length > 0 && (
                <TouchableOpacity onPress={onClearHistory} style={styles.clearBtn}>
                  <Text style={[styles.clearBtnText, { color: '#FF453A' }]}>Clear All</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Icon name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* List or Empty State */}
          {history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="calculator" size={54} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No calculations yet
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                Perform a calculation to see it saved here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.historyCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
                  onPress={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardTop}>
                    <Text style={[styles.expressionText, { color: colors.textSecondary }]}>
                      {formatDisplayExpression(item.expression)}
                    </Text>
                    <Text style={[styles.timeText, { color: colors.textMuted }]}>
                      {formatTime(item.timestamp)}
                    </Text>
                  </View>
                  <Text style={[styles.resultText, { color: colors.accent }]}>
                    = {formatDisplayExpression(item.result)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    maxHeight: '80%',
    minHeight: '40%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    elevation: 10,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  historyCard: {
    padding: 14,
    borderRadius: 16,
    marginVertical: 6,
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  expressionText: {
    fontSize: 15,
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    marginLeft: 8,
  },
  resultText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'right',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 13,
    textAlign: 'center',
  },
});
