const { evaluateExpression, formatResult } = require('./dist/utils/calculatorEngine.js');
const { convertValue } = require('./dist/utils/converters.js');

function assert(condition, message) {
  if (!condition) {
    console.error('❌ FAIL:', message);
    process.exit(1);
  } else {
    console.log('✅ PASS:', message);
  }
}

console.log('=== RUNNING CALCULATOR ENGINE TESTS ===\n');

// 1. Basic Arithmetic & Precedence
assert(evaluateExpression('2 + 3 * 4') === 14, '2 + 3 * 4 = 14');
assert(evaluateExpression('(2 + 3) * 4') === 20, '(2 + 3) * 4 = 20');
assert(formatResult(evaluateExpression('0.1 + 0.2')) === '0.3', '0.1 + 0.2 = 0.3 (IEEE precision fix)');
assert(evaluateExpression('10 - 3 - 2') === 5, '10 - 3 - 2 = 5');
assert(evaluateExpression('100 / 4 / 5') === 5, '100 / 4 / 5 = 5');

// 2. Division by Zero Handling
try {
  evaluateExpression('5 / 0');
  assert(false, 'Should throw for 5 / 0');
} catch (e) {
  assert(e.message === 'Cannot divide by 0', 'Handles division by zero gracefully');
}

// 3. Powers and Roots
assert(evaluateExpression('2 ^ 3') === 8, '2 ^ 3 = 8');
assert(evaluateExpression('2 ^ 3 ^ 2') === 512, '2 ^ 3 ^ 2 = 512 (Right associative power)');
assert(evaluateExpression('sqrt(16)') === 4, 'sqrt(16) = 4');
assert(evaluateExpression('sqrt(2 + 7)') === 3, 'sqrt(2 + 7) = 3');

// 4. Factorial
assert(evaluateExpression('5!') === 120, '5! = 120');
assert(evaluateExpression('0!') === 1, '0! = 1');

// 5. Trigonometry in DEG and RAD
assert(Math.abs(evaluateExpression('sin(90)', 'DEG') - 1) < 1e-10, 'sin(90 deg) = 1');
assert(Math.abs(evaluateExpression('cos(0)', 'DEG') - 1) < 1e-10, 'cos(0 deg) = 1');
assert(Math.abs(evaluateExpression('tan(45)', 'DEG') - 1) < 1e-10, 'tan(45 deg) = 1');
assert(Math.abs(evaluateExpression('sin(pi / 2)', 'RAD') - 1) < 1e-10, 'sin(pi / 2 rad) = 1');

// 6. Logarithms and Constants
assert(Math.abs(evaluateExpression('ln(e)') - 1) < 1e-10, 'ln(e) = 1');
assert(Math.abs(evaluateExpression('log(1000)') - 3) < 1e-10, 'log(1000) = 3');
assert(Math.abs(evaluateExpression('2 * pi') - 2 * Math.PI) < 1e-10, '2 * pi works');

// 7. Auto-closing parentheses
assert(evaluateExpression('2 * (3 + 4') === 14, 'Auto-closes unclosed parenthesis: 2 * (3 + 4 = 14');

// 8. Unit Conversions
console.log('\n=== RUNNING UNIT CONVERTER TESTS ===\n');

const cToF = convertValue(100, 'c', 'f', 'temperature');
assert(Math.abs(cToF - 212) < 1e-6, '100°C -> 212°F');

const fToC = convertValue(32, 'f', 'c', 'temperature');
assert(Math.abs(fToC - 0) < 1e-6, '32°F -> 0°C');

const mToKm = convertValue(1500, 'm', 'km', 'length');
assert(Math.abs(mToKm - 1.5) < 1e-6, '1500 m -> 1.5 km');

const kgToLb = convertValue(1, 'kg', 'lb', 'weight');
assert(Math.abs(kgToLb - 2.20462) < 1e-3, '1 kg -> ~2.20462 lb');

const gbToMb = convertValue(1, 'gb', 'mb', 'digital');
assert(gbToMb === 1024, '1 GB -> 1024 MB');

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!\n');
