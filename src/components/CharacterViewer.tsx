import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

const Model = () => {
    const { scene } = useGLTF("/models/cartoon_boy_character/scene.gltf");
    const headRef = useRef<THREE.Object3D | null>(null);

    // Find the head bone/node
    useMemo(() => {
        console.log("Exploring character nodes...");
        scene.traverse((obj) => {
            console.log("Node:", obj.name);
            // Common naming for head bones
            if (obj.name.toLowerCase().includes("head") ||
                obj.name.toLowerCase().includes("neck") ||
                obj.name.toLowerCase().includes("face")) {
                console.log("Found potential head node:", obj.name);
                headRef.current = obj;
            }
        });

        // If still not found, try to find the Eyes node as a proxy
        if (!headRef.current) {
            const eyes = scene.getObjectByName("Eyes");
            if (eyes) {
                console.log("Using Eyes node as rotation proxy");
                headRef.current = eyes.parent; // Try the parent of eyes
            }
        }
    }, [scene]);

    useFrame((state) => {
        if (headRef.current) {
            // Pointer coordinates are from -1 to 1
            const { x, y } = state.pointer;

            // Limit head rotation for realism
            const targetRotationY = x * 0.6; // Turn left/right
            const targetRotationX = -y * 0.4; // Look up/down

            // Smoothly interpolate rotation
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

    return <primitive object={scene} scale={2.5} position={[0, -1.8, 0]} rotation={[0, 0, 0]} />;
};

export const CharacterViewer = () => {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} shadows>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />
                    <Model />
                    <Environment preset="city" />
                    <ContactShadows
                        position={[0, -1.8, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2.5}
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

useGLTF.preload("/models/cartoon_boy_character/scene.gltf");
