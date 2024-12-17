import calculateCognitiveComplexity from './cognitiveComplexity.js';
import { testExamples } from './testExamples.js';
import chalk from 'chalk';

function runTests() {
  console.log(chalk.blue('\nRunning Cognitive Complexity Tests\n'));
  
  let passed = 0;
  let failed = 0;
  
  testExamples.forEach((test, index) => {
    const result = calculateCognitiveComplexity(test.code);
    const isPassed = result.total === test.expectedComplexity;
    
    if (isPassed) {
      passed++;
      console.log(chalk.green(`✓ ${test.name}`));
    } else {
      failed++;
      console.log(chalk.red(`✗ ${test.name}`));
      console.log(chalk.gray(`  Expected: ${test.expectedComplexity}`));
      console.log(chalk.gray(`  Got: ${result.total}`));
    }
    console.log(chalk.gray(`  ${test.explanation}`));
    console.log();
  });
  
  console.log(chalk.blue('Test Summary:'));
  console.log(chalk.green(`  Passed: ${passed}`));
  console.log(chalk.red(`  Failed: ${failed}`));
  console.log(chalk.blue(`  Total: ${passed + failed}`));
  console.log();
  
  process.exit(failed ? 1 : 0);
}

runTests();
