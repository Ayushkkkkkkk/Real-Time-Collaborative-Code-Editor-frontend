import React from 'react';
import './CodeInterface.css';

interface File {
  name: string;
  language: string;
  value: string;
}

interface CodeInterfaceProps {
  files: { [key: string]: File };
  currentFileName: string;
  setFileName: (fileName: string) => void;
}

const CodeInterface: React.FC<CodeInterfaceProps> = ({ files, currentFileName, setFileName }) => {
  return (
    <div className="code-interface">
      {Object.keys(files).map(fileName => (
        <button
          key={fileName}
          className={`tab ${currentFileName === fileName ? "active" : ""}`}
          onClick={() => setFileName(fileName)}
        >
          {files[fileName].name}
        </button>
      ))}
    </div>
  );
};

export default CodeInterface;

