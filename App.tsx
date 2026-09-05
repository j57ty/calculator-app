import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { CalculatorMode, AngleMode, HistoryItem } from './src/types/calculator';
import { evaluateExpression, formatResult } from './src/utils/calculatorEngine';

import { Header } from './src/components/Header';
import { Display } from './src/components/Display';
import { Keypad } from './src/components/Keypad';
import { ScientificKeypad } from './src/components/ScientificKeypad';
import { ConverterScreen } from './src/components/ConverterScreen';
import { HistoryModal } from './src/components/HistoryModal';

const HISTORY_STORAGE_KEY = '@calculator_history_list';
const MEMORY_STORAGE_KEY = '@calculator_memory_val';

function CalculatorMain() {
  const { theme, colors } = useTheme();
  const { width } = useWindowDimensions();

  // Mode and Angle
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');

  // Calculation State
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  // Memory State
  const [memory, setMemory] = useState<number>(0);

  // Clipboard Toast State
  const [copiedToastVisible, setCopiedToastVisible] = useState<boolean>(false);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyModalVisible, setHistoryModalVisible] = useState<boolean>(false);

  // Load history & memory on launch
  useEffect(() => {
    (async () => {
      try {
        const savedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
        const savedMemory = await AsyncStorage.getItem(MEMORY_STORAGE_KEY);
        if (savedMemory) {
          setMemory(parseFloat(savedMemory) || 0);
        }
      } catch {
        // Fallback
      }
    })();
  }, []);

  // Save history to AsyncStorage
  const saveHistory = async (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    } catch {
      // Ignore
    }
  };

  const saveMemory = async (val: number) => {
    setMemory(val);
    try {
      await AsyncStorage.setItem(MEMORY_STORAGE_KEY, val.toString());
    } catch {
      // Ignore
    }
  };

  // Add calculation to history
  const addToHistory = (expr: string, res: string) => {
    if (!expr || expr === res || res === 'Error' || res === 'Cannot divide by 0') return;
    const newItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      expression: expr,
      result: res,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...history.slice(0, 49)];
    saveHistory(updated);
  };

  const clearAllHistory = () => {
    saveHistory([]);
  };

  // Toggle DEG / RAD
  const toggleAngleMode = () => {
    setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
  };

  // Handle keypad input
  const handleKeyPress = (val: string) => {
    const isOperator = ['+', '-', '*', '/', '^'].includes(val);

    if (isEvaluated) {
      if (isOperator) {
        setExpression(result + val);
        setResult(result);
        setIsEvaluated(false);
        return;
      } else {
        setExpression(val);
        setResult('0');
        setIsEvaluated(false);
        return;
      }
    }

    const lastChar = expression.slice(-1);
    if (isOperator && ['+', '-', '*', '/', '^'].includes(lastChar)) {
      setExpression((prev) => prev.slice(0, -1) + val);
      return;
    }

    if (val === '.') {
      const parts = expression.split(/[\+\-\*\/\^\(\)]/);
      const currentPart = parts[parts.length - 1];
      if (currentPart.includes('.')) return;
      if (currentPart === '') {
        setExpression((prev) => prev + '0.');
        return;
      }
    }

    const nextExpr = expression + val;
    setExpression(nextExpr);

    try {
      if (/[0-9\)\!πe]$/.test(nextExpr)) {
        const preview = evaluateExpression(nextExpr, angleMode);
        setResult(formatResult(preview));
      }
    } catch {
      // Keep result during typing
    }
  };

  // Backspace
  const handleBackspace = () => {
    if (isEvaluated) {
      handleClear();
      return;
    }
    if (expression.length === 0) return;

    const funcPatterns = [/sqrt\($/, /sin\($/, /cos\($/, /tan\($/, /log\($/, /ln\($/];
    for (const pattern of funcPatterns) {
      if (pattern.test(expression)) {
        const newExpr = expression.replace(pattern, '');
        setExpression(newExpr);
        updateLiveResult(newExpr);
        return;
      }
    }

    const newExpr = expression.slice(0, -1);
    setExpression(newExpr);
    updateLiveResult(newExpr);
  };

  const updateLiveResult = (expr: string) => {
    if (!expr) {
      setResult('0');
      return;
    }
    try {
      if (/[0-9\)\!πe]$/.test(expr)) {
        const res = evaluateExpression(expr, angleMode);
        setResult(formatResult(res));
      }
    } catch {
      // keep current
    }
  };

  // Clear
  const handleClear = () => {
    setExpression('');
    setResult('0');
    setIsEvaluated(false);
  };

  // Calculate (=)
  const handleCalculate = () => {
    if (!expression) return;
    try {
      const numeric = evaluateExpression(expression, angleMode);
      const formatted = formatResult(numeric);
      setResult(formatted);
      addToHistory(expression, formatted);
      setIsEvaluated(true);
    } catch (err: any) {
      setResult(err.message === 'Cannot divide by 0' ? 'Cannot divide by 0' : 'Error');
      setIsEvaluated(true);
    }
  };

  // Toggle Sign (±)
  const handleToggleSign = () => {
    if (isEvaluated && result !== '0' && result !== 'Error') {
      const num = parseFloat(result);
      const toggled = formatResult(-num);
      setExpression(toggled);
      setResult(toggled);
      setIsEvaluated(false);
      return;
    }

    if (!expression) return;

    if (/^\-?[0-9.]+$/.test(expression)) {
      if (expression.startsWith('-')) {
        setExpression(expression.substring(1));
      } else {
        setExpression('-' + expression);
      }
      return;
    }

    setExpression(`-(${expression})`);
  };

  // Percentage (%)
  const handlePercentage = () => {
    if (isEvaluated && result !== '0') {
      const num = parseFloat(result) / 100;
      const formatted = formatResult(num);
      setExpression(formatted);
      setResult(formatted);
      return;
    }

    if (!expression) return;
    try {
      const num = evaluateExpression(expression, angleMode) / 100;
      const formatted = formatResult(num);
      setResult(formatted);
      addToHistory(`${expression} %`, formatted);
      setExpression(formatted);
      setIsEvaluated(true);
    } catch {
      setResult('Error');
    }
  };

  // Invert (1/x)
  const handleInvert = () => {
    if (isEvaluated && result !== '0') {
      const expr = `1/(${result})`;
      setExpression(expr);
      try {
        const num = evaluateExpression(expr, angleMode);
        setResult(formatResult(num));
        setIsEvaluated(true);
      } catch {
        setResult('Error');
      }
      return;
    }

    if (expression) {
      setExpression(`1/(${expression})`);
    } else {
      setExpression('1/(');
    }
  };

  // Memory operations (MC, MR, M+, M-)
  const handleMemoryClear = () => {
    saveMemory(0);
  };

  const handleMemoryRecall = () => {
    if (memory !== 0) {
      handleKeyPress(memory.toString());
    }
  };

  const handleMemoryAdd = () => {
    const val = parseFloat(result) || (expression ? evaluateExpression(expression, angleMode) : 0);
    saveMemory(memory + val);
  };

  const handleMemorySubtract = () => {
    const val = parseFloat(result) || (expression ? evaluateExpression(expression, angleMode) : 0);
    saveMemory(memory - val);
  };

  // Copy result to clipboard
  const handleCopyResult = async () => {
    if (result && result !== 'Error') {
      await Clipboard.setStringAsync(result);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setCopiedToastVisible(true);
      setTimeout(() => {
        setCopiedToastVisible(false);
      }, 1800);
    }
  };

  // Load selected history item
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setExpression(item.expression);
    setResult(item.result);
    setIsEvaluated(true);
  };

  // Physical Keyboard listener for Web / iPad
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'converter') return; // Let converter handle its own keys

      const key = e.key;

      if ((key >= '0' && key <= '9') || key === '.') {
        handleKeyPress(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleKeyPress(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Escape') {
        handleClear();
      } else if (key === '%') {
        handlePercentage();
      } else if (key === '(' || key === ')') {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, expression, result, isEvaluated, angleMode]);

  const isLargeScreen = width > 520;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View style={[styles.container, isLargeScreen && styles.desktopContainer]}>
        {/* Header */}
        <Header
          currentMode={mode}
          onSelectMode={(m) => setMode(m)}
          onOpenHistory={() => setHistoryModalVisible(true)}
        />

        {/* Content according to mode */}
        {mode === 'converter' ? (
          <ConverterScreen />
        ) : (
          <View style={styles.calcContainer}>
            <Display
              expression={expression}
              result={result}
              mode={mode}
              angleMode={angleMode}
              hasMemory={memory !== 0}
              copiedToastVisible={copiedToastVisible}
              onToggleAngleMode={toggleAngleMode}
              onBackspace={handleBackspace}
              onClear={handleClear}
              onCopyResult={handleCopyResult}
            />

            {mode === 'standard' ? (
              <Keypad
                onKeyPress={handleKeyPress}
                onClear={handleClear}
                onToggleSign={handleToggleSign}
                onPercentage={handlePercentage}
                onCalculate={handleCalculate}
                onMemoryClear={handleMemoryClear}
                onMemoryRecall={handleMemoryRecall}
                onMemoryAdd={handleMemoryAdd}
                onMemorySubtract={handleMemorySubtract}
                hasInput={expression.length > 0}
              />
            ) : (
              <ScientificKeypad
                onKeyPress={handleKeyPress}
                onClear={handleClear}
                onCalculate={handleCalculate}
                onInvert={handleInvert}
                hasInput={expression.length > 0}
              />
            )}
          </View>
        )}

        {/* History Modal */}
        <HistoryModal
          visible={historyModalVisible}
          onClose={() => setHistoryModalVisible(false)}
          history={history}
          onSelectHistoryItem={handleSelectHistoryItem}
          onClearHistory={clearAllHistory}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CalculatorMain />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  desktopContainer: {
    maxWidth: 480,
    alignSelf: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(128,128,128,0.15)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  calcContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
});
