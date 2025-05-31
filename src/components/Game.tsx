import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { TouchControls } from './TouchControls';

export const Game: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameEngineRef = useRef<GameEngine | null>(null);
    const [isGameStarted, setIsGameStarted] = useState(false);

    useEffect(() => {
        if (canvasRef.current && !gameEngineRef.current) {
            gameEngineRef.current = new GameEngine(canvasRef.current);
        }
    }, []); useEffect(() => {
        // Lock orientation to landscape on mobile
        const lockOrientation = async () => {
            try {
                if ('screen' in window && 'orientation' in window.screen) {
                    // Use proper type casting with extended interface
                    const orientation = window.screen.orientation as { lock(type: string): Promise<void> };
                    if (orientation && orientation.lock) {
                        await orientation.lock('landscape');
                    }
                }
            } catch (_error) {
                // Ignore errors - not all browsers support this
                console.log('Orientation lock not supported');
            }
        };

        lockOrientation();
    }, []); useEffect(() => {
        // Keyboard controls
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isGameStarted) {
                // Allow starting game with Enter key
                if (event.code === 'Enter') {
                    event.preventDefault();
                    startGame();
                    return;
                }
                return;
            }

            if (!gameEngineRef.current) return;

            switch (event.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    event.preventDefault();
                    gameEngineRef.current.setControls({ left: true });
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    event.preventDefault();
                    gameEngineRef.current.setControls({ right: true });
                    break;
                case 'ArrowDown':
                case 'Space':
                case 'KeyS':
                    event.preventDefault();
                    gameEngineRef.current.setControls({ brake: true });
                    break;
                case 'KeyP':
                    event.preventDefault();
                    pauseGame();
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (!gameEngineRef.current || !isGameStarted) return;

            switch (event.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    event.preventDefault();
                    gameEngineRef.current.setControls({ left: false });
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    event.preventDefault();
                    gameEngineRef.current.setControls({ right: false });
                    break;
                case 'ArrowDown':
                case 'Space':
                case 'KeyS':
                    event.preventDefault();
                    gameEngineRef.current.setControls({ brake: false });
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isGameStarted]); const startGame = () => {
        if (gameEngineRef.current) {
            gameEngineRef.current.start();
            setIsGameStarted(true);
            // Focus canvas for keyboard input
            if (canvasRef.current) {
                canvasRef.current.focus();
            }
        }
    };

    const pauseGame = () => {
        if (gameEngineRef.current) {
            gameEngineRef.current.pause();
        }
    };

    const handleSteerLeft = (pressed: boolean) => {
        if (gameEngineRef.current) {
            gameEngineRef.current.setControls({ left: pressed });
        }
    };

    const handleSteerRight = (pressed: boolean) => {
        if (gameEngineRef.current) {
            gameEngineRef.current.setControls({ right: pressed });
        }
    };

    const handleBrake = (pressed: boolean) => {
        if (gameEngineRef.current) {
            gameEngineRef.current.setControls({ brake: pressed });
        }
    };

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">            {/* Game Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full focus:outline-none"
                style={{ touchAction: 'none' }}
                tabIndex={0}
            />{/* Start Screen */}
            {!isGameStarted && (<div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                <div className="text-center text-white max-w-2xl px-4">
                    <h1 className="text-4xl font-bold mb-4 text-pink-500">RACE GAME</h1>
                    <p className="text-lg mb-8">Classic arcade racing experience</p><button
                        onClick={startGame}
                        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-lg text-xl mb-2"
                    >
                        START GAME
                    </button>
                    <p className="text-sm text-gray-400 mb-8">or press Enter</p>

                    {/* Controls Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                        <div>
                            <h3 className="text-white font-semibold mb-2">Touch Controls (Mobile)</h3>
                            <p>• Tap left/right sides to steer</p>
                            <p>• Tap bottom to brake</p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-2">Keyboard Controls (Desktop)</h3>
                            <p>• Arrow Keys or A/D to steer</p>
                            <p>• Space/Down Arrow/S to brake</p>
                            <p>• P to pause</p>
                        </div>
                    </div>

                    <div className="mt-8 text-sm text-gray-400">
                        <p>Rotate your device to landscape mode for the best mobile experience</p>
                    </div>
                </div>
            </div>
            )}

            {/* Touch Controls */}
            {isGameStarted && (
                <TouchControls
                    onSteerLeft={handleSteerLeft}
                    onSteerRight={handleSteerRight}
                    onBrake={handleBrake}
                />
            )}

            {/* Pause Button */}
            {isGameStarted && (
                <button
                    onClick={pauseGame}
                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded z-20"
                >
                    ⏸️
                </button>
            )}

            {/* Orientation Warning */}
            <div className="absolute inset-0 bg-black text-white flex items-center justify-center z-30 portrait:flex landscape:hidden">
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">📱</div>
                    <h2 className="text-2xl font-bold mb-4">Please Rotate Your Device</h2>
                    <p className="text-lg">This game is designed for landscape mode</p>
                </div>
            </div>
        </div>
    );
};
