const calculateLineComplexity = (line, nestingLevel) => {
  const complexity = { value: 0, reason: '' };
  
  if (line.startsWith('if ') || line.startsWith('elif ')) {
    complexity.value = 1 + nestingLevel;
    complexity.reason = nestingLevel > 0 ? `+${1 + nestingLevel} (nesting=${nestingLevel})` : '+1';
  }
  else if (line.startsWith('else:')) {
    complexity.value = 1;
    complexity.reason = '+1';
  }
  else if (line.startsWith('for ') || line.startsWith('while ')) {
    complexity.value = 1 + nestingLevel;
    complexity.reason = nestingLevel > 0 ? `+${1 + nestingLevel} (nesting=${nestingLevel})` : '+1';
  }
  else if (line.startsWith('except ')) {
    complexity.value = 1 + nestingLevel;
    complexity.reason = nestingLevel > 0 ? `+${1 + nestingLevel} (nesting=${nestingLevel})` : '+1';
  }
  
  if (line.includes(' and ') || line.includes(' or ')) {
    complexity.value += 1;
    complexity.reason = complexity.reason ? `${complexity.reason}, +1 (logical)` : '+1 (logical)';
  }
  
  return complexity;
};

const calculateCognitiveComplexity = (code) => {
  let totalComplexity = 0;
  let nestingLevel = 0;
  const lineComplexities = [];
  
  const lines = code.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      lineComplexities.push({ value: 0, reason: '' });
      continue;
    }
    
    const complexity = calculateLineComplexity(line, nestingLevel);
    lineComplexities.push(complexity);
    totalComplexity += complexity.value;
    
    if (line.startsWith('if ') || line.startsWith('elif ') || 
        line.startsWith('for ') || line.startsWith('while ') ||
        line.startsWith('try:')) {
      nestingLevel++;
    }
    
    if (i < lines.length - 1 && 
        lines[i + 1].trim().length > 0 && 
        lines[i + 1].search(/\S/) <= line.search(/\S/)) {
      nestingLevel = Math.max(0, nestingLevel - 1);
    }
  }
  
  return { total: totalComplexity, lineComplexities };
};

export default calculateCognitiveComplexity;
