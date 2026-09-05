import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { UnitCategory, UnitDefinition } from '../types/calculator';
import { UNIT_CATEGORIES, convertValue, fetchLiveExchangeRates } from '../utils/converters';
import { Button } from './Button';

export const ConverterScreen: React.FC = () => {
  const { colors } = useTheme();

  const [category, setCategory] = useState<UnitCategory>('length');
  const currentCategoryData = UNIT_CATEGORIES[category];

  const [fromUnit, setFromUnit] = useState<UnitDefinition>(currentCategoryData.units[0]);
  const [toUnit, setToUnit] = useState<UnitDefinition>(currentCategoryData.units[1] || currentCategoryData.units[0]);
  const [inputValue, setInputValue] = useState<string>('1');

  // Currency live rates status
  const [lastRateUpdate, setLastRateUpdate] = useState<string | null>(null);
  const [refreshingRates, setRefreshingRates] = useState<boolean>(false);

  // Picker modal state
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'from' | 'to'>('from');

  // Fetch live rates on mount
  useEffect(() => {
    loadLiveRates();
  }, []);

  const loadLiveRates = async () => {
    setRefreshingRates(true);
    const res = await fetchLiveExchangeRates();
    if (res) {
      setLastRateUpdate('Live (Updated)');
    } else {
      setLastRateUpdate('Offline (Cached)');
    }
    setRefreshingRates(false);
  };

  // Switch category
  const handleSelectCategory = (newCat: UnitCategory) => {
    setCategory(newCat);
    const catData = UNIT_CATEGORIES[newCat];
    setFromUnit(catData.units[0]);
    setToUnit(catData.units[1] || catData.units[0]);
    setInputValue('1');
  };

  // Numeric keypad handlers for converter
  const handleNumberPress = (num: string) => {
    if (inputValue === '0' && num !== '.') {
      setInputValue(num);
    } else if (num === '.' && inputValue.includes('.')) {
      return;
    } else if (inputValue.length < 12) {
      setInputValue((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    if (inputValue.length <= 1) {
      setInputValue('0');
    } else {
      setInputValue((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    setInputValue('0');
  };

  // Swap units
  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  // Open unit picker
  const openPicker = (target: 'from' | 'to') => {
    setPickerTarget(target);
    setPickerVisible(true);
  };

  const handleSelectUnit = (unit: UnitDefinition) => {
    if (pickerTarget === 'from') {
      setFromUnit(unit);
    } else {
      setToUnit(unit);
    }
    setPickerVisible(false);
  };

  // Calculate conversion
  const numVal = parseFloat(inputValue) || 0;
  const convertedNum = convertValue(numVal, fromUnit.id, toUnit.id, category);

  // Format display numbers
  const formatOutput = (val: number) => {
    if (isNaN(val)) return '0';
    if (Math.abs(val) >= 1e9 || (Math.abs(val) < 1e-4 && Math.abs(val) > 0)) {
      return val.toExponential(4);
    }
    return parseFloat(val.toFixed(6)).toString();
  };

  const categoryList: UnitCategory[] = [
    'length',
    'weight',
    'temperature',
    'currency',
    'speed',
    'volume',
    'area',
    'digital',
  ];

  return (
    <View style={styles.container}>
      {/* Category Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categoryList.map((catKey) => {
          const isSelected = category === catKey;
          const data = UNIT_CATEGORIES[catKey];
          return (
            <TouchableOpacity
              key={catKey}
              onPress={() => handleSelectCategory(catKey)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isSelected ? colors.accent : colors.surface,
                  borderColor: isSelected ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color: isSelected ? '#FFFFFF' : colors.textPrimary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {data.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Dual Cards: From and To */}
      <View style={styles.conversionCardsContainer}>
        {/* FROM Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.unitSelector}
            onPress={() => openPicker('from')}
          >
            <View>
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>From</Text>
              <Text style={[styles.unitName, { color: colors.textPrimary }]}>
                {fromUnit.name} ({fromUnit.symbol})
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={colors.accent} />
          </TouchableOpacity>

          <Text
            style={[styles.amountText, { color: colors.textPrimary }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {inputValue}
          </Text>
        </View>

        {/* Swap Button Divider */}
        <View style={styles.swapContainer}>
          <View style={[styles.swapLine, { backgroundColor: colors.border }]} />
          <TouchableOpacity
            style={[styles.swapButton, { backgroundColor: colors.accent, borderColor: colors.surface }]}
            onPress={handleSwap}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-vertical" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={[styles.swapLine, { backgroundColor: colors.border }]} />
        </View>

        {/* TO Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.unitSelector}
            onPress={() => openPicker('to')}
          >
            <View>
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>To</Text>
              <Text style={[styles.unitName, { color: colors.textPrimary }]}>
                {toUnit.name} ({toUnit.symbol})
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={colors.accent} />
          </TouchableOpacity>

          <Text
            style={[styles.amountText, { color: colors.accentBlue }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatOutput(convertedNum)}
          </Text>
        </View>
      </View>

      {/* Currency Live Status Bar (if in currency mode) */}
      {category === 'currency' && (
        <View style={styles.currencyStatusBar}>
          <Text style={[styles.currencyStatusText, { color: colors.textMuted }]}>
            Rates: {lastRateUpdate || 'Standard'}
          </Text>
          <TouchableOpacity
            onPress={loadLiveRates}
            style={styles.refreshBtn}
            disabled={refreshingRates}
          >
            {refreshingRates ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <View style={styles.refreshBtnRow}>
                <Ionicons name="refresh" size={13} color={colors.accent} />
                <Text style={[styles.refreshText, { color: colors.accent }]}>Refresh</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Numeric Keypad */}
      <View style={styles.keypadContainer}>
        <View style={styles.keypadRow}>
          <Button label="7" onPress={() => handleNumberPress('7')} type="number" style={styles.keyBtn} />
          <Button label="8" onPress={() => handleNumberPress('8')} type="number" style={styles.keyBtn} />
          <Button label="9" onPress={() => handleNumberPress('9')} type="number" style={styles.keyBtn} />
          <Button label="C" onPress={handleClear} type="action" style={styles.keyBtn} />
        </View>
        <View style={styles.keypadRow}>
          <Button label="4" onPress={() => handleNumberPress('4')} type="number" style={styles.keyBtn} />
          <Button label="5" onPress={() => handleNumberPress('5')} type="number" style={styles.keyBtn} />
          <Button label="6" onPress={() => handleNumberPress('6')} type="number" style={styles.keyBtn} />
          <Button label="⌫" onPress={handleBackspace} type="action" style={styles.keyBtn} />
        </View>
        <View style={styles.keypadRow}>
          <Button label="1" onPress={() => handleNumberPress('1')} type="number" style={styles.keyBtn} />
          <Button label="2" onPress={() => handleNumberPress('2')} type="number" style={styles.keyBtn} />
          <Button label="3" onPress={() => handleNumberPress('3')} type="number" style={styles.keyBtn} />
          <Button label="." onPress={() => handleNumberPress('.')} type="number" style={styles.keyBtn} />
        </View>
        <View style={styles.keypadRow}>
          <Button label="0" onPress={() => handleNumberPress('0')} type="number" span={4} style={styles.keyBtn} />
        </View>
      </View>

      {/* Unit Selector Modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Select {pickerTarget === 'from' ? 'Source' : 'Target'} Unit
              </Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={currentCategoryData.units}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const active = (pickerTarget === 'from' ? fromUnit.id : toUnit.id) === item.id;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelectUnit(item)}
                    style={[
                      styles.unitItem,
                      {
                        backgroundColor: active ? colors.surfaceSecondary : 'transparent',
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.unitItemName, { color: colors.textPrimary, fontWeight: active ? '700' : '400' }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.unitItemSymbol, { color: colors.accent }]}>
                      {item.symbol}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryScroll: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
  },
  conversionCardsContainer: {
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  unitSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  unitName: {
    fontSize: 16,
    fontWeight: '700',
  },
  amountText: {
    fontSize: 32,
    fontWeight: '400',
    textAlign: 'right',
  },
  swapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -8,
    zIndex: 10,
  },
  swapLine: {
    flex: 1,
    height: 1,
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 4,
  },
  currencyStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 2,
  },
  currencyStatusText: {
    fontSize: 12,
  },
  refreshBtn: {
    padding: 4,
  },
  refreshBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshText: {
    fontSize: 12,
    fontWeight: '600',
  },
  keypadContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  keyBtn: {
    height: 52,
    margin: 4,
    borderRadius: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxHeight: '70%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  unitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 3,
  },
  unitItemName: {
    fontSize: 15,
  },
  unitItemSymbol: {
    fontSize: 14,
    fontWeight: '600',
  },
});
