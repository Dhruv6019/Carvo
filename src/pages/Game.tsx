import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Sky, Float, Stars, PerspectiveCamera, useGLTF, Center, ContactShadows, Text, Sparkles } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

// --- Simple Simplex-like Noise function ---
const p = new Uint8Array(512);
for (let i = 0; i < 256; i++) p[i] = p[i + 256] = Math.floor(Math.random() * 256);

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(t: number, a: number, b: number) { return a + t * (b - a); }
function grad(hash: number, x: number, y: number, z: number) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function noise(x: number, y: number, z: number) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    const A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z;
    const B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;

    return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),
        grad(p[BA], x - 1, y, z)),
        lerp(u, grad(p[AB], x, y - 1, z),
            grad(p[BB], x - 1, y - 1, z))),
        lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1),
            grad(p[BA + 1], x - 1, y, z - 1)),
            lerp(u, grad(p[AB + 1], x, y - 1, z - 1),
                grad(p[BB + 1], x - 1, y - 1, z - 1))));
}

const getHeight = (x: number, z: number) => {
    const distanceToRoad = Math.abs(x);

    // Hilly terrain logic
    let h = noise(x * 0.02, 0, z * 0.02) * 15;
    h += noise(x * 0.005, 0, z * 0.005) * 45;

    // Flatten road
    const roadFactor = THREE.MathUtils.smoothstep(distanceToRoad, 4, 15);
    return h * roadFactor;
};

const CHUNK_SIZE = 120;
const RESOLUTION = 48;

const treeCrownGeo = new THREE.CylinderGeometry(0, 0.8, 2.5, 6);
const treeTrunkGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 6);
const bushGeo = new THREE.SphereGeometry(0.4, 6, 6);
const treeCrownMat = new THREE.MeshStandardMaterial({ color: "#1e3f1e" });
const treeTrunkMat = new THREE.MeshStandardMaterial({ color: "#3d2b1f" });
const bushMat = new THREE.MeshStandardMaterial({ color: "#3d6b3d" });

const TerrainChunk = ({ x, z }: { x: number, z: number }) => {
    const { geometry, roadGeometry, vegetation } = useMemo(() => {
        const geo = new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, RESOLUTION, RESOLUTION);
        const positions = geo.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            const px = positions[i] + x;
            const pz = -(positions[i + 1] + z);
            positions[i + 2] = getHeight(px, pz);
        }
        geo.computeVertexNormals();

        // Road Geometry
        const roadGeo = new THREE.PlaneGeometry(12, CHUNK_SIZE, 1, RESOLUTION);
        const roadPos = roadGeo.attributes.position.array;
        for (let i = 0; i < roadPos.length; i += 3) {
            const px = roadPos[i];
            const pz = -(roadPos[i + 1] + z);
            roadPos[i + 2] = getHeight(px, pz) + 0.2; // Slightly higher to avoid z-fighting
        }
        roadGeo.computeVertexNormals();

        // Lush Vegetation
        const veg = [];
        for (let i = 0; i < 25; i++) {
            const vx = (Math.random() - 0.5) * CHUNK_SIZE;
            const vz = (Math.random() - 0.5) * CHUNK_SIZE;
            const dist = Math.abs(vx);
            if (dist > 18) { // Keep trees off the road
                const vy = getHeight(vx + x, vz + z);
                // Variety of vegetation
                const type = Math.random() > 0.3 ? 'tree' : 'bush';
                veg.push({ x: vx, y: vy, z: vz, scale: 0.8 + Math.random() * 2, type });
            }
        }

        return { geometry: geo, roadGeometry: roadGeo, vegetation: veg };
    }, [x, z]);

    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[x, 0, z]}>
            <mesh geometry={geometry} receiveShadow>
                <meshStandardMaterial
                    color="#2d5a27" // Lush Forest Green
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>
            <mesh geometry={roadGeometry} receiveShadow>
                <meshStandardMaterial color="#222" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Road lines */}
            <mesh position={[0, 0, 0.22]} geometry={new THREE.PlaneGeometry(0.2, CHUNK_SIZE)}>
                <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
            </mesh>

            {/* Trees / Vegetation */}
            {vegetation.map((v, i) => (
                <group key={i} position={[v.x, v.z, v.y]} rotation={[Math.PI / 2, 0, 0]}>
                    {v.type === 'tree' ? (
                        <group scale={v.scale}>
                            <mesh geometry={treeCrownGeo} material={treeCrownMat} position={[0, 1, 0]} castShadow />
                            <mesh geometry={treeTrunkGeo} material={treeTrunkMat} position={[0, 0.2, 0]} />
                        </group>
                    ) : (
                        <mesh geometry={bushGeo} material={bushMat} scale={v.scale} position={[0, 0.2, 0]} castShadow />
                    )}
                </group>
            ))}
        </group>
    );
};

