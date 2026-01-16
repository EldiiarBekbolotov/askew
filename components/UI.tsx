import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store';
import { GameState } from '../types';
import { generateGameCommentary } from '../services/geminiService';

export const UI: React.FC = () => {
    const { gameState, setGameState, score, highScore, resetGame } = useGameStore();
    const [commentary, setCommentary] = useState<string>("");
    const [loadingCommentary, setLoadingCommentary] = useState(false);

    useEffect(() => {
        if (gameState === GameState.GAME_OVER) {
            setLoadingCommentary(true);
            generateGameCommentary(score, highScore).then(text => {
                setCommentary(text);
                setLoadingCommentary(false);
            });
        } else {
            setCommentary("");
        }
    }, [gameState, score, highScore]);

    const handleStart = () => {
        resetGame();
        setGameState(GameState.PLAYING);
    };

    if (gameState === GameState.PLAYING) {
        return (
            <div className="absolute top-0 left-0 w-full p-8 pointer-events-none flex justify-between items-start z-10">
                <div className="text-white">
                    <h2 className="text-4xl font-bold tracking-wider text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">
                        {score}
                    </h2>
                    <p className="text-sm text-gray-400">DISTANCE</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 text-sm">HIGH SCORE</p>
                    <p className="text-xl text-white font-bold">{highScore}</p>
                </div>
            </div>
        );
    }

    if (gameState === GameState.MENU) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 backdrop-blur-sm">
                <div className="text-center space-y-8 p-12 border border-green-500/30 rounded-2xl bg-black/50 shadow-[0_0_50px_rgba(0,255,100,0.1)]">
                    <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 italic tracking-tighter drop-shadow-sm">
                        NEON SLOPE
                    </h1>
                    <div className="space-y-2">
                        <p className="text-gray-400 text-lg">Avoid the red blocks. Don't fall off.</p>
                        <p className="text-sm text-gray-600">Controls: A/D or Left/Right Arrows</p>
                    </div>
                    <button
                        onClick={handleStart}
                        className="px-12 py-4 bg-green-500 hover:bg-green-400 text-black font-bold text-xl rounded-full transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(74,222,128,0.6)]"
                    >
                        START RUN
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === GameState.GAME_OVER) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-red-900/40 z-20 backdrop-blur-md">
                <div className="text-center max-w-lg w-full p-8 border border-red-500/50 rounded-xl bg-black/80">
                    <h2 className="text-5xl font-bold text-red-500 mb-2">CRASHED</h2>
                    <p className="text-xl text-white mb-6">DISTANCE: {score}</p>

                    <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-700 min-h-[80px] flex items-center justify-center">
                        {loadingCommentary ? (
                            <span className="animate-pulse text-gray-500">Analysing run data...</span>
                        ) : (
                            <p className="text-green-300 italic text-lg">"{commentary}"</p>
                        )}
                    </div>

                    <button
                        onClick={handleStart}
                        className="px-10 py-3 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-200 transition-colors shadow-lg"
                    >
                        RETRY
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
