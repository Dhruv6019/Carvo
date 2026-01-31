import { useGLTF, PresentationControls, useAnimations, Text, Environment, Center, ContactShadows, SpotLight, Float, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";

function Model({ path, modelType, color, ...props }: { path: string, modelType?: string, color?: string, [key: string]: any }) {
    const { scene: originalScene, animations } = useGLTF(path);
    const scene = useMemo(() => originalScene.clone(), [originalScene]);
    const { actions } = useAnimations(animations, scene);

    useFrame((state, delta) => {
        if (modelType === 'mclaren') {
            scene.rotation.y += delta * 0.02;
        }
    });

    useEffect(() => {
        if (color) {
            scene.traverse((child: any) => {
                if (child.isMesh) {
                    // Heuristic to find body parts. 
                    // Adjust based on actual model node names if needed.
                    const name = child.name.toLowerCase();
                    const matName = child.material?.name?.toLowerCase() || "";

                    if (name.includes("body") || name.includes("paint") || matName.includes("body") || matName.includes("paint") || matName.includes("car")) {
                        // Clone material to avoid affecting other shared meshes if necessary
                        child.material = child.material.clone();
                        child.material.color.set(color);
                    }
                }
            });
        }
    }, [color, scene]);

    useEffect(() => {
        if (animations.length > 0 && actions) {
            const firstAction = Object.keys(actions)[0];
            if (firstAction) {
                actions[firstAction]?.reset().fadeIn(0.5).play();
            }
        }
    }, [actions, animations]);

    return <primitive object={scene} {...props} />;
}

const FloatingText = ({ modelType }: { modelType: 'bmw' | 'porsche' | 'mclaren' }) => {
    const textRef = useRef<any>(null);

    useFrame((state) => {
        if (textRef.current) {
            // Slow floating animation (Sine wave)
            textRef.current.position.y = 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
            // Catch slight rotation for 3D feel
            textRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
        }
    });

    return (
        <Text
            ref={textRef}
            position={[0, 2, -5]}
            fontSize={3.7}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            fillOpacity={1}
            // @ts-ignore
            curveRadius={12}
        >
            {modelType === 'porsche'
                ? 'PORSCHE'
                : modelType === 'mclaren'
                    ? 'MCLAREN'
                    : 'BMW'}
        </Text>
    );
};






const IntroHandler = ({ groupRef, lightRef }: { groupRef: any, lightRef: any }) => {
    const { camera, scene } = useThree();
    const [startTransition, setStartTransition] = useState(false);

    useEffect(() => {
        // Start very dark ('night')
        scene.environmentIntensity = 0.05; // Even darker
        if (lightRef.current) lightRef.current.intensity = 0; // Turn off main light

        // Wait 2.5 seconds before starting the transition
        const t = setTimeout(() => setStartTransition(true), 2500);
        return () => clearTimeout(t);
    }, [scene, lightRef]);

    useFrame((state, delta) => {
        if (startTransition) {
            // Smoothly move camera to final position [0, 0, 10]
            const targetPos = new THREE.Vector3(0, 0, 10);
            state.camera.position.lerp(targetPos, delta * 0.2); // Very slow zoom

            // Smoothly brighten environment ('night' to 'sunset')
            scene.environmentIntensity = THREE.MathUtils.lerp(scene.environmentIntensity, 1, delta * 0.2); // Very slow fade

            // Brighten main light
            if (lightRef.current) {
                lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 1.5, delta * 0.2);
            }

            if (groupRef.current) {
                groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, delta * 0.2);
            }
        }
    });
    return null;
};


const RotationGuide = ({ onChange }: { onChange: (val: number) => void }) => {
    const [value, setValue] = useState(180); // 0-360 range, start at middle
    const isDragging = useRef(false);

    const handleMove = (clientX: number) => {
        const sliderWidth = 300; // Visual width approximation or measure ref
        // Let's use window/container logic or just a simple range input.
    };

    // Simple range input implementation styled to match the visual
    // We'll calculate the knob position based on the value to overlay the custom icon.
    // Quadratic Bezier: P = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    // P0(10,40), P1(300,90), P2(590,40)
    // t = value / 360

    const t = value / 360;
    const invT = 1 - t;
    const x = (invT * invT * 10) + (2 * invT * t * 300) + (t * t * 590);
    const y = (invT * invT * 40) + (2 * invT * t * 90) + (t * t * 40);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setValue(val);
        onChange(val);
    };

    return (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-[300px] md:w-[600px] h-[100px] z-20 flex items-center justify-center">
            {/* The Visual SVG */}
            <svg width="100%" height="100%" viewBox="0 0 600 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 pointer-events-none">
                <path d="M10 40 Q 300 90 590 40" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-50" />

                {/* Dynamic Knob */}
                <g style={{ transform: `translate(${x}px, ${y}px)` }} className="transition-transform duration-75 ease-out">
                    <circle cx="0" cy="0" r="20" fill="black" fillOpacity="0.8" stroke="white" strokeWidth="1.5" />
                    {/* The rotate icon logic from before, centered at 0,0 */}
                    <path d="M0 -10 C5.5 -10 10 -5.5 10 0 C10 5.5 5.5 10 0 10 C-4 10 -7.5 7.5 -9 4" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" transform="rotate(-90)" />
                    <path d="M-9 0 L-9 4 L-5 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-90)" />
                </g>
            </svg>

            {/* Invisible Range Input for Interaction */}
            <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={value}
                onChange={handleChange}
                className="w-full h-full opacity-0 cursor-ew-resize absolute top-0 left-0 z-30 pointer-events-auto"
                style={{ clipPath: "polygon(0% 20%, 100% 20%, 100% 100%, 0% 100%)" }}
            />
        </div>
    );
};