// --- Simple Optimized Car Model ---
function SimpleCarModel({ speed }: { speed: number }) {
    const wheelRefs = useRef<THREE.Group[]>([]);
    const bodyColor = "#ff4400"; // Vibrant Sports Car Red

    useFrame((state, delta) => {
        wheelRefs.current.forEach((wheel) => {
            if (wheel) wheel.rotation.x += speed * delta * 2.5;
        });
    });

    return (
        <group scale={0.4} position={[0, 0.4, 0]}>
            {/* Main Body */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[2.5, 0.6, 5]} />
                <meshStandardMaterial color={bodyColor} roughness={0.1} metalness={0.8} />
            </mesh>

            {/* Cabin */}
            <mesh position={[0, 0.6, -0.2]} castShadow>
                <boxGeometry args={[2.2, 0.8, 2.5]} />
                <meshStandardMaterial color="#111" roughness={0} metalness={1} />
            </mesh>

            {/* Spoiler */}
            <mesh position={[0, 0.5, -2.2]} castShadow>
                <boxGeometry args={[2.8, 0.1, 0.5]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* Wheels */}
            {[[-1.3, -0.3, 1.8], [1.3, -0.3, 1.8], [-1.3, -0.3, -1.8], [1.3, -0.3, -1.8]].map((pos, i) => (
                <group key={i} position={pos as [number, number, number]} ref={el => wheelRefs.current[i] = el!}>
                    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                        <cylinderGeometry args={[0.6, 0.6, 0.5, 16]} />
                        <meshStandardMaterial color="#222" roughness={0.8} />
                    </mesh>
                    {/* Rims */}
                    <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.05, 0]}>
                        <circleGeometry args={[0.35, 8]} />
                        <meshStandardMaterial color="#ccc" metalness={1} />
                    </mesh>
                </group>
            ))}

            {/* Headlights */}
            <mesh position={[-0.9, 0, 2.5]}>
                <boxGeometry args={[0.4, 0.2, 0.1]} />
                <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0.9, 0, 2.5]}>
                <boxGeometry args={[0.4, 0.2, 0.1]} />
                <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
            </mesh>

            {/* Taillights */}
            <mesh position={[-0.9, 0, -2.5]}>
                <boxGeometry args={[0.6, 0.15, 0.1]} />
                <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={speed < 0 ? 5 : 1} />
            </mesh>
            <mesh position={[0.9, 0, -2.5]}>
                <boxGeometry args={[0.6, 0.15, 0.1]} />
                <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={speed < 0 ? 5 : 1} />
            </mesh>
        </group>
    );
}

