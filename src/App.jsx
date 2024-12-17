import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import calculateCognitiveComplexity from './utils/cognitiveComplexity';

function App() {
  const [code, setCode] = useState('def example():\n    pass');

  const handleAutoFormat = () => {
    const formattedCode = code
      .split('\n')
      .map(line => line.trim())
      .join('\n');
    setCode(formattedCode);
  };

  const computeComplexity = () => {
    const complexity = calculateCognitiveComplexity(code);
    alert(`Cognitive Complexity: ${complexity}`);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Python Code Analyzer</h1>
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
        <button onClick={computeComplexity}>Compute Cognitive Complexity</button>
      </div>
    </div>
  );
}

export default App;
