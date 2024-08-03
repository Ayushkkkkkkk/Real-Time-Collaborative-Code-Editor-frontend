import Editor from '@monaco-editor/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import { initVimMode } from 'monaco-vim';
import ChatBox from './container/Chatbox/ChatBox';

interface File {
  name: string;
  language: string;
  value: string;
}

function App() {
  const socket = useMemo(
    () =>
      io("http://localhost:4000", {
        withCredentials: true,
      }),
    []
  );

  const [files, setFiles] = useState<{ [key: string]: File }>({});
  const [newFileName, setNewFileName] = useState("");
  const [editorValue, setEditorValue] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const editorRef = useRef<any>(null);
  const vimModeRef = useRef<any>(null);

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

  useEffect(() => {
    socket.on("chat-message", (msg: { username: string; text: string; }) => {
      console.log('Received chat message:', msg);
      // You can handle the chat message here or pass it to ChatBox
    });

    return () => {
      socket.off("chat-message");
    };
  }, [socket]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    const statusNode = document.createElement('div');
    document.body.appendChild(statusNode);
    vimModeRef.current = initVimMode(editor, statusNode);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setEditorValue(value);
      if (fileName) {
        socket.emit("editor-message", value);
      }
    }
  };

  const handleRunCode = async () => {
    try {
      const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '947263138emsh6395daaef83aab5p1d2114jsn5fe463414cf3',
        },
        body: JSON.stringify({
          source_code: editorValue,
          language_id: 63,
          stdin: "",
          expected_output: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      setOutput(result.stdout || result.stderr || "No output");
    } catch (error) {
      console.error("Error:", error);
      setOutput("An error occurred while executing the code.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFileName(e.target.value);
  }

  const handleAddFile = () => {
    if (newFileName.trim()) {
      const fileExtension = newFileName.split('.').pop() || '';
      const language = fileExtension === 'js' ? 'javascript' : fileExtension === 'html' ? 'html' : 'plaintext';

      const newFile: File = {
        name: newFileName,
        language,
        value: "",
      };

      setFiles(prevFiles => ({ ...prevFiles, [newFileName]: newFile }));
      setFileName(newFileName);
      setEditorValue("");
      setNewFileName("");
    }
  }

  const handleFileChange = (name: string) => {
    if (files[name]) {
      setFileName(name);
      setEditorValue(files[name].value);
    }
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="app">
      <div className="file-interface">
        {Object.keys(files).length > 0 && fileName && (
          <select onChange={(e) => handleFileChange(e.target.value)} value={fileName}>
            {Object.keys(files).map(file => (
              <option key={file} value={file}>{file}</option>
            ))}
          </select>
        )}
        <div className="add-file-container">
          <input
            type='text'
            placeholder='Enter file name'
            value={newFileName}
            onChange={handleInputChange}
          />
          <button onClick={handleAddFile}>Add File</button>
        </div>
      </div>
      <div className="editor-container">
        {fileName ? (
          <Editor
            height="calc(100vh - 150px)"
            width="100%"
            language={files[fileName]?.language || 'plaintext'}
            value={editorValue}
            path={fileName}
            theme="vs-dark"
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
          />
        ) : (
          <p className="placeholder">No file selected. Please create or select a file.</p>
        )}
      </div>
      {fileName && (
        <div className="output-container">
          <button onClick={handleRunCode}>Run</button>
          <pre className="output">{output}</pre>
        </div>
      )}
      <button className="chat-toggle-btn" onClick={toggleChat}>
        {isChatOpen ? 'Close Chat' : 'Open Chat'}
      </button>
      {isChatOpen && <ChatBox onClose={closeChat} socket={socket} />}
    </div>
  );
}

export default App;

