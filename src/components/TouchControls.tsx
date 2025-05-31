import React, { useEffect, useRef } from 'react';

interface TouchControlsProps {
    onSteerLeft: (pressed: boolean) => void;
    onSteerRight: (pressed: boolean) => void;
    onBrake: (pressed: boolean) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
    onSteerLeft,
    onSteerRight,
    onBrake
}) => {
    const leftButtonRef = useRef<HTMLButtonElement>(null);
    const rightButtonRef = useRef<HTMLButtonElement>(null);
    const brakeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleTouchStart = (element: HTMLElement, callback: (pressed: boolean) => void) => {
            const handler = (e: TouchEvent) => {
                e.preventDefault();
                callback(true);
            };
            element.addEventListener('touchstart', handler, { passive: false });
            return () => element.removeEventListener('touchstart', handler);
        };

        const handleTouchEnd = (element: HTMLElement, callback: (pressed: boolean) => void) => {
            const handler = (e: TouchEvent) => {
                e.preventDefault();
                callback(false);
            };
            element.addEventListener('touchend', handler, { passive: false });
            element.addEventListener('touchcancel', handler, { passive: false });
            return () => {
                element.removeEventListener('touchend', handler);
                element.removeEventListener('touchcancel', handler);
            };
        };

        const cleanupFunctions: (() => void)[] = [];

        if (leftButtonRef.current) {
            cleanupFunctions.push(handleTouchStart(leftButtonRef.current, onSteerLeft));
            cleanupFunctions.push(handleTouchEnd(leftButtonRef.current, onSteerLeft));
        }

        if (rightButtonRef.current) {
            cleanupFunctions.push(handleTouchStart(rightButtonRef.current, onSteerRight));
            cleanupFunctions.push(handleTouchEnd(rightButtonRef.current, onSteerRight));
        }

        if (brakeButtonRef.current) {
            cleanupFunctions.push(handleTouchStart(brakeButtonRef.current, onBrake));
            cleanupFunctions.push(handleTouchEnd(brakeButtonRef.current, onBrake));
        }

        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
        };
    }, [onSteerLeft, onSteerRight, onBrake]);

    // Also handle mouse events for desktop testing
    const handleMouseEvents = (callback: (pressed: boolean) => void) => ({
        onMouseDown: (e: React.MouseEvent) => {
            e.preventDefault();
            callback(true);
        },
        onMouseUp: (e: React.MouseEvent) => {
            e.preventDefault();
            callback(false);
        },
        onMouseLeave: (e: React.MouseEvent) => {
            e.preventDefault();
            callback(false);
        }
    });

    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Left steering button */}            <button
                ref={leftButtonRef}
                className="absolute left-0 top-0 h-full w-1/3 bg-transparent border border-white/10 hover:bg-blue-500/10 active:bg-blue-500/20 rounded-r-lg pointer-events-auto touch-manipulation select-none"
                style={{
                    minHeight: '44px',
                    minWidth: '44px',
                    backgroundColor: 'transparent',
                    backdropFilter: 'blur(1px)'
                }}
                {...handleMouseEvents(onSteerLeft)}
            >
                <div className="flex items-center justify-center h-full">
                    <div className="text-white/40 text-3xl font-bold drop-shadow-lg">←</div>
                </div>
            </button>

            {/* Right steering button */}
            <button
                ref={rightButtonRef}
                className="absolute right-0 top-0 h-full w-1/3 bg-transparent border border-white/10 hover:bg-blue-500/10 active:bg-blue-500/20 rounded-l-lg pointer-events-auto touch-manipulation select-none"
                style={{
                    minHeight: '44px',
                    minWidth: '44px',
                    backgroundColor: 'transparent',
                    backdropFilter: 'blur(1px)'
                }}
                {...handleMouseEvents(onSteerRight)}
            >
                <div className="flex items-center justify-center h-full">
                    <div className="text-white/40 text-3xl font-bold drop-shadow-lg">→</div>
                </div>
            </button>

            {/* Brake button */}
            <button ref={brakeButtonRef}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-transparent border border-white/10 hover:bg-red-500/10 active:bg-red-500/20 rounded-t-lg pointer-events-auto touch-manipulation select-none"
                style={{
                    minHeight: '44px',
                    minWidth: '44px',
                    backgroundColor: 'transparent',
                    backdropFilter: 'blur(1px)'
                }}
                {...handleMouseEvents(onBrake)}
            >
                <div className="flex items-center justify-center h-full">
                    <div className="text-white/40 text-xl font-bold drop-shadow-lg">BRAKE</div>
                </div>

                <div className="flex items-center justify-center h-full">
                    <div className="text-white/40 text-xl font-bold drop-shadow-lg">BRAKE</div>
                </div>
            </button>
        </div>
    );
};
