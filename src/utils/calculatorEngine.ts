import { AngleMode } from '../types/calculator';

// Helper: Fix floating point precision issues (e.g., 0.1 + 0.2 = 0.3)
export function formatResult(num: number): string {
  if (isNaN(num)) return 'Error';
  if (!isFinite(num)) return 'Cannot divide by 0';

  // For zero
  if (Math.abs(num) < 1e-15) return '0';

  // Large or extremely small numbers get exponential notation
  if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-7 && Math.abs(num) > 0)) {
    return num.toExponential(6).replace(/\.?0+e/, 'e');
  }

  // Use toPrecision to strip IEEE floating-point noise
  const precisionStr = parseFloat(num.toPrecision(12)).toString();
  return precisionStr;
}

// Format numbers in expression for display with commas
export function formatDisplayExpression(expr: string): string {
  if (!expr) return '0';
  // Replace internal operator symbols with beautiful visual symbols
  return expr
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/sqrt\(/g, '√(')
    .replace(/pi/g, 'π');
}

// Factorial calculation
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid factorial');
  if (n > 170) return Infinity; // Limit JS max float
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// Tokenize the mathematical expression
interface Token {
  type: 'NUMBER' | 'OPERATOR' | 'FUNCTION' | 'LPAREN' | 'RPAREN' | 'POSTFIX';
  value: string;
}

