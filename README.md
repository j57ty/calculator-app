# 📱 All-in-One Multi-Tool Mobile Calculator App

A beautiful, production-grade cross-platform mobile calculator built with **React Native (Expo)**, **TypeScript**, and modern UI/UX design principles.

---

## ✨ Features

### 1. 🧮 Standard Mode (Basic Calculator)
- Arithmetic operations: Addition, Subtraction, Multiplication, Division (`+`, `-`, `×`, `÷`)
- Parentheses with auto-closing intelligence
- Percentage calculations (`%`)
- Sign toggle (`±`)
- Safe floating-point arithmetic (prevents IEEE `0.1 + 0.2 = 0.30000000000000004` precision bugs)
- Live calculation preview while typing

### 2. 🔬 Scientific Mode
- **Trigonometry**: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`
- **Angle Modes**: Toggle between **DEG** (Degrees) and **RAD** (Radians) anytime
- **Exponents & Powers**: `xʸ` (`^`) with right-associative power parsing
- **Roots**: Square root (`√`)
- **Factorial**: Postfix factorial (`x!`)
- **Logarithms**: Natural log (`ln`) and base-10 log (`log`)
- **Constants**: `π` (Pi) and `e` (Euler's number)
- **Reciprocal**: `1/x` function

### 3. 🔄 Multi-Category Converter
Instantly convert between units across 8 categories with an interactive keypad, dual input cards, and one-tap swap:
- **Length**: Meters, Kilometers, Centimeters, Millimeters, Miles, Yards, Feet, Inches
- **Weight/Mass**: Kilograms, Grams, Milligrams, Pounds, Ounces, Metric Tons
- **Temperature**: Celsius (°C), Fahrenheit (°F), Kelvin (K)
- **Currency**: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, AED
- **Speed**: km/h, mph, m/s, knots
- **Volume**: Liters, Milliliters, Gallons, Cups, Fluid Ounces, Cubic Meters
- **Area**: Square Meters, Square Kilometers, Square Feet, Square Yards, Acres, Hectares
- **Data / Digital**: Bytes, KB, MB, GB, TB

### 4. 🧠 Memory Functions
- **MC**: Clear stored memory
- **MR**: Recall memory into current calculation
- **M+**: Add current result to memory
- **M-**: Subtract current result from memory
- **M Badge**: Appears automatically on the display whenever memory has a stored value!

### 5. 📋 Tap-to-Copy & Physical Keyboard Support
- **Tap to Copy**: Tap the primary result on the display to instantly copy the number to your clipboard with an animated "Copied" checkmark toast!
- **Physical Keyboard / Numpad**: On Web or external tablet keyboards, directly type `0-9`, `+`, `-`, `*`, `/`, `Enter` or `=` (calculate), `Backspace`, `Escape` (clear), `%`, and parentheses.

### 6. 🌐 Live Currency Exchange Rates
- Real-time exchange rates fetched from live currency markets with automatic offline caching and a manual "Refresh" button.

### 7. 📜 Calculation History
- Every calculation is saved locally with timestamps
- Tap any calculation card in the history drawer to restore its expression and result
- One-tap "Clear All" with persistent storage via `AsyncStorage`

### 8. 🎨 Design & Accessibility
- **OLED Dark Mode & Clean Light Mode**: Toggle instantly with the top bar icon
- **Tactile Haptic Feedback**: Native vibration clicks on keypresses via `expo-haptics`
- **Responsive Display**: Dynamic font-size scaling prevents numbers from clipping or wrapping
- **Cross-Platform**: Runs natively on iOS, Android, and Web

---

## 🚀 Getting Started

### Prerequisites
Make sure you are in the project folder:
```bash
cd calculator-app
```

### 1. Run in Web Browser
To preview the app immediately in your browser:
```bash
npm run web
```
The app will automatically open at `http://localhost:8081` formatted within an authentic mobile phone layout.

### 2. Run on your Physical iPhone or Android
1. Install the free **Expo Go** app on your phone from the Apple App Store or Google Play Store.
2. Run the start command:
   ```bash
   npm start
   ```
3. Scan the QR code displayed in your terminal using:
   - **Android**: The QR scanner inside the Expo Go app.
   - **iPhone**: The native iOS Camera app (tap the Expo Go banner that appears).

### 3. Run Automated Engine Tests
```bash
npm test
```

---

## 📁 Project Structure

```
calculator-app/
├── src/
│   ├── components/
│   │   ├── Button.tsx              # Haptic, animated pressable key
│   │   ├── Display.tsx             # Dynamic auto-scaling LCD-style display
│   │   ├── Header.tsx              # Segmented mode pills, theme & history triggers
│   │   ├── Keypad.tsx              # 4-column standard keypad
│   │   ├── ScientificKeypad.tsx    # 5-column scientific calculator keypad
│   │   ├── ConverterScreen.tsx     # Dual-card unit & currency converter
│   │   └── HistoryModal.tsx        # Persistent calculation log drawer
│   ├── theme/
│   │   ├── colors.ts               # Dark & Light palette configurations
│   │   └── ThemeContext.tsx        # Dynamic theme provider with storage
│   ├── types/
│   │   └── calculator.ts           # TypeScript models and interfaces
│   └── utils/
│       ├── calculatorEngine.ts     # Shunting-yard parser, AST, floating-point fixer
│       └── converters.ts           # Conversion matrices for all 8 categories
├── App.tsx                         # Main app entry and navigation coordinator
├── package.json
└── tsconfig.json
```
