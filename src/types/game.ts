// Game types and interfaces
export interface Position {
    x: number;
    y: number;
}

export interface Velocity {
    x: number;
    y: number;
}

export interface Car {
    position: Position;
    speed: number;
    maxSpeed: number;
    acceleration: number;
    deceleration: number;
    brakeForce: number;
    steerDirection: number; // -1 left, 0 center, 1 right
    sprite: HTMLImageElement | null;
}

export interface RoadSegment {
    curve: number;
    y: number;
    worldY: number;
}

export interface LandscapeObject {
    type: 'mountain' | 'tree' | 'house' | 'bush' | 'grass' | 'sea';
    x: number;
    y: number;
    z: number;
    sprite: HTMLImageElement | null;
    scale: number;
}

export interface GameState {
    car: Car;
    road: RoadSegment[];
    landscape: LandscapeObject[];
    camera: {
        x: number;
        y: number;
        z: number;
    };
    speed: number;
    distance: number;
    score: number;
    isPlaying: boolean;
    isPaused: boolean;
}

export interface Controls {
    left: boolean;
    right: boolean;
    brake: boolean;
}

export interface AudioState {
    musicEnabled: boolean;
    soundEnabled: boolean;
    musicVolume: number;
    soundVolume: number;
}
