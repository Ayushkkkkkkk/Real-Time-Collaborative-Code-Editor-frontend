import Editor from '@monaco-editor/react';
import { useState } from 'react';
import './App.css';
import CodeInterface from './container/CodeInterface';

interface File {
  name: string;
  language: string;
  value: string;
}

const files: { [key: string]: File } = {
  "script.py": {
    name: "script.py",
    language: "python",
    value: "// Write code here",
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: "<div>hello world</div>",
  },
};

function App() {
  const [fileName, setFileName] = useState<string>("script.py");
  const file: File = files[fileName];

  return (
    <div className="app">
      <CodeInterface files={files} currentFileName={fileName} setFileName={setFileName} />
      <div className="editor-container">
        <Editor
          height="100%"
          width="100%"
          defaultLanguage={file.language}
          defaultValue={file.value}
          path={file.name}
          theme="vs-dark"
        />
      </div>
    </div>
  );
}

export default App;

