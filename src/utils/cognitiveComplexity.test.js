import { describe, test, expect } from 'vitest';
import calculateCognitiveComplexity from './cognitiveComplexity';
import { testExamples } from './testExamples';

describe('Cognitive Complexity Calculator', () => {
  describe('Documentation Examples', () => {
    testExamples.forEach(example => {
      test(example.name, () => {
        const result = calculateCognitiveComplexity(example.code);
        expect(result.total).toBe(example.expectedComplexity);
      });
    });
  });

  describe('Line Complexity Details', () => {
    test('Nested structures should show correct line complexity', () => {
      const example = testExamples.find(t => t.name === "Nested If Statements (B1 + B2)");
      const result = calculateCognitiveComplexity(example.code);
      expect(result.total).toBe(example.expectedComplexity);
      expect(result.lineComplexities[1].value).toBe(1); // first if
      expect(result.lineComplexities[2].value).toBe(2); // nested if
    });

    test('Boolean operators should increment once per sequence', () => {
      const example = testExamples.find(t => t.name === "Multiple Conditions (B1 + B3)");
      const result = calculateCognitiveComplexity(example.code);
      expect(result.total).toBe(example.expectedComplexity);
      expect(result.lineComplexities[1].value).toBe(2); // if + boolean sequence
      expect(result.lineComplexities[3].value).toBe(2); // elif + boolean sequence
    });
  });

  describe('Control Flow Structures', () => {
    test('try-except blocks', () => {
      const example = testExamples.find(t => t.name === "Exception Handling");
      const result = calculateCognitiveComplexity(example.code);
      expect(result.total).toBe(example.expectedComplexity);
    });

    test('for loops with break/continue', () => {
      const example = testExamples.find(t => t.name === "Loop with Break (B1 + B2)");
      const result = calculateCognitiveComplexity(example.code);
      expect(result.total).toBe(example.expectedComplexity);
    });

    test('nested loops and conditions', () => {
      const example = testExamples.find(t => t.name === "Complex Nesting with Loops");
      const result = calculateCognitiveComplexity(example.code);
      expect(result.total).toBe(example.expectedComplexity);
    });

    test('recursive functions', () => {
      const example = testExamples.find(t => t.name === "Recursive Function");
      const result = calculateCognitiveComplexity(example.code);
      expect(result.total).toBe(example.expectedComplexity);
    });
  });

  describe('Edge Cases', () => {
    test('Empty function', () => {
      const code = testExamples.find(t => t.name === "Empty Function").code;
      const result = calculateCognitiveComplexity(code);
      expect(result.total).toBe(0);
    });

    test('Function with only comments', () => {
      const code = testExamples.find(t => t.name === "Comments Only").code;
      const result = calculateCognitiveComplexity(code);
      expect(result.total).toBe(0);
    });

    test('Empty string', () => {
      const code = testExamples.find(t => t.name === "Empty String").code;
      const result = calculateCognitiveComplexity(code);
      expect(result.total).toBe(0);
    });
  });
});
