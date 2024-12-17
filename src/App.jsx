import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import calculateCognitiveComplexity from './utils/cognitiveComplexity';
import { testExamples } from './utils/testExamples';

function App() {
  const [code, setCode] = useState('def example():\n    pass');
  const [complexity, setComplexity] = useState({ total: 0, lineComplexities: [] });
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    setComplexity(calculateCognitiveComplexity(code));
  }, [code]);

  const handleAutoFormat = () => {
    const formattedCode = code
      .split('\n')
      .map(line => line.trim())
      .join('\n');
    setCode(formattedCode);
  };

  const runTests = () => {
    const results = testExamples.map(example => {
      const result = calculateCognitiveComplexity(example.code);
      return {
        name: example.name,
        passed: result.total === example.expectedComplexity,
        expected: example.expectedComplexity,
        actual: result.total,
        code: example.code
      };
    });
    setTestResults(results);
    setCode(testExamples[0].code);
  };

  const handleTestClick = (testCode) => {
    setCode(testCode);
  };

  const renderAnnotations = () => {
    return complexity.lineComplexities.map((c, i) => ({
      row: i,
      column: 1000,
      type: 'info',
      text: c.reason,
      className: 'complexity-annotation'
    })).filter(a => a.text);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Python Code Analyzer</h1>
      <div style={{ 
        backgroundColor: '#2F3129', 
        color: 'white', 
        padding: '8px', 
        marginBottom: '8px',
        borderRadius: '4px'
      }}>
        Cognitive Complexity: {complexity.total}
      </div>
      <AceEditor
        mode="python"
        theme="monokai"
        onChange={setCode}
        value={code}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="400px"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        annotations={renderAnnotations()}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
        }}
      />
      <div>
        <button onClick={handleAutoFormat}>Autoformat</button>
        <button onClick={runTests}>Run Test Examples</button>
      </div>
      {testResults && (
        <div style={{ 
          marginTop: '20px', 
          backgroundColor: '#2F3129',
          padding: '10px',
          borderRadius: '4px'
        }}>
          <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>Test Results:</h3>
          {testResults.map((result, index) => (
            <div 
              key={index} 
              onClick={() => handleTestClick(result.code)}
              style={{ 
                color: result.passed ? '#4CAF50' : '#f44336',
                marginBottom: '5px',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '2px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3F4139'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {result.name}: {result.passed ? '✓' : '✗'} (Expected: {result.expected}, Got: {result.actual})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
