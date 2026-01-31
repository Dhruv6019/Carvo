import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows, useAnimations } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

const Model = ({ shouldAnimate = true, isHiding = false }: { shouldAnimate?: boolean; isHiding?: boolean }) => {
    const { scene, animations } = useGLTF("/models/toy_robot_animated_-_lowpoly/scene.gltf");
    const { actions } = useAnimations(animations, scene);
    const headRef = useRef<THREE.Object3D | null>(null);
    const eyesRef = useRef<THREE.Object3D[]>([]);

    // Play animation
    useEffect(() => {
        const action = actions[Object.keys(actions)[0] || "Take 001"];
        if (action && shouldAnimate) {
            action.play();
        } else if (action && !shouldAnimate) {
            action.stop();
        }
    }, [actions, shouldAnimate]);

    // Find the head and eye nodes
    useMemo(() => {
        const foundEyes: THREE.Object3D[] = [];
        scene.traverse((obj) => {
            const name = obj.name;
            // Target Cylinder.002_2 for the head
            if (name === "Cylinder.002_2" || name === "Cylinder002_2" || name === "Cylinder.002") {
                headRef.current = obj;
            }
            // Identify eyes (based on typical naming or hierarchy in this model)
            if (name.includes("Object_11") || name.includes("Object_12")) {
                foundEyes.push(obj);
            }
            // Remove/Hide antenna nodes
            if (name.includes("BezierCurve_3") || name.includes("BezierCurve003")) {
                obj.visible = false;
            }
        });
        eyesRef.current = foundEyes;

        // Fallback for head: If still not found, look for something that looks like a head
        if (!headRef.current) {
            let highestY = -Infinity;
            scene.traverse((obj) => {
                if (obj instanceof THREE.Mesh) {
                    const worldPos = new THREE.Vector3();
                    obj.getWorldPosition(worldPos);
                    // Ignore antenna nodes in fallback search
                    if (worldPos.y > highestY && !obj.name.includes("Bezier")) {
                        highestY = worldPos.y;
                        headRef.current = obj.parent || obj;
                    }
                }
            });
        }
    }, [scene]);

    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mousePos.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mousePos.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useFrame((state) => {
        const { x, y } = mousePos.current;

        // Determine target rotations
        let targetRotationY = x * 0.5;
        let targetRotationX = -y * 0.3;

        // Blinking logic defaults
        const blinkFreq = 3;
        const blinkDuration = 0.15;
        const time = state.clock.getElapsedTime();
        const blinkCycle = time % blinkFreq;
        let eyeScaleY = 1;

        if (isHiding) {
            // "Hide" reaction: Look down/away and close eyes
            targetRotationY = 0.8; // Look far right
            targetRotationX = 0.4; // Look down
            eyeScaleY = 0.05;      // Close eyes almost completely
        } else {
            // Normal blinking
            if (blinkCycle < blinkDuration) {
                eyeScaleY = Math.abs(Math.sin((blinkCycle / blinkDuration) * Math.PI)) * 0.1;
            }
        }

        // 1. Rotate the head
        if (headRef.current) {
            headRef.current.rotation.y = THREE.MathUtils.lerp(
                headRef.current.rotation.y,
                targetRotationY,
                isHiding ? 0.05 : 0.2 // Slower transition for hiding
            );
            headRef.current.rotation.x = THREE.MathUtils.lerp(
                headRef.current.rotation.x,
                targetRotationX,
                isHiding ? 0.05 : 0.2
            );
        }

        // 2. Apply eye scaling
        eyesRef.current.forEach(eye => {
            eye.scale.y = THREE.MathUtils.lerp(eye.scale.y, eyeScaleY, 0.1);
        });
    });

    return (
        <group>
            <primitive object={scene} scale={0.7} position={[0, -0.5, 0]} rotation={[0, 0, 0]} />
        </group>
    );
};

export const ToyRobotViewer = ({ shouldAnimate = true, isHiding = false }: { shouldAnimate?: boolean; isHiding?: boolean }) => {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas camera={{ position: [2, 1, 8], fov: 40 }} shadows>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.7} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />
                    <Model shouldAnimate={shouldAnimate} isHiding={isHiding} />
                    <Environment preset="city" />
                    <ContactShadows
                        position={[0, -0.5, 0]}
                        opacity={0.4}
                        scale={5}
                        blur={2}
                        far={4.5}
                    />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 2}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};

useGLTF.preload("/models/toy_robot_animated_-_lowpoly/scene.gltf");
