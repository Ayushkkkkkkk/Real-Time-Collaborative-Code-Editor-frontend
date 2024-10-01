import React from 'react';
import "./outputFloat.css";
interface OutputFloatProps {
    output: string;
    onClose: () => void;
}

const OutputFloat: React.FC<OutputFloatProps> = ({ output, onClose }) => {
    return (
        <div className="output-float">
            <div className="output-content">
                <button className="close-button" onClick={onClose}>×</button>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default OutputFloat;

