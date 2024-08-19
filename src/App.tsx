import React, { useState, useMemo, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import { initVimMode } from 'monaco-vim';
import ChatBox from './container/Chatbox/ChatBox';
import './App.css';
import LoginPage from './container/Login/Login';





interface File {
  name: string;
  language: string;
  value: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [files, setFiles] = useState<{ [key: string]: File }>({});
  const [newFileName, setNewFileName] = useState("");
  const [editorValue, setEditorValue] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const editorRef = useRef<any>(null);
  const vimModeRef = useRef<any>(null);

  const socket = useMemo(
    () => io("http://localhost:4000", { withCredentials: true }),
    []
  );

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


  const compileAndRunCode = async () => {
    const code = editorValue;
    try {
      const result = eval(code);
      console.log(result);
      setOutput(result);
    }
    catch (error) {
      console.log(error);
    }
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFileName(e.target.value);
  };

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
  };

  const handleFileChange = (name: string) => {
    if (files[name]) {
      setFileName(name);
      setEditorValue(files[name].value);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const login = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <LoginPage onLogin={login} />
      ) : (
        <>
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
              <button onClick={compileAndRunCode}>Run</button>
              <pre className="output">{output}</pre>
            </div>
          )}
          <button className="chat-toggle-btn" onClick={toggleChat}>
            {isChatOpen ? 'Close Chat' : 'Open Chat'}
          </button>
          {isChatOpen && <ChatBox onClose={closeChat} socket={socket} />}
        </>
      )}
    </div>
  );
}

export default App;

