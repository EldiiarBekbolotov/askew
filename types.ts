export enum GameState {
    MENU = 'MENU',
    PLAYING = 'PLAYING',
    GAME_OVER = 'GAME_OVER',
    LEADERBOARD = 'LEADERBOARD',
    SHOP = 'SHOP',
    OPTIONS = 'OPTIONS',
    INFO = 'INFO'
}

export enum Difficulty {
    EASY = 'EASY',
    NORMAL = 'NORMAL',
    HARD = 'HARD'
}

export interface Position {
    x: number;
    y: number;
    z: number;
}

export enum SegmentType {
    NORMAL = 'NORMAL',
    STEEP = 'STEEP',
    NARROW = 'NARROW',
    BANKED = 'BANKED',
    TURN = 'TURN'
}

export interface SegmentData {
    id: string;
    position: [number, number, number];
    length: number;
    width: number;
    slope: number;
    bank: number;
    yaw: number;
    type: SegmentType;
    obstacles: ObstacleData[];
    coin?: CoinData;
    heart?: HeartData;
    platformIndex: number;
}

export interface ObstacleData {
    id: string;
    position: [number, number, number];
    size: [number, number, number];
    type: 'static' | 'moving';
    movingDirection?: [number, number, number];
    movingSpeed?: number;
    movingRange?: number;
}

export interface CoinData {
    id: string;
    position: [number, number, number];
    collected: boolean;
}

export interface HeartData {
    id: string;
    position: [number, number, number];
    collected: boolean;
}

export interface BallSkin {
    id: string;
    name: string;
    color: string;
    emissiveColor: string;
    wireframeColor: string;
    coreColor: string;
    price: number;
    owned: boolean;
}

export interface BackgroundSkin {
    id: string;
    name: string;
    backgroundColor: string;
    fogColor: string;
    starsColor: string;
    outlineColor: string;
    price: number;
    owned: boolean;
}

export interface LeaderboardEntry {
    rank: number;
    score: number;
    date: string;
}

export interface InputBindings {
    left: string[];
    right: string[];
    jump: string[];
}

export interface GameOptions {
    difficulty: Difficulty;
    ballSkinId: string;
    backgroundSkinId: string;
    musicVolume: number;
    sfxVolume: number;
    inputBindings: InputBindings;
}

export enum GamePattern {
    FLAT_WITH_OBSTACLES = 'FLAT_WITH_OBSTACLES',
    NON_FLAT_NO_OBSTACLES = 'NON_FLAT_NO_OBSTACLES'
}

export const DEFAULT_BALL_SKINS: BallSkin[] = [
    {
        id: 'default',
        name: 'Neon Green',
        color: '#050505',
        emissiveColor: '#00ff88',
        wireframeColor: '#00ff88',
        coreColor: '#ffffff',
        price: 0,
        owned: true
    },
    {
        id: 'blue',
        name: 'Electric Blue',
        color: '#050510',
        emissiveColor: '#0088ff',
        wireframeColor: '#0088ff',
        coreColor: '#aaddff',
        price: 100,
        owned: false
    },
    {
        id: 'red',
        name: 'Fire Red',
        color: '#100505',
        emissiveColor: '#ff4400',
        wireframeColor: '#ff4400',
        coreColor: '#ffaa88',
        price: 100,
        owned: false
    },
    {
        id: 'purple',
        name: 'Cosmic Purple',
        color: '#0a0510',
        emissiveColor: '#aa00ff',
        wireframeColor: '#aa00ff',
        coreColor: '#ddaaff',
        price: 150,
        owned: false
    },
    {
        id: 'gold',
        name: 'Golden',
        color: '#151005',
        emissiveColor: '#ffaa00',
        wireframeColor: '#ffaa00',
        coreColor: '#ffeeaa',
        price: 200,
        owned: false
    },
    {
        id: 'rainbow',
        name: 'Rainbow',
        color: '#101010',
        emissiveColor: '#ff00ff',
        wireframeColor: '#00ffff',
        coreColor: '#ffffff',
        price: 500,
        owned: false
    }
];

export const DEFAULT_BACKGROUND_SKINS: BackgroundSkin[] = [
    {
        id: 'default',
        name: 'Deep Space',
        backgroundColor: '#020202',
        fogColor: '#020202',
        starsColor: '#ffffff',
        outlineColor: '#00ffff',
        price: 0,
        owned: true
    },
    {
        id: 'sunset',
        name: 'Sunset',
        backgroundColor: '#1a0a0a',
        fogColor: '#1a0a0a',
        starsColor: '#ffaa88',
        outlineColor: '#ff6644',
        price: 150,
        owned: false
    },
    {
        id: 'ocean',
        name: 'Ocean Depths',
        backgroundColor: '#020a15',
        fogColor: '#020a15',
        starsColor: '#88ddff',
        outlineColor: '#00aaff',
        price: 150,
        owned: false
    },
    {
        id: 'forest',
        name: 'Neon Forest',
        backgroundColor: '#020a02',
        fogColor: '#020a02',
        starsColor: '#88ff88',
        outlineColor: '#00ff44',
        price: 150,
        owned: false
    },
    {
        id: 'void',
        name: 'The Void',
        backgroundColor: '#000000',
        fogColor: '#000000',
        starsColor: '#444444',
        outlineColor: '#222222',
        price: 200,
        owned: false
    },
    {
        id: 'synthwave',
        name: 'Synthwave',
        backgroundColor: '#0a0015',
        fogColor: '#0a0015',
        starsColor: '#ff88ff',
        outlineColor: '#ff00aa',
        price: 300,
        owned: false
    }
];

export const DEFAULT_INPUT_BINDINGS: InputBindings = {
    left: ['KeyA', 'ArrowLeft'],
    right: ['KeyD', 'ArrowRight'],
    jump: ['Space']
};

export const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
    [Difficulty.EASY]: 0.8,
    [Difficulty.NORMAL]: 1.0,
    [Difficulty.HARD]: 1.15
};
