import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from './Icon';
import { useTheme } from '../theme/ThemeContext';
import { CalculatorMode } from '../types/calculator';

interface HeaderProps {
  currentMode: CalculatorMode;
  onSelectMode: (mode: CalculatorMode) => void;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onOpenHistory,
}) => {
  const { theme, colors, toggleTheme } = useTheme();

  const modes: { id: CalculatorMode; label: string }[] = [
    { id: 'standard', label: 'Basic' },
    { id: 'scientific', label: 'Scientific' },
    { id: 'converter', label: 'Convert' },
  ];

  return (
    <View style={styles.container}>
      {/* Segmented Mode Switcher */}
      <View style={[styles.modeTabs, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              onPress={() => onSelectMode(m.id)}
              style={[
                styles.modeTab,
                isActive && [styles.activeTab, { backgroundColor: colors.accent }],
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modeTabText,
                  {
                    color: isActive ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Action Buttons: History & Theme */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onOpenHistory}
          style={[styles.circleButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Icon name="time" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.circleButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Icon
            name={theme === 'dark' ? 'sun' : 'moon'}
            size={18}
            color={colors.accent}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
  },
  modeTabs: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
  },
  modeTab: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  activeTab: {
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  modeTabText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});
