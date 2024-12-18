const calculateLineComplexity = (line, context) => {
  const complexity = { value: 0, reason: '' };
  const { nestingLevel, inDecorator, inComprehension, continuedBooleanSequence } = context;
  
  // Skip complexity calculation if we're in a decorator or comprehension
  if (inDecorator || inComprehension) {
    return complexity;
  }

  // Strip any existing complexity comments
  line = line.replace(/\s*#\s*\+\d.*$/, '').trim();

  // Ignore try and finally blocks (they don't add complexity)
  if (line.startsWith('try:') || line.startsWith('finally:')) {
    return complexity;
  }

  // Check for control structures first
  if (line.startsWith('if ') || line.startsWith('elif ')) {
    complexity.value = 1 + nestingLevel;
    complexity.reason = nestingLevel > 0 ? `+${1 + nestingLevel} (nesting=${nestingLevel})` : '+1';
  }
  else if (line.startsWith('else:')) {
    complexity.value = 1;
    complexity.reason = '+1';
  }
  else if (line.startsWith('for ') || line.startsWith('while ')) {
    // Skip if it's a list comprehension
    if (!line.includes('[') && !line.includes('{')) {
      complexity.value = 1 + nestingLevel;
      complexity.reason = nestingLevel > 0 ? `+${1 + nestingLevel} (nesting=${nestingLevel})` : '+1';
    }
  }
  // Exception handling - each except adds 1 without nesting increment
  else if (line.startsWith('except ')) {
    complexity.value = 1;
    complexity.reason = '+1 (exception)';
  }
  // Check for lambda (don't add complexity unless it contains complex logic)
  else if (line.includes('lambda') && !line.includes('if') && !line.includes('and') && !line.includes('or')) {
    return complexity;
  }
  
  // Check for recursive calls (identified by function name)
  if (context.functionName && line.includes(context.functionName + '(')) {
    const isRecursive = !line.startsWith('def '); // Exclude function definition
    if (isRecursive) {
      complexity.value += 1;
      complexity.reason = complexity.reason ? 
        `${complexity.reason}, +1 (recursion)` : 
        '+1 (recursion)';
    }
  }
  
  // Check for boolean sequences with mixed operators
  const hasAnd = line.includes(' and ');
  const hasOr = line.includes(' or ');
  const endsWithAnd = line.trim().endsWith(' and');
  const endsWithOr = line.trim().endsWith(' or');
  const startsWithAnd = line.trim().startsWith('and ');
  const startsWithOr = line.trim().startsWith('or ');
  
  const isPartOfBooleanSequence = hasAnd || hasOr || endsWithAnd || endsWithOr || 
    startsWithAnd || startsWithOr || continuedBooleanSequence;

  if (isPartOfBooleanSequence) {
    // Only add boolean sequence complexity if this is the start of a sequence
    // or if it's a new type of operator
    if (!continuedBooleanSequence || 
        (continuedBooleanSequence.type === 'and' && (hasOr || startsWithOr)) ||
        (continuedBooleanSequence.type === 'or' && (hasAnd || startsWithAnd))) {
      
      const hasMixedOperators = (hasAnd && hasOr) || 
        (continuedBooleanSequence && (
          (continuedBooleanSequence.type === 'and' && (hasOr || startsWithOr)) ||
          (continuedBooleanSequence.type === 'or' && (hasAnd || startsWithAnd))
        ));
      
      const booleanComplexity = hasMixedOperators ? 2 : 1;
      complexity.value += booleanComplexity;
      const reason = hasMixedOperators ? 
        '+2 (mixed boolean sequence)' : 
        '+1 (boolean sequence)';
      complexity.reason = complexity.reason ? 
        `${complexity.reason}, ${reason}` : 
        reason;
    }
  }
  
  return complexity;
};

const extractFunctionName = (line) => {
  if (line.startsWith('def ')) {
    const match = line.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    return match ? match[1] : null;
  }
  return null;
};

const calculateCognitiveComplexity = (code) => {
  let totalComplexity = 0;
  let nestingLevel = 0;
  let inDecorator = false;
  let inComprehension = false;
  let currentFunctionName = null;
  let continuedBooleanSequence = null;
  const lineComplexities = [];
  
  // First, clean any existing complexity comments
  const lines = code.split('\n').map(line => line.replace(/\s*#\s*\+\d.*$/, ''));
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) {
      lineComplexities.push({ value: 0, reason: '' });
      continue;
    }

    // Check for decorator
    if (line.startsWith('@')) {
      inDecorator = true;
      lineComplexities.push({ value: 0, reason: '' });
      continue;
    }
    
    // Check for list/dict comprehension or generator expression
    if (line.includes('[') || line.includes('{') || line.includes('(')) {
      const hasComprehension = 
        (line.includes('for') && line.includes('in')) ||
        line.includes('if') && 
        (line.includes(']') || line.includes('}') || line.includes(')'));
      if (hasComprehension) {
        inComprehension = true;
      }
    }

    // Check for function definition and extract name
    if (line.startsWith('def ')) {
      currentFunctionName = extractFunctionName(line);
      inDecorator = false; // Reset decorator flag
    }

    // Track boolean sequences across lines
    const hasAnd = line.includes(' and ');
    const hasOr = line.includes(' or ');
    const endsWithAnd = line.trim().endsWith(' and');
    const endsWithOr = line.trim().endsWith(' or');
    const startsWithAnd = line.trim().startsWith('and ');
    const startsWithOr = line.trim().startsWith('or ');

    if (hasAnd || hasOr || endsWithAnd || endsWithOr || startsWithAnd || startsWithOr) {
      if (!continuedBooleanSequence) {
        continuedBooleanSequence = {
          type: hasAnd || endsWithAnd || startsWithAnd ? 'and' : 'or',
          startLine: i
        };
      }
    } else if (line.endsWith(':') || line.endsWith(';') || line.endsWith(')')) {
      continuedBooleanSequence = null;
    }

    const context = {
      nestingLevel,
      inDecorator,
      inComprehension,
      functionName: currentFunctionName,
      continuedBooleanSequence
    };
    
    const complexity = calculateLineComplexity(line, context);
    lineComplexities.push(complexity);
    totalComplexity += complexity.value;
    
    // Reset comprehension flag after processing the line
    inComprehension = false;
    
    // Adjust nesting level based on control structures
    if ((line.startsWith('if ') || line.startsWith('elif ') || 
         line.startsWith('for ') || line.startsWith('while ')) &&
        !inComprehension) {
      nestingLevel++;
    }
    
    // Check for end of block by looking at next line's indentation
    if (i < lines.length - 1) {
      const nextLine = lines[i + 1].trim();
      if (nextLine.length > 0) {
        const currentIndent = lines[i].search(/\S/);
        const nextIndent = lines[i + 1].search(/\S/);
        if (nextIndent <= currentIndent) {
          nestingLevel = Math.max(0, nestingLevel - 1);
        }
      }
    }
  }

  console.log("Total Cognitive Complexity:", totalComplexity);
  console.table(lineComplexities);
  
  return { total: totalComplexity, lineComplexities };
};

export default calculateCognitiveComplexity;
