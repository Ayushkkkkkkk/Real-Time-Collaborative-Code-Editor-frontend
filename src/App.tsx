import Editor from '@monaco-editor/react';
import { useState, useRef } from 'react';

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
  const editorRef = useRef(null);
  return <>
    <button onClick={() => setFileName("script.py")}>script.py</button>
    <button onClick={() => setFileName("index.html")}>index.html</button>
    <Editor height="100vh" defaultLanguage={file.language} defaultValue={file.value} path={file.name} theme='vs-dark' />;
  </>
}

export default App;
