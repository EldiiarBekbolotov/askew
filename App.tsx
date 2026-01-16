import React from 'react';
import { GameScene } from './components/GameScene';
import { UI } from './components/UI';

const App: React.FC = () => {
    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <GameScene />
            <UI />

            {/* Decorative Overlay for CRT effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" style={{ backgroundSize: "100% 2px, 3px 100%" }}></div>
        </div>
    );
};

export default App;
