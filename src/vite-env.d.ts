/// <reference types="vite/client" />

// Add Screen Orientation API definitions
interface ScreenOrientation {
    angle: number;
    type: string;
    onchange: ((this: ScreenOrientation, ev: Event) => any) | null;
    lock(orientation: string): Promise<void>;
    unlock(): void;
}

interface Screen {
    orientation: ScreenOrientation;
}

// Add WebKit Audio Context definitions
interface Window {
    webkitAudioContext: typeof AudioContext;
}