export function tokenize(rawExpr: string): Token[] {
  // Normalize symbols
  let expr = rawExpr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt');

  const tokens: Token[] = [];
  let i = 0;

  const isDigit = (c: string) => (c >= '0' && c <= '9') || c === '.';
  const isAlpha = (c: string) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');

  while (i < expr.length) {
    const c = expr[i];

    if (c === ' ' || c === '\t') {
      i++;
      continue;
    }

    // Numbers (e.g. 123, 3.14)
    if (isDigit(c)) {
      let numStr = '';
      while (i < expr.length && isDigit(expr[i])) {
        numStr += expr[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Function names or constants (sin, cos, tan, ln, log, sqrt, pi, e)
    if (isAlpha(c)) {
      let word = '';
      while (i < expr.length && isAlpha(expr[i])) {
        word += expr[i].toLowerCase();
        i++;
      }

      if (word === 'pi') {
        tokens.push({ type: 'NUMBER', value: Math.PI.toString() });
      } else if (word === 'e') {
        tokens.push({ type: 'NUMBER', value: Math.E.toString() });
      } else if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'ln', 'log', 'sqrt'].includes(word)) {
        tokens.push({ type: 'FUNCTION', value: word });
      } else {
        throw new Error(`Unknown identifier: ${word}`);
      }
      continue;
    }

    // Operators and Parentheses
    if (c === '(') {
      // Handle implicit multiplication: e.g. 5( -> 5*(
      const prev = tokens[tokens.length - 1];
      if (prev && (prev.type === 'NUMBER' || prev.type === 'RPAREN' || prev.type === 'POSTFIX')) {
        tokens.push({ type: 'OPERATOR', value: '*' });
      }
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (c === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (c === '!') {
      tokens.push({ type: 'POSTFIX', value: '!' });
      i++;
      continue;
    }

    if (['+', '-', '*', '/', '^', '%'].includes(c)) {
      // Check for unary minus:
      // At start of expression or after operator or after LPAREN
      const prev = tokens[tokens.length - 1];
      if (c === '-' && (!prev || prev.type === 'OPERATOR' || prev.type === 'LPAREN')) {
        // Treat as unary negative number or 0 -
        tokens.push({ type: 'NUMBER', value: '0' });
        tokens.push({ type: 'OPERATOR', value: '-' });
        i++;
        continue;
      }

      tokens.push({ type: 'OPERATOR', value: c });
      i++;
      continue;
    }

    throw new Error(`Unexpected character: ${c}`);
  }

  return tokens;
}

// Operator precedence & associativity
const PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '%': 2,
  '^': 3,
};

const IS_RIGHT_ASSOC: Record<string, boolean> = {
  '^': true,
};

// Evaluate mathematical expression using Shunting-Yard & RPN stack
export function evaluateExpression(expr: string, angleMode: AngleMode = 'DEG'): number {
  if (!expr || expr.trim() === '') return 0;

  // Auto-close missing parentheses if unbalanced
  let openParenCount = (expr.match(/\(/g) || []).length;
  let closeParenCount = (expr.match(/\)/g) || []).length;
  let balancedExpr = expr;
  while (openParenCount > closeParenCount) {
    balancedExpr += ')';
    closeParenCount++;
  }

  const tokens = tokenize(balancedExpr);
  if (tokens.length === 0) return 0;

  // Shunting-Yard to Output Queue (RPN)
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'NUMBER') {
      outputQueue.push(token);
      // If next is a function or number/constant without operator, implicit multiplication
      const next = tokens[i + 1];
      if (next && (next.type === 'FUNCTION')) {
        operatorStack.push({ type: 'OPERATOR', value: '*' });
      }
    } else if (token.type === 'FUNCTION') {
      operatorStack.push(token);
    } else if (token.type === 'POSTFIX') {
      outputQueue.push(token);
    } else if (token.type === 'OPERATOR') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== 'LPAREN' &&
        (
          operatorStack[operatorStack.length - 1].type === 'FUNCTION' ||
          (
            PRECEDENCE[operatorStack[operatorStack.length - 1].value] > PRECEDENCE[token.value] ||
            (
              PRECEDENCE[operatorStack[operatorStack.length - 1].value] === PRECEDENCE[token.value] &&
              !IS_RIGHT_ASSOC[token.value]
            )
          )
        )
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    } else if (token.type === 'LPAREN') {
      operatorStack.push(token);
    } else if (token.type === 'RPAREN') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== 'LPAREN'
      ) {
        outputQueue.push(operatorStack.pop()!);
      }

      if (operatorStack.length === 0) {
        throw new Error('Mismatched parentheses');
      }

      operatorStack.pop(); // Pop LPAREN

      if (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type === 'FUNCTION'
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
    }
  }

  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;
    if (op.type === 'LPAREN' || op.type === 'RPAREN') {
      throw new Error('Mismatched parentheses');
    }
    outputQueue.push(op);
  }

  // RPN Evaluation
  const evalStack: number[] = [];

  for (const token of outputQueue) {
    if (token.type === 'NUMBER') {
      const val = parseFloat(token.value);
      if (isNaN(val)) throw new Error('Invalid number: ' + token.value);
      evalStack.push(val);
    } else if (token.type === 'POSTFIX') {
      if (evalStack.length < 1) throw new Error('Malformed expression');
      const val = evalStack.pop()!;
      if (token.value === '!') {
        evalStack.push(factorial(val));
      }
    } else if (token.type === 'OPERATOR') {
      if (evalStack.length < 2) throw new Error('Malformed expression');
      const b = evalStack.pop()!;
      const a = evalStack.pop()!;

      switch (token.value) {
        case '+':
          evalStack.push(a + b);
          break;
        case '-':
          evalStack.push(a - b);
          break;
        case '*':
          evalStack.push(a * b);
          break;
        case '/':
          if (b === 0) throw new Error('Cannot divide by 0');
          evalStack.push(a / b);
          break;
        case '%':
          evalStack.push(a % b);
          break;
        case '^':
          evalStack.push(Math.pow(a, b));
          break;
        default:
          throw new Error('Unknown operator: ' + token.value);
      }
    } else if (token.type === 'FUNCTION') {
      if (evalStack.length < 1) throw new Error('Malformed expression');
      const arg = evalStack.pop()!;

      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const toDeg = (rad: number) => (rad * 180) / Math.PI;

      switch (token.value) {
        case 'sin':
          evalStack.push(Math.sin(angleMode === 'DEG' ? toRad(arg) : arg));
          break;
        case 'cos':
          evalStack.push(Math.cos(angleMode === 'DEG' ? toRad(arg) : arg));
          break;
        case 'tan': {
          const rad = angleMode === 'DEG' ? toRad(arg) : arg;
          // Check for tan(90 deg), etc.
          if (Math.abs(Math.cos(rad)) < 1e-14) throw new Error('Undefined');
          evalStack.push(Math.tan(rad));
          break;
        }
        case 'asin': {
          if (arg < -1 || arg > 1) throw new Error('Invalid asin domain');
          const res = Math.asin(arg);
          evalStack.push(angleMode === 'DEG' ? toDeg(res) : res);
          break;
        }
        case 'acos': {
          if (arg < -1 || arg > 1) throw new Error('Invalid acos domain');
          const res = Math.acos(arg);
          evalStack.push(angleMode === 'DEG' ? toDeg(res) : res);
          break;
        }
        case 'atan': {
          const res = Math.atan(arg);
          evalStack.push(angleMode === 'DEG' ? toDeg(res) : res);
          break;
        }
        case 'ln':
          if (arg <= 0) throw new Error('Invalid domain for ln');
          evalStack.push(Math.log(arg));
          break;
        case 'log':
          if (arg <= 0) throw new Error('Invalid domain for log');
          evalStack.push(Math.log10(arg));
          break;
        case 'sqrt':
          if (arg < 0) throw new Error('Invalid domain for sqrt');
          evalStack.push(Math.sqrt(arg));
          break;
        default:
          throw new Error('Unknown function: ' + token.value);
      }
    }
  }

  if (evalStack.length !== 1) {
    throw new Error('Malformed expression');
  }

  return evalStack[0];
}
