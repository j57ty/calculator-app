import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from './Button';

interface ScientificKeypadProps {
  onKeyPress: (value: string) => void;
  onClear: () => void;
  onCalculate: () => void;
  onInvert: () => void;
  hasInput: boolean;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({
  onKeyPress,
  onClear,
  onCalculate,
  onInvert,
  hasInput,
}) => {
  return (
    <View style={styles.container}>
      {/* Row 1: Trig & Parentheses */}
      <View style={styles.row}>
        <Button label="sin" onPress={() => onKeyPress('sin(')} type="scientific" fontSize={15} style={styles.btn} />
        <Button label="cos" onPress={() => onKeyPress('cos(')} type="scientific" fontSize={15} style={styles.btn} />
        <Button label="tan" onPress={() => onKeyPress('tan(')} type="scientific" fontSize={15} style={styles.btn} />
        <Button label="(" onPress={() => onKeyPress('(')} type="scientific" fontSize={16} style={styles.btn} />
        <Button label=")" onPress={() => onKeyPress(')')} type="scientific" fontSize={16} style={styles.btn} />
      </View>

      {/* Row 2: Powers, Roots, Logs, Factorial */}
      <View style={styles.row}>
        <Button label="√" onPress={() => onKeyPress('sqrt(')} type="scientific" fontSize={16} style={styles.btn} />
        <Button label="xʸ" onPress={() => onKeyPress('^')} type="scientific" fontSize={15} style={styles.btn} />
        <Button label="ln" onPress={() => onKeyPress('ln(')} type="scientific" fontSize={15} style={styles.btn} />
        <Button label="log" onPress={() => onKeyPress('log(')} type="scientific" fontSize={15} style={styles.btn} />
        <Button label="x!" onPress={() => onKeyPress('!')} type="scientific" fontSize={15} style={styles.btn} />
      </View>

      {/* Row 3: Constants & Top Numbers */}
      <View style={styles.row}>
        <Button label="π" onPress={() => onKeyPress('π')} type="scientific" fontSize={16} style={styles.btn} />
        <Button label="7" onPress={() => onKeyPress('7')} type="number" fontSize={20} style={styles.btn} />
        <Button label="8" onPress={() => onKeyPress('8')} type="number" fontSize={20} style={styles.btn} />
        <Button label="9" onPress={() => onKeyPress('9')} type="number" fontSize={20} style={styles.btn} />
        <Button label="÷" onPress={() => onKeyPress('/')} type="operator" fontSize={22} style={styles.btn} />
      </View>

      {/* Row 4: Constants & Mid Numbers */}
      <View style={styles.row}>
        <Button label="e" onPress={() => onKeyPress('e')} type="scientific" fontSize={16} style={styles.btn} />
        <Button label="4" onPress={() => onKeyPress('4')} type="number" fontSize={20} style={styles.btn} />
        <Button label="5" onPress={() => onKeyPress('5')} type="number" fontSize={20} style={styles.btn} />
        <Button label="6" onPress={() => onKeyPress('6')} type="number" fontSize={20} style={styles.btn} />
        <Button label="×" onPress={() => onKeyPress('*')} type="operator" fontSize={22} style={styles.btn} />
      </View>

      {/* Row 5: Inversion & Lower Numbers */}
      <View style={styles.row}>
        <Button label="1/x" onPress={onInvert} type="scientific" fontSize={14} style={styles.btn} />
        <Button label="1" onPress={() => onKeyPress('1')} type="number" fontSize={20} style={styles.btn} />
        <Button label="2" onPress={() => onKeyPress('2')} type="number" fontSize={20} style={styles.btn} />
        <Button label="3" onPress={() => onKeyPress('3')} type="number" fontSize={20} style={styles.btn} />
        <Button label="-" onPress={() => onKeyPress('-')} type="operator" fontSize={22} style={styles.btn} />
      </View>

      {/* Row 6: Clear, Zero, Decimal, Equals, Plus */}
      <View style={styles.row}>
        <Button
          label={hasInput ? 'C' : 'AC'}
          onPress={onClear}
          type="action"
          fontSize={15}
          style={styles.btn}
        />
        <Button label="0" onPress={() => onKeyPress('0')} type="number" fontSize={20} style={styles.btn} />
        <Button label="." onPress={() => onKeyPress('.')} type="number" fontSize={22} style={styles.btn} />
        <Button label="=" onPress={onCalculate} type="equals" fontSize={22} style={styles.btn} />
        <Button label="+" onPress={() => onKeyPress('+')} type="operator" fontSize={22} style={styles.btn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  btn: {
    height: 52,
    margin: 3,
    borderRadius: 14,
  },
});
