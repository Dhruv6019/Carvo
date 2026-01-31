import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows, useAnimations } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

const Model = ({ shouldAnimate = true }: { shouldAnimate?: boolean }) => {
    const { scene, animations } = useGLTF("/models/cute_home_robot/scene.gltf");
    const { actions } = useAnimations(animations, scene);
    const headRef = useRef<THREE.Object3D | null>(null);

    // Play animation
    useEffect(() => {
        const action = actions["Take 001"];
        if (action && shouldAnimate) {
            action.play();
        } else if (action && !shouldAnimate) {
            action.stop();
        }
    }, [actions, shouldAnimate]);

    // Find the head bone/node
    useMemo(() => {
        // Target the pivot bone for the top-most part of the skeleton
        const headPivot = scene.getObjectByName("Bip001 Spine_02");
        if (headPivot) {
            headRef.current = headPivot;
        } else {
            // Comprehensive fallback search
            scene.traverse((obj) => {
                if (obj.name.toLowerCase().includes("head") ||
                    obj.name.toLowerCase().includes("spine2") ||
                    obj.name.toLowerCase().includes("bone021")) {
                    headRef.current = obj;
                }
            });
        }
    }, [scene]);

    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            // Map window mouse position to -1 to 1 range
            mousePos.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mousePos.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useFrame((state) => {
        const { x, y } = mousePos.current;

        // 1. Rotate the head (Tracking)
        if (headRef.current) {
            // Increase rotation range for noticeable movement on this model
            // Using both Y and Z to ensure turn works regardless of skeleton orientation
            const targetRotationY = x * 0.8;
            const targetRotationX = -y * 0.5;

            headRef.current.rotation.y = THREE.MathUtils.lerp(
                headRef.current.rotation.y,
                targetRotationY,
                0.1
            );
            headRef.current.rotation.x = THREE.MathUtils.lerp(
                headRef.current.rotation.x,
                targetRotationX,
                0.1
            );
        }
    });

    return (
        <group>
            <primitive object={scene} scale={0.7} position={[0, -1.8, 0]} rotation={[0, 0, 0]} />
        </group>
    );
};

export const RobotViewer = ({ shouldAnimate = true }: { shouldAnimate?: boolean }) => {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas camera={{ position: [2, 1, 8], fov: 40 }} shadows>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.7} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />
                    <Model shouldAnimate={shouldAnimate} />
                    <Environment preset="city" />
                    <ContactShadows
                        position={[0, -1.8, 0]}
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

useGLTF.preload("/models/cute_home_robot/scene.gltf");
