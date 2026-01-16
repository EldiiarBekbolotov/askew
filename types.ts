export enum GameState {
    MENU = 'MENU',
    PLAYING = 'PLAYING',
    GAME_OVER = 'GAME_OVER'
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
    slope: number; // Angle in radians (X axis)
    bank: number;  // Angle in radians (Z axis)
    yaw: number;   // Angle in radians (Y axis)
    type: SegmentType;
    obstacles: ObstacleData[];
}

export interface ObstacleData {
    id: string;
    position: [number, number, number]; // Relative to segment center
    size: [number, number, number];
    type: 'static' | 'moving';
}