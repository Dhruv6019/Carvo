
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { CarState } from '../types/ThreeDTypes';

interface CarProps {
    state: CarState;
}

const Car: React.FC<CarProps> = ({ state }) => {
    const carGroup = useRef<Group>(null);
    const leftDoor = useRef<Group>(null);
    const rightDoor = useRef<Group>(null);

    useFrame((_, delta) => {
        if (state.isRotating && carGroup.current) {
            carGroup.current.rotation.y += delta * 0.5;
        }

        // Smooth door animation
        if (leftDoor.current && rightDoor.current) {
            const targetRotation = state.doorsOpen ? -Math.PI / 3 : 0;
            leftDoor.current.rotation.y += (targetRotation - leftDoor.current.rotation.y) * 0.1;
            rightDoor.current.rotation.y += (-targetRotation - rightDoor.current.rotation.y) * 0.1;
        }
    });

    return (
        <group ref={carGroup}>
            {/* Chassis */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[4, 0.5, 2]} />
                <meshStandardMaterial color={state.color} />
            </mesh>

            {/* Cabin */}
            <mesh position={[-0.2, 1.1, 0]}>
                <boxGeometry args={[2, 0.7, 1.8]} />
                <meshStandardMaterial color={state.color} />
            </mesh>

            {/* Left Door */}
            <group ref={leftDoor} position={[0.5, 0.8, 1]}>
                <mesh position={[-0.5, 0, 0]}>
                    <boxGeometry args={[1, 0.6, 0.1]} />
                    <meshStandardMaterial color={state.color} />
                </mesh>
            </group>

            {/* Right Door */}
            <group ref={rightDoor} position={[0.5, 0.8, -1]}>
                <mesh position={[-0.5, 0, 0]}>
                    <boxGeometry args={[1, 0.6, 0.1]} />
                    <meshStandardMaterial color={state.color} />
                </mesh>
            </group>

            {/* Wheels */}
            {[
                [-1.2, 0.3, 0.9], [1.2, 0.3, 0.9],
                [-1.2, 0.3, -0.9], [1.2, 0.3, -0.9]
            ].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
            ))}

            {/* Ground Shadow */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#f0f0f0" transparent opacity={0.5} />
            </mesh>
        </group>
    );
};

export default Car;
