import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const TerminalComponent: React.FC = () => {
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (terminalRef.current) {
            const term = new Terminal();
            term.open(terminalRef.current);
        }
    }, []);

    return <div ref={terminalRef} style={{ height: '400px', width: '100%' }} />;
};

export default TerminalComponent;

