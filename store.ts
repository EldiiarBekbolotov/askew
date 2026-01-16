import { create } from 'zustand';
import { GameState } from './types';

interface GameStore {
    gameState: GameState;
    score: number;
    highScore: number;
    setGameState: (state: GameState) => void;
    setScore: (score: number) => void;
    incrementScore: (amount: number) => void;
    resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
    gameState: GameState.MENU,
    score: 0,
    highScore: parseInt(localStorage.getItem('slope-highscore') || '0', 10),
    setGameState: (state) => set({ gameState: state }),
    setScore: (score) => set((state) => {
        const newHighScore = Math.max(state.highScore, score);
        if (newHighScore > state.highScore) {
            localStorage.setItem('slope-highscore', newHighScore.toString());
        }
        return { score, highScore: newHighScore };
    }),
    incrementScore: (amount) => set((state) => {
        const newScore = state.score + amount;
        const newHighScore = Math.max(state.highScore, newScore);
        if (newHighScore > state.highScore) {
            localStorage.setItem('slope-highscore', newHighScore.toString());
        }
        return { score: newScore, highScore: newHighScore };
    }),
    resetGame: () => set({ score: 0 }),
}));
