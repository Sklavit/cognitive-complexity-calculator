import { Python3Parser, Python3Listener } from 'dt-python-parser';

/**
 * Remove Python comments while preserving line structure
 * This is needed because comments in certain positions (like after `and` in multiline if)
 * can break the parser, but we need to preserve line numbers for complexity tracking
 */
function removeCommentsPreservingLines(code) {
  return code.split('\n').map(line => {
    // Remove comments but keep the newline
    const commentIndex = line.indexOf('#');
    if (commentIndex >= 0) {
      return line.substring(0, commentIndex).trimEnd();
    }
    return line;
  }).join('\n');
}

/**
 * Custom listener to calculate cognitive complexity from Python AST
 */
class CognitiveComplexityListener extends Python3Listener {
  constructor(code) {
    super();
    this.totalComplexity = 0;
    this.nestingLevel = 0;
    this.sourceLines = code.split('\n');
    this.lineComplexities = this.sourceLines.map(() => ({ value: 0, reason: '' }));
    this.currentFunctionName = null;
    this.inComprehension = 0;
    this.processedBooleanNodes = new WeakSet();
  }

  /**
   * Add complexity to a specific line
   */
  addComplexity(line, value, reason) {
    if (line >= 0 && line < this.lineComplexities.length) {
      this.lineComplexities[line].value += value;
      if (this.lineComplexities[line].reason) {
        this.lineComplexities[line].reason += `, ${reason}`;
      } else {
        this.lineComplexities[line].reason = reason;
      }
      this.totalComplexity += value;
    }
  }

  /**
   * Get line number from context (1-based to 0-based index)
   */
  getLine(ctx) {
    return ctx.start ? ctx.start.line - 1 : 0;
  }

  // Function definitions
  enterFuncdef(ctx) {
    // Extract function name - the name is typically the second child after 'def'
    if (ctx.children && ctx.children.length > 1) {
      const nameNode = ctx.children[1];
      if (nameNode && nameNode.getText) {
        this.currentFunctionName = nameNode.getText();
      }
    }
  }

  exitFuncdef(ctx) {
    this.currentFunctionName = null;
  }

  // If statements
  enterIf_stmt(ctx) {
    if (!ctx.children) return;

    // Handle if/elif/else by examining children
    // All if/elif/else in the same chain share the same nesting level
    let hasIf = false;
    for (let i = 0; i < ctx.children.length; i++) {
      const child = ctx.children[i];
      const tokenText = child.symbol ? child.symbol.text : null;

      if (tokenText === 'if') {
        const line = child.symbol ? child.symbol.line - 1 : 0;
        const complexity = 1 + this.nestingLevel;
        const reason = this.nestingLevel > 0 ?
          `+${complexity} (nesting=${this.nestingLevel})` :
          '+1';
        this.addComplexity(line, complexity, reason);
        hasIf = true;
      } else if (tokenText === 'elif') {
        // elif is at the same level as if, not nested further
        const line = child.symbol ? child.symbol.line - 1 : 0;
        const complexity = 1 + this.nestingLevel;
        const reason = this.nestingLevel > 0 ?
          `+${complexity} (nesting=${this.nestingLevel})` :
          '+1';
        this.addComplexity(line, complexity, reason);
      } else if (tokenText === 'else') {
        const line = child.symbol ? child.symbol.line - 1 : 0;
        this.addComplexity(line, 1, '+1');
      }
    }

    // Only increment nesting once for the entire if/elif/else chain
    if (hasIf) {
      this.nestingLevel++;
    }
  }

  exitIf_stmt(ctx) {
    // Decrease nesting level once for the entire if/elif/else chain
    this.nestingLevel = Math.max(0, this.nestingLevel - 1);
  }

  // While loops
  enterWhile_stmt(ctx) {
    if (this.inComprehension > 0) return;

    const line = this.getLine(ctx);
    const complexity = 1 + this.nestingLevel;
    const reason = this.nestingLevel > 0 ?
      `+${complexity} (nesting=${this.nestingLevel})` :
      '+1';
    this.addComplexity(line, complexity, reason);
    this.nestingLevel++;
  }

