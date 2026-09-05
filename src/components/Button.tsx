import React from 'react';
import { StyleSheet, Text, Pressable, Platform, StyleProp, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { ButtonType } from '../types/calculator';

interface ButtonProps {
  label: string;
  onPress: () => void;
  type?: ButtonType;
  span?: number;
  secondaryLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fontSize?: number;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  type = 'number',
  span = 1,
  secondaryLabel,
  style,
  textStyle,
  fontSize,
}) => {
  const { colors } = useTheme();

  const handlePress = () => {
    // Tactile haptic feedback on mobile
    if (Platform.OS !== 'web') {
      try {
        if (type === 'equals') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (type === 'action') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch {
        // Fallback gracefully
      }
    }
    onPress();
  };

  // Resolve background and text color based on button type
  let bgColor = colors.numberKey;
  let txtColor = colors.numberKeyText;
  let activeColor = colors.numberKeyActive;

  switch (type) {
    case 'operator':
      bgColor = colors.operatorKey;
      txtColor = colors.operatorKeyText;
      activeColor = colors.operatorKeyActive;
      break;
    case 'action':
      bgColor = colors.functionKey;
      txtColor = colors.functionKeyText;
      activeColor = colors.functionKeyActive;
      break;
    case 'scientific':
      bgColor = colors.sciKey;
      txtColor = colors.sciKeyText;
      activeColor = colors.sciKeyActive;
      break;
    case 'equals':
      bgColor = colors.equalsKey;
      txtColor = colors.equalsKeyText;
      activeColor = colors.operatorKeyActive;
      break;
    case 'number':
    default:
      bgColor = colors.numberKey;
      txtColor = colors.numberKeyText;
      activeColor = colors.numberKeyActive;
      break;
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? activeColor : bgColor,
          flex: span,
          transform: [{ scale: pressed ? 0.95 : 1 }],
          shadowColor: colors.textPrimary,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: txtColor,
            fontSize: fontSize ?? (type === 'scientific' ? 18 : 26),
          },
          textStyle,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
      {secondaryLabel && (
        <Text style={[styles.secondaryText, { color: colors.textMuted }]}>
          {secondaryLabel}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 64,
    borderRadius: 18,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secondaryText: {
    fontSize: 9,
    position: 'absolute',
    top: 6,
    right: 8,
    fontWeight: '500',
  },
});
