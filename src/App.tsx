import Editor from '@monaco-editor/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import CodeInterface from './container/CodeInterface';
import { io } from 'socket.io-client';

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

  const editorRef = useRef<any>(null);
  const [editorValue, setEditorValue] = useState<string>("");
  const [fileName, setFileName] = useState<string>("script.js");
  const file: File = files[fileName];

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("editor-message", (data: string) => {
      console.log('Received message from server:', data);
      setEditorValue(data);
    });

    return () => {
      socket.disconnect();
      socket.off("editor-message");
    };
  }, [socket]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setEditorValue(value);
      socket.emit("editor-message", value); // Emit editor content to server
    }
  };

  return (
    <div className="app">
      <CodeInterface files={files} currentFileName={fileName} setFileName={setFileName} />
      <div className="editor-container">
        <Editor
          height="100%"
          width="100%"
          language={file.language}
          value={editorValue}
          path={file.name}
          theme="vs-dark"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
      </div>
      <button onClick={() => handleEditorChange(editorRef.current?.getValue())}>Get Editor Value</button>
    </div>
  );
}

export default App;

