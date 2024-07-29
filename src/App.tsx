import Editor from '@monaco-editor/react';
import { useEffect, useMemo, useState } from 'react';
import './App.css';
import CodeInterface from './container/CodeInterface';
import { io } from "socket.io-client";

interface File {
  name: string;
  language: string;
  value: string;
}

const files: { [key: string]: File } = {
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: "console.log('hello world')",
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: "<div>hello world</div>",
  },
};

function App() {
  const socket = useMemo(
    () =>
      io("http://localhost:4000", {
        withCredentials: true,
      }),
    []
  );


  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    })

    return () => {
      socket.disconnect();
    };
  }, 
  
  [])





  const [fileName, setFileName] = useState<string>("script.js");
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