export const ThreeDCar = ({ modelType = 'bmw', color, controls = true }: { modelType?: 'bmw' | 'porsche' | 'mclaren', color?: string, controls?: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.DirectionalLight>(null);
    const [rotation, setRotation] = useState(0);
    const [isInView, setIsInView] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Simple Viewport Detection to completely stop Three.js when not visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    let modelPath = "/models/bmw_m4_widebody__www.vecarz.com/scene.gltf";
    let modelScale = 0.40;

    if (modelType === 'porsche') {
        modelPath = "/models/porsche_panamera/scene.gltf";
        modelScale = 2;
    } else if (modelType === 'mclaren') {
        modelPath = "/models/2017_mclaren_720s/scene.gltf";
        modelScale = 3.25;
    }

    if (!isInView) return <div ref={containerRef} className="w-full h-full" />;

    return (
        <div ref={containerRef} className="w-full h-full absolute inset-0 z-0 bg-transparent">
            <Canvas
                dpr={[1, 1.5]} // Capped at 1.5 for performance vs quality balance
                shadows={false} // Disable expensive real-time shadows, use ContactShadows only
                camera={{ fov: 45, position: [0, 0.3, 6] }}
                gl={{
                    alpha: true,
                    antialias: false, // Disable MSAA (big performance boost)
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true
                }}
                performance={{ min: 0.5 }} // Allow downscaling if laggy
            >
                <AdaptiveDpr pixelated />
                <AdaptiveEvents />
                {controls && <IntroHandler groupRef={groupRef} lightRef={lightRef} />}
                {/* <color attach="background" args={["#000000"]} /> Removed for transparent bg */}

                <Suspense fallback={null}>
                    {/* Environment - Studio for sharp, premium reflections */}
                    <Environment
                        preset={modelType === 'mclaren' ? "city" : "studio"}
                        environmentIntensity={modelType === 'mclaren' ? 0.2 : modelType === 'porsche' ? 0.15 : 0.8}
                        blur={0.5}
                    />

                    {/* Specific Volumetric Light for McLaren */}


                    <directionalLight
                        ref={lightRef}
                        position={[5, 10, 5]}
                        intensity={modelType === 'mclaren' ? 0.4 : modelType === 'porsche' ? 0.2 : 1.5}
                        castShadow
                        shadow-bias={-0.001}
                    />

                    {controls ? (
                        <PresentationControls
                            speed={1.2}
                            global
                            zoom={0.8}
                            polar={[0, Math.PI / 4]}
                            rotation={[0.1, Math.PI / 4, 0]}
                        >
                            <group ref={groupRef} rotation={[-0.1, THREE.MathUtils.degToRad(rotation), 0]}>
                                <Float
                                    speed={1.5}
                                    rotationIntensity={0.1}
                                    floatIntensity={0.3}
                                    floatingRange={[-0.05, 0.05]}
                                >
                                    <Center position={[0, 0, 0]}>
                                        <Model path={modelPath} scale={modelScale} modelType={modelType} color={color} />
                                    </Center>
                                </Float>
                            </group>
                        </PresentationControls>
                    ) : (
                        <group rotation={[0, Math.PI / 4, 0]}>
                            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
                                <Center position={[0, 0, 0]}>
                                    <Model path={modelPath} scale={modelScale} modelType={modelType} color={color} />
                                </Center>
                            </Float>
                        </group>
                    )}

                    <ContactShadows
                        position={[0, -0.6, 0]}
                        opacity={0.4}
                        scale={8}
                        blur={2}
                        far={1}
                        resolution={256} // Lower resolution for performance
                    />
                </Suspense>

                <ambientLight intensity={0.01} /> {/* Baseline ambient */}


                {/* Background Text (Animated) */}
                {controls && <FloatingText modelType={modelType} />}
            </Canvas>

            {/* Rotation Guide Visual */}
            {controls && <RotationGuide onChange={(val) => setRotation(val - 180)} />}

            {/* Loading Overlay (fades out when model loads, simplified logic) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* We could add a loader state here later */}
            </div>
        </div>
    );
};

// Preload the models to avoid pop-in
useGLTF.preload("/models/bmw_m4_widebody__www.vecarz.com/scene.gltf");
useGLTF.preload("/models/porsche_panamera/scene.gltf");
useGLTF.preload("/models/2017_mclaren_720s/scene.gltf");