// --- Car Controller ---
const ArcadeCar = ({ setSpeed, setDist }: { setSpeed: (s: number) => void, setDist: (d: number) => void }) => {
    const carRef = useRef<THREE.Group>(null);
    const speed = useRef(0);
    const rotation = useRef(0);
    const keys = useRef<{ [key: string]: boolean }>({});

    useEffect(() => {
        const down = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = true);
        const up = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = false);
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        };
    }, []);

    useFrame((state, delta) => {
        if (!carRef.current) return;

        // Controls
        const accelMultiplier = keys.current.w ? 60 : keys.current.s ? -50 : 0;
        speed.current += accelMultiplier * delta;
        speed.current *= 0.988; // Slightly less drag for speed feel

        if (Math.abs(speed.current) > 0.5) {
            const turnFactor = Math.min(Math.abs(speed.current) / 10, 1.2);
            const turnSpeed = 1.6 * turnFactor;
            if (keys.current.a) rotation.current += delta * turnSpeed;
            if (keys.current.d) rotation.current -= delta * turnSpeed;
        }

        // Movement
        const vx = Math.sin(rotation.current) * speed.current * delta;
        const vz = Math.cos(rotation.current) * speed.current * delta;

        carRef.current.position.x += vx;
        carRef.current.position.z += vz;
        carRef.current.rotation.y = rotation.current;

        // Ground following
        const groundHeight = getHeight(carRef.current.position.x, carRef.current.position.z);
        carRef.current.position.y = THREE.MathUtils.lerp(carRef.current.position.y, groundHeight + 0.12, 0.2);

        // Tilt based on slope
        const forwardHeight = getHeight(
            carRef.current.position.x + Math.sin(rotation.current) * 2.5,
            carRef.current.position.z + Math.cos(rotation.current) * 2.5
        );
        const sideHeight = getHeight(
            carRef.current.position.x + Math.cos(rotation.current) * 1.5,
            carRef.current.position.z - Math.sin(rotation.current) * 1.5
        );

        carRef.current.rotation.x = THREE.MathUtils.lerp(carRef.current.rotation.x, (groundHeight - forwardHeight) * 0.25, 0.15);
        carRef.current.rotation.z = THREE.MathUtils.lerp(carRef.current.rotation.z, (sideHeight - groundHeight) * 0.15, 0.15);

        // Camera - Dynamic based on speed
        const shake = (Math.random() - 0.5) * speed.current * 0.005;
        const camDist = 7 + speed.current * 0.1;
        const camHeight = 2.5 + speed.current * 0.04;
        const camOffset = new THREE.Vector3(shake, camHeight, -camDist).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);
        const targetCamPos = carRef.current.position.clone().add(camOffset);

        state.camera.position.lerp(targetCamPos, 0.12);

        // Dynamic FOV
        const pCam = state.camera as THREE.PerspectiveCamera;
        if (pCam.isPerspectiveCamera) {
            pCam.fov = THREE.MathUtils.lerp(pCam.fov, 50 + speed.current * 0.8, 0.1);
            pCam.updateProjectionMatrix();
        }

        state.camera.lookAt(carRef.current.position.clone().add(new THREE.Vector3(0, 1.2, 3)));

        setSpeed(Math.abs(speed.current));
        setDist(carRef.current.position.length());
    });

    return (
        <group ref={carRef}>
            <Suspense fallback={null}>
                <SimpleCarModel speed={speed.current} />
                <ContactShadows position={[0, -0.05, 0]} opacity={0.5} scale={12} blur={2.5} far={1.5} />
            </Suspense>
            {/* Dynamic Headlight beam */}
            <pointLight intensity={10} color="#ffffff" position={[0, 0.6, 2.5]} distance={15} />
            <spotLight color="#fff" intensity={speed.current > 5 ? 300 : 150} distance={80} angle={0.5} position={[0, 0.8, 2]} target-position={[0, 0, 30]} castShadow />
        </group>
    );
};

const InfiniteTerrain = () => {
    const { camera } = useThree();
    const [chunks, setChunks] = useState<{ x: number, z: number, key: string }[]>([]);

    useFrame(() => {
        const cx = Math.floor(camera.position.x / CHUNK_SIZE);
        const cz = Math.floor(camera.position.z / CHUNK_SIZE);

        // Visible range config
        const renderDist = 2; // 2 chunks in each direction
        const chunkKeys = new Set<string>();

        for (let x = -renderDist; x <= renderDist; x++) {
            for (let z = -renderDist; z <= renderDist; z++) {
                const tx = (cx + x) * CHUNK_SIZE;
                const tz = (cz + z) * CHUNK_SIZE;
                chunkKeys.add(`${tx}_${tz}`);
            }
        }

        const currentKeys = new Set(chunks.map(c => c.key));
        if (chunkKeys.size !== currentKeys.size || ![...chunkKeys].every(k => currentKeys.has(k))) {
            const newChunks = Array.from(chunkKeys).map(key => {
                const [x, z] = key.split('_').map(Number);
                return { x, z, key };
            });
            setChunks(newChunks);
        }
    });

    return (
        <>
            {chunks.map(chunk => <TerrainChunk key={chunk.key} x={chunk.x} z={chunk.z} />)}
        </>
    );
};

