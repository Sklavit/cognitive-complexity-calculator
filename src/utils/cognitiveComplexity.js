const calculateCognitiveComplexity = (code) => {
  let complexity = 0;
  let nestingLevel = 0;
  
  // Split code into lines and remove empty lines
  const lines = code.split('\n').filter(line => line.trim());
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Increment for control flow structures
    if (line.startsWith('if ') || line.startsWith('elif ')) {
      complexity += 1 + nestingLevel;
      nestingLevel++;
    }
    else if (line.startsWith('else:')) {
      complexity += 1;
    }
    else if (line.startsWith('for ') || line.startsWith('while ')) {
      complexity += 1 + nestingLevel;
      nestingLevel++;
    }
    else if (line.startsWith('try:')) {
      nestingLevel++;
    }
    else if (line.startsWith('except ')) {
      complexity += 1 + nestingLevel;
    }
    
    // Check for logical operators
    if (line.includes(' and ') || line.includes(' or ')) {
      complexity += 1;
    }
    
    // Decrease nesting level when block ends
    if (i < lines.length - 1 && 
        lines[i + 1].trim().length > 0 && 
        lines[i + 1].search(/\S/) <= line.search(/\S/)) {
      nestingLevel = Math.max(0, nestingLevel - 1);
    }
  }
  
  return complexity;
};

export default calculateCognitiveComplexity;
