import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Icon } from './Icon';
import { useTheme } from '../theme/ThemeContext';
import { AngleMode, CalculatorMode } from '../types/calculator';
import { formatDisplayExpression } from '../utils/calculatorEngine';

interface DisplayProps {
  expression: string;
  result: string;
  mode: CalculatorMode;
  angleMode: AngleMode;
  hasMemory?: boolean;
  copiedToastVisible?: boolean;
  onToggleAngleMode: () => void;
  onBackspace: () => void;
  onClear: () => void;
  onCopyResult?: () => void;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  mode,
  angleMode,
  hasMemory,
  copiedToastVisible,
  onToggleAngleMode,
  onBackspace,
  onClear,
  onCopyResult,
}) => {
  const { colors } = useTheme();

  // Dynamic font sizing for result based on length
  const getResultFontSize = (text: string) => {
    const len = text.length;
    if (len <= 7) return 48;
    if (len <= 10) return 38;
    if (len <= 13) return 30;
    if (len <= 16) return 24;
    return 20;
  };

  const formattedExpr = formatDisplayExpression(expression);
  const formattedRes = formatDisplayExpression(result || '0');

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Top Bar inside Display: Badges, Toast & Backspace */}
      <View style={styles.topRow}>
        <View style={styles.badgesRow}>
          {hasMemory && (
            <View style={[styles.badge, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
              <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>M</Text>
            </View>
          )}

          {mode === 'scientific' && (
            <TouchableOpacity
              onPress={onToggleAngleMode}
              style={[
                styles.badge,
                {
                  backgroundColor: colors.badgeInactive,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.accentBlue }]}>
                {angleMode}
              </Text>
            </TouchableOpacity>
          )}

          <View style={[styles.badge, { backgroundColor: colors.badgeInactive }]}>
            <Text style={[styles.badgeText, { color: colors.textMuted }]}>
              {mode.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Copied Toast Banner */}
        {copiedToastVisible && (
          <View style={[styles.toastPill, { backgroundColor: colors.accent }]}>
            <Icon name="check" size={12} color="#FFFFFF" />
            <Text style={styles.toastText}>Copied</Text>
          </View>
        )}

        {/* Backspace & Quick Clear */}
        <View style={styles.actionsRow}>
          {expression.length > 0 && (
            <TouchableOpacity onPress={onBackspace} style={styles.iconButton} hitSlop={8}>
              <Icon name="backspace" size={20} color={colors.accent} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Secondary Line: Expression history */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.expressionContainer}
      >
        <Text style={[styles.expressionText, { color: colors.textSecondary }]}>
          {formattedExpr || ' '}
        </Text>
      </ScrollView>

      {/* Primary Line: Main Result / Current Value with Tap to Copy */}
      <TouchableOpacity
        onPress={onCopyResult}
        activeOpacity={0.7}
        style={styles.resultRow}
      >
        <Text
          style={[
            styles.resultText,
            {
              color: result === 'Error' || result === 'Cannot divide by 0' ? '#FF453A' : colors.textPrimary,
              fontSize: getResultFontSize(formattedRes),
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formattedRes}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderRadius: 24,
    marginHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  toastPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
  expressionContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    minHeight: 28,
  },
  expressionText: {
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  resultRow: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minHeight: 56,
  },
  resultText: {
    fontWeight: '300',
    textAlign: 'right',
  },
});
