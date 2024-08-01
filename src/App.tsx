import Editor from '@monaco-editor/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import CodeInterface from './container/CodeInterface';
import { io } from 'socket.io-client';
import { initVimMode } from 'monaco-vim'; // Import monaco-vim

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
  const vimModeRef = useRef<any>(null); // Reference for Vim mode
  const [editorValue, setEditorValue] = useState<string>(files["script.js"].value);
  const [fileName, setFileName] = useState<string>("script.js");
  const [output, setOutput] = useState<string>(""); // State for output
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

    // Initialize Vim mode
    const statusNode = document.createElement('div');
    document.body.appendChild(statusNode);
    vimModeRef.current = initVimMode(editor, statusNode);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setEditorValue(value);
      socket.emit("editor-message", value); // Emit editor content to server
    }
  };

  const handleRunCode = async () => {
    try {
      const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source_code: editorValue,
          language_id: 63, // Assuming JavaScript; map languages as needed
          stdin: "", // You can pass input if needed
          expected_output: "" // If you have an expected output to match against
        })
      });

      const result = await response.json();
      setOutput(result.stdout || result.stderr || "No output");
    } catch (error) {
      console.log(error);
      setOutput("An error occurred while executing the code.");
    }
  };

  return (
    <div className="app">
      <CodeInterface files={files} currentFileName={fileName} setFileName={setFileName} />
      <div className="editor-container">
        <Editor
          height="80vh"
          width="100%"
          language={file.language}
          value={editorValue}
          path={file.name}
          theme="vs-dark"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
      </div>
      <div className="output-container">
        <button onClick={handleRunCode}>Run</button>
        <pre className="output">{output}</pre>
      </div>
    </div>
  );
}

export default App;