// --- Speed Particles ---
const SpeedParticles = ({ speed }: { speed: number }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 200;
    const [positions] = useState(() => new Float32Array(count * 3));

    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            pos[i3 + 2] -= speed * delta * 6;

            if (pos[i3 + 2] < -40) {
                pos[i3] = (Math.random() - 0.5) * 80;
                pos[i3 + 1] = Math.random() * 30;
                pos[i3 + 2] = 60;
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} position={[0, 0, 0]}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.12} color="#ffffff" transparent opacity={0.2} sizeAttenuation />
        </points>
    );
};

const Game = () => {
    const navigate = useNavigate();
    const [speed, setSpeed] = useState(0);
    const [dist, setDist] = useState(0);

    return (
        <div className="w-full h-screen bg-[#cce0ff] relative font-display overflow-hidden select-none">
            {/* Visual Overlays */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-[60] bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>

            {/* Speed Blur Overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-[55] transition-opacity duration-500"
                style={{
                    opacity: Math.min(speed / 40, 0.6),
                    background: 'radial-gradient(circle, transparent 40%, rgba(255,255,255,0.2) 100%)',
                    backdropFilter: `blur(${Math.min(speed / 10, 8)}px)`
                }}
            ></div>

            {/* HUD */}
            <div className="absolute top-8 left-8 z-50 text-white pointer-events-none flex flex-col space-y-4 animate-in fade-in slide-in-from-left duration-1000">
                <div className="bg-[#1a2e1a]/80 backdrop-blur-3xl border border-white/20 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-red-500/20 rounded-2xl border border-red-500/40">
                            <h1 className="text-2xl font-black italic tracking-tighter text-white leading-none">CARVO GT</h1>
                        </div>
                        <div className="h-px w-16 bg-gradient-to-r from-green-500 to-transparent"></div>
                        <span className="text-[11px] uppercase tracking-[0.4em] text-green-400 font-black">ALPINE SIM</span>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-green-300/60">Velocity Matrix</span>
                                <div className="flex items-baseline">
                                    <span className="text-7xl font-black leading-none italic tracking-tighter tabular-nums text-white">{(speed * 3.6).toFixed(0)}</span>
                                    <span className="text-sm opacity-50 ml-2 font-black font-mono">KM/H</span>
                                </div>
                            </div>
                            <div className="h-2.5 w-80 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[3px]">
                                <div
                                    className="h-full bg-gradient-to-r from-red-600 via-orange-400 to-white transition-all duration-75 relative rounded-full"
                                    style={{ width: `${Math.min((speed * 3.6) / 2.8, 100)}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/40 animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-4 px-6 bg-white/5 rounded-[2rem] border border-white/10">
                            <span className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Odometer Track</span>
                            <span className="text-2xl font-mono font-black tracking-tight text-green-50/90">{(dist / 1000).toFixed(2)} <span className="text-xs opacity-40">KM</span></span>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                onClick={() => navigate("/")}
                className="absolute top-8 right-8 z-50 bg-[#1a2e1a]/40 hover:bg-green-600/40 hover:text-green-200 backdrop-blur-2xl text-white border border-white/20 rounded-full px-12 py-8 transition-all duration-500 group"
            >
                <span className="relative z-10 font-black tracking-[0.3em] uppercase text-[12px]">Exit Simulation</span>
            </Button>

            <Canvas shadows gl={{ antialias: true, alpha: false, stencil: false }} dpr={[1, 2]}>
                <Suspense fallback={null}>
                    <color attach="background" args={["#cce0ff"]} />
                    <fog attach="fog" args={["#cce0ff", 30, 150]} />

                    <Sky distance={450000} sunPosition={[10, 20, 10]} inclination={0.1} azimuth={0.25} />
                    <Environment preset="park" />

                    <directionalLight
                        position={[100, 100, 50]}
                        intensity={2.5}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                        shadow-camera-left={-100}
                        shadow-camera-right={100}
                        shadow-camera-top={100}
                        shadow-camera-bottom={-100}
                    />
                    <ambientLight intensity={0.4} />

                    <InfiniteTerrain />
                    <ArcadeCar setSpeed={setSpeed} setDist={setDist} />
                    <SpeedParticles speed={speed} />

                    <Sparkles count={40} scale={100} size={4} speed={0.4} opacity={0.1} color="#ffffff" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Game;