  exitWhile_stmt(ctx) {
    if (this.inComprehension > 0) return;
    this.nestingLevel = Math.max(0, this.nestingLevel - 1);
  }

  // For loops
  enterFor_stmt(ctx) {
    if (this.inComprehension > 0) return;

    const line = this.getLine(ctx);
    const complexity = 1 + this.nestingLevel;
    const reason = this.nestingLevel > 0 ?
      `+${complexity} (nesting=${this.nestingLevel})` :
      '+1';
    this.addComplexity(line, complexity, reason);
    this.nestingLevel++;
  }

  exitFor_stmt(ctx) {
    if (this.inComprehension > 0) return;
    this.nestingLevel = Math.max(0, this.nestingLevel - 1);
  }

  // Exception handling
  enterExcept_clause(ctx) {
    const line = this.getLine(ctx);
    this.addComplexity(line, 1, '+1 (exception)');
    this.nestingLevel++;
  }

  exitExcept_clause(ctx) {
    this.nestingLevel = Math.max(0, this.nestingLevel - 1);
  }

  // Boolean operators
  enterAnd_test(ctx) {
    if (ctx.children && ctx.children.length > 1 && !this.processedBooleanNodes.has(ctx)) {
      this.processedBooleanNodes.add(ctx);
      const line = this.getLine(ctx);
      this.addComplexity(line, 1, '+1 (boolean sequence)');
    }
  }

  enterOr_test(ctx) {
    if (ctx.children && ctx.children.length > 1 && !this.processedBooleanNodes.has(ctx)) {
      this.processedBooleanNodes.add(ctx);
      const line = this.getLine(ctx);
      this.addComplexity(line, 1, '+1 (boolean sequence)');
    }
  }

  // Comprehensions
  enterListmaker(ctx) {
    this.inComprehension++;
  }

  exitListmaker(ctx) {
    this.inComprehension = Math.max(0, this.inComprehension - 1);
  }

  enterSetlistmaker(ctx) {
    this.inComprehension++;
  }

  exitSetlistmaker(ctx) {
    this.inComprehension = Math.max(0, this.inComprehension - 1);
  }

  enterDictmaker(ctx) {
    this.inComprehension++;
  }

  exitDictmaker(ctx) {
    this.inComprehension = Math.max(0, this.inComprehension - 1);
  }

  enterTestlist_comp(ctx) {
    const text = ctx.getText();
    if (text.includes('for')) {
      this.inComprehension++;
    }
  }

  exitTestlist_comp(ctx) {
    const text = ctx.getText();
    if (text.includes('for')) {
      this.inComprehension = Math.max(0, this.inComprehension - 1);
    }
  }

  // Recursion detection
  enterAtom_expr(ctx) {
    if (this.currentFunctionName) {
      const text = ctx.getText();
      if (text.startsWith(this.currentFunctionName + '(')) {
        const line = this.getLine(ctx);
        this.addComplexity(line, 1, '+1 (recursion)');
      }
    }
  }
}

/**
 * Calculate cognitive complexity of Python code using AST parsing
 * @param {string} code - Python source code
 * @returns {object} - { total: number, lineComplexities: array }
 */
const calculateCognitiveComplexity = (code) => {
  try {
    const parser = new Python3Parser();
    const listener = new CognitiveComplexityListener(code);

    // Remove comments that might break multiline parsing while preserving line numbers
    const cleanedCode = removeCommentsPreservingLines(code);

    // Parse the cleaned code
    const tree = parser.parse(cleanedCode);

    // Walk the AST with the listener
    parser.listen(listener, tree);

    console.log("Total Cognitive Complexity:", listener.totalComplexity);
    console.table(listener.lineComplexities);

    return {
      total: listener.totalComplexity,
      lineComplexities: listener.lineComplexities
    };
  } catch (error) {
    console.error("Error parsing Python code:", error);
    // Fallback to returning zero complexity if parsing fails
    const lines = code.split('\n');
    return {
      total: 0,
      lineComplexities: lines.map(() => ({ value: 0, reason: '' }))
    };
  }
};

export default calculateCognitiveComplexity;
