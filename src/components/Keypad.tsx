import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from './Button';

interface KeypadProps {
  onKeyPress: (value: string) => void;
  onClear: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onCalculate: () => void;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  hasInput: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onKeyPress,
  onClear,
  onToggleSign,
  onPercentage,
  onCalculate,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  hasInput,
}) => {
  return (
    <View style={styles.container}>
      {/* Memory Function Row */}
      <View style={styles.row}>
        <Button label="MC" onPress={onMemoryClear} type="scientific" fontSize={14} style={styles.memBtn} />
        <Button label="MR" onPress={onMemoryRecall} type="scientific" fontSize={14} style={styles.memBtn} />
        <Button label="M+" onPress={onMemoryAdd} type="scientific" fontSize={14} style={styles.memBtn} />
        <Button label="M-" onPress={onMemorySubtract} type="scientific" fontSize={14} style={styles.memBtn} />
      </View>

      {/* Row 1: Actions & Division */}
      <View style={styles.row}>
        <Button
          label={hasInput ? 'C' : 'AC'}
          onPress={onClear}
          type="action"
        />
        <Button
          label="±"
          onPress={onToggleSign}
          type="action"
        />
        <Button
          label="%"
          onPress={onPercentage}
          type="action"
        />
        <Button
          label="÷"
          onPress={() => onKeyPress('/')}
          type="operator"
        />
      </View>

      {/* Row 2: 7, 8, 9, Multiplication */}
      <View style={styles.row}>
        <Button label="7" onPress={() => onKeyPress('7')} type="number" />
        <Button label="8" onPress={() => onKeyPress('8')} type="number" />
        <Button label="9" onPress={() => onKeyPress('9')} type="number" />
        <Button
          label="×"
          onPress={() => onKeyPress('*')}
          type="operator"
        />
      </View>

      {/* Row 3: 4, 5, 6, Subtraction */}
      <View style={styles.row}>
        <Button label="4" onPress={() => onKeyPress('4')} type="number" />
        <Button label="5" onPress={() => onKeyPress('5')} type="number" />
        <Button label="6" onPress={() => onKeyPress('6')} type="number" />
        <Button
          label="-"
          onPress={() => onKeyPress('-')}
          type="operator"
        />
      </View>

      {/* Row 4: 1, 2, 3, Addition */}
      <View style={styles.row}>
        <Button label="1" onPress={() => onKeyPress('1')} type="number" />
        <Button label="2" onPress={() => onKeyPress('2')} type="number" />
        <Button label="3" onPress={() => onKeyPress('3')} type="number" />
        <Button
          label="+"
          onPress={() => onKeyPress('+')}
          type="operator"
        />
      </View>

      {/* Row 5: 0, ., Equals */}
      <View style={styles.row}>
        <Button
          label="0"
          onPress={() => onKeyPress('0')}
          type="number"
          span={2}
        />
        <Button label="." onPress={() => onKeyPress('.')} type="number" />
        <Button
          label="="
          onPress={onCalculate}
          type="equals"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  memBtn: {
    height: 40,
    margin: 4,
    borderRadius: 12,
  },
});
