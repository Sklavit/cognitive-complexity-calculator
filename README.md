# Python Code Cognitive Complexity Analyzer

A web-based tool for analyzing the cognitive complexity of Python code. This tool helps developers understand and measure the cognitive complexity of their Python functions, making it easier to identify code that might be difficult to understand and maintain.

## Features

- Real-time cognitive complexity calculation
- Line-by-line complexity annotations
- Syntax-highlighted Python code editor
- Built-in test examples with explanations
- Auto-formatting capability
- Interactive test results display

## Getting Started

### Prerequisites

- Node.js (version 18.17.0)
- npm (included with Node.js)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd python-code-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at the local URL provided in the terminal.

## Usage

1. Enter or paste Python code into the editor
2. View the total cognitive complexity score at the top
3. See line-by-line complexity annotations on the right side of each line
4. Use the "Autoformat" button to format the code
5. Click "Compute Complexity" to recalculate and update annotations
6. Click "Run Test Examples" to see predefined examples

## Test Examples

The application includes various test cases demonstrating different aspects of cognitive complexity:
- Simple conditionals
- Nested structures
- Boolean logic
- Loops and breaks
- Exception handling
- Recursion

Click on any test example to load it into the editor and see its complexity calculation.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run coverage` - Generate test coverage report
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure

```
/src
  /utils
    cognitiveComplexity.js    # Complexity calculation logic
    cognitiveComplexity.test.js # Test cases
    testExamples.js           # Example code samples
  App.jsx                     # Main application component
  main.jsx                    # Application entry point
  index.css                   # Global styles
```

## Cognitive Complexity Rules

The complexity calculation follows these basic rules:
1. Increment for breaks in the linear flow (if, for, while, etc.)
2. Increment when flow-breaking structures are nested
3. Increment for boolean logic sequences
4. Increment for exception handling
5. Special handling for breaks and continues

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on the cognitive complexity methodology by G. Ann Campbell
- Uses React and Vite for the frontend
- Uses Ace Editor for code editing capabilities
