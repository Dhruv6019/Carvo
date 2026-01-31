import React, { useState } from 'react';
import { CarCanvas } from '../components/ThreeD/CarCanvas';
import { CarState } from '../types/ThreeDTypes';
import GestureInstructions from '../components/GestureInstructions';

const ThreeDView: React.FC = () => {
    const [carState, setCarState] = useState<CarState>({
        isRotating: true,
        doorsOpen: false,
        color: '#3b82f6',
        zoom: 8,
    });

    const [isCameraActive, setIsCameraActive] = useState(false);
    const [lastAction, setLastAction] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    return (
        <div className="relative w-full h-screen bg-slate-950 font-sans text-gray-100 overflow-hidden">
            {/* 3D Scene Wrapper */}
            <div className="absolute inset-0 z-0">
                <CarCanvas
                    carState={carState}
                    setCarState={setCarState}
                    isCameraActive={isCameraActive}
                    onCameraToggle={setIsCameraActive}
                    lastAction={lastAction}
                    setLastAction={setLastAction}
                    onError={setErrorMsg}
                />
            </div>

            {/* Header UI */}
            <div className="absolute top-10 left-10 z-10 pointer-events-none">
                <h1 className="text-4xl font-black tracking-tighter text-white mb-2 shadow-sm drop-shadow-md">
                    GESTURE<span className="text-blue-500">DRIVE</span>
                </h1>
                <p className="text-gray-300 font-medium">Standalone View</p>
            </div>

            {/* Action Notification */}
            {lastAction && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce font-bold">
                    {lastAction.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </div>
            )}

            {/* Camera Controls Overlay */}
            <div className="absolute top-20 right-10 z-10 flex flex-col items-end space-y-4">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 backdrop-blur-md">
                    <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider">Camera Control</p>

                    {errorMsg && (
                        <p className="text-red-400 text-xs mb-2">{errorMsg}</p>
                    )}

                    <button
                        onClick={() => setIsCameraActive(!isCameraActive)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg ${isCameraActive
                                ? 'bg-red-500/80 hover:bg-red-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {isCameraActive ? 'Stop Camera' : 'Enable Gestures'}
                    </button>

                    {isCameraActive && (
                        <div className="mt-2 text-[10px] text-green-400 font-mono text-center animate-pulse">
                            ● LIVE TRACKING
                        </div>
                    )}
                </div>
            </div>

            {/* Instructions */}
            <GestureInstructions />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-bold uppercase tracking-widest pointer-events-none text-center">
                Powered by Google Gemini 2.5 Vision
            </div>
        </div>
    );
};

export default ThreeDView;
