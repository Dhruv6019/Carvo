import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { GoogleGenAI, Type, FunctionDeclaration, LiveServerMessage, Modality } from '@google/genai';
import Car from '../Car';
import { CarState } from '../../types/ThreeDTypes';

const FRAME_RATE = 3;
const JPEG_QUALITY = 0.7;

const CONTROL_CAR_FUNCTION: FunctionDeclaration = {
    name: 'controlCar',
    parameters: {
        type: Type.OBJECT,
        description: 'Control aspects of the 3D car model based on detected hand gestures.',
        properties: {
            action: {
                type: Type.STRING,
                enum: ['zoomIn', 'zoomOut', 'toggleDoors', 'changeColor', 'toggleRotation'],
                description: 'The action to perform on the car model.',
            },
        },
        required: ['action'],
    },
};

interface CarCanvasProps {
    carState: CarState;
    setCarState: React.Dispatch<React.SetStateAction<CarState>>;
    isCameraActive: boolean;
    onCameraToggle: (active: boolean) => void;
    lastAction: string | null;
    setLastAction: (action: string | null) => void;
    onError?: (msg: string) => void;
}

export const CarCanvas: React.FC<CarCanvasProps> = ({
    carState,
    setCarState,
    isCameraActive,
    onCameraToggle,
    setLastAction,
    onError
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sessionRef = useRef<any>(null);
    const timerRef = useRef<number | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const handleAction = (action: string) => {
        setLastAction(action);
        setCarState((prev) => {
            switch (action) {
                case 'zoomIn':
                    return { ...prev, zoom: Math.max(prev.zoom - 1, 3) };
                case 'zoomOut':
                    return { ...prev, zoom: Math.min(prev.zoom + 1, 15) };
                case 'toggleDoors':
                    return { ...prev, doorsOpen: !prev.doorsOpen };
                case 'changeColor':
                    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#111827'];
                    const nextColor = colors[Math.floor(Math.random() * colors.length)];
                    return { ...prev, color: nextColor };
                case 'toggleRotation':
                    return { ...prev, isRotating: !prev.isRotating };
                default:
                    return prev;
            }
        });
        setTimeout(() => setLastAction(null), 2000);
    };

    const stopCamera = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (sessionRef.current) {
            try {
                sessionRef.current.close();
            } catch (e) { }
        }
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
            videoRef.current.srcObject = null;
        }
        setIsConnecting(false);
        onCameraToggle(false);
    };

    const startCamera = async () => {
        setIsConnecting(true);
        if (onError) onError("");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await new Promise((resolve) => {
                    if (videoRef.current) {
                        videoRef.current.onloadedmetadata = () => resolve(true);
                    }
                });
            }

            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) throw new Error("Gemini API Key is missing.");

            const ai = new GoogleGenAI({ apiKey });
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setIsConnecting(false);
                        onCameraToggle(true);

                        timerRef.current = window.setInterval(async () => {
                            if (videoRef.current && canvasRef.current) {
                                const ctx = canvasRef.current.getContext('2d');
                                if (ctx && videoRef.current.videoWidth > 0) {
                                    canvasRef.current.width = videoRef.current.videoWidth;
                                    canvasRef.current.height = videoRef.current.videoHeight;
                                    ctx.drawImage(videoRef.current, 0, 0);
                                    const dataUrl = canvasRef.current.toDataURL('image/jpeg', JPEG_QUALITY);
                                    const base64Data = dataUrl.split(',')[1];

                                    sessionPromise.then(session => {
                                        session.sendRealtimeInput({
                                            media: { data: base64Data, mimeType: 'image/jpeg' }
                                        });
                                    });
                                }
                            }
                        }, 1000 / FRAME_RATE);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.toolCall) {
                            for (const fc of message.toolCall.functionCalls) {
                                if (fc.name === 'controlCar') {
                                    const { action } = fc.args as { action: string };
                                    handleAction(action);
                                    sessionPromise.then(session => {
                                        session.sendToolResponse({
                                            functionResponses: [{
                                                id: fc.id,
                                                name: fc.name,
                                                response: { status: 'success', action },
                                            }]
                                        });
                                    });
                                }
                            }
                        }
                    },
                    onerror: (e) => {
                        console.error('Gemini error:', e);
                        if (onError) onError('AI connection failed.');
                        stopCamera();
                    },
                    onclose: () => stopCamera()
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    tools: [{ functionDeclarations: [CONTROL_CAR_FUNCTION] }],
                    systemInstruction: `
                        Analyze gestures and CALL controlCar:
                        1. Thumbs Up (👍) -> 'zoomIn'
                        2. Thumbs Down (👎) -> 'zoomOut'
                        3. Open Palm (✋) -> 'toggleDoors'
                        4. Fist (✊) -> 'changeColor'
                        5. Peace Sign (✌️) -> 'toggleRotation'
                    `,
                }
            });

            sessionRef.current = await sessionPromise;
        } catch (err: any) {
            console.error('Failed to start camera:', err);
            setIsConnecting(false);
            if (onError) onError(err.message || 'Camera access error');
            onCameraToggle(false);
        }
    };

    // Expose camera control via effect if needed, but for now we rely on internal button or external prop trigger?
    // Actually, usually buttons in the UI trigger `startCamera`.
    // Let's expose the video element and logic or just put the camera UI *inside* this component?
    // For reusability, maybe the camera PREVIEW should be hidden or small?
    // In ThreeDView, it was on the side. 

    // Let's pass a ref or expose functions? 
    // Or simpler: put the hidden video element here, and the startup logic is triggered by a prop change?
    // Triggering via prop `isCameraActive` might vary processing state.

    useEffect(() => {
        if (isCameraActive && !videoRef.current?.srcObject && !isConnecting) {
            startCamera();
        } else if (!isCameraActive && videoRef.current?.srcObject) {
            stopCamera();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCameraActive]);

    return (
        <div className="relative w-full h-full">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 2, carState.zoom]} fov={50} />
                <OrbitControls
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2.1}
                    minDistance={3}
                    maxDistance={20}
                />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Car state={carState} />

                <ContactShadows
                    position={[0, 0, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2}
                    far={1}
                />
                <Environment preset="city" />
            </Canvas>

            {/* Hidden Video Elements for AI Processing */}
            <div className="hidden">
                <video ref={videoRef} autoPlay playsInline muted />
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};
