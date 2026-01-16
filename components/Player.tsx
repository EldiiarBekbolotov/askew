/// <reference lib="dom" />
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { Trail, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3, Mesh, Group, Euler } from 'three';
import { useGameStore } from '../store';
import { GameState, DIFFICULTY_MULTIPLIERS } from '../types';

const MAX_LATERAL_SPEED = 40;
const JUMP_FORCE = 24;
const LATERAL_FORCE = 80;
const TURN_TORQUE = 50;
const BASE_FORWARD_FORCE = 18;
const PATH_HISTORY_LENGTH = 50; // Reduced for performance

export const Player: React.FC = () => {
    const gameState = useGameStore(state => state.gameState);
    const options = useGameStore(state => state.options);
    const currentSpeed = useGameStore(state => state.currentSpeed);
    const ballSkins = useGameStore(state => state.ballSkins);
    
    const canJump = useRef(false);
    const [pathPoints, setPathPoints] = useState<[number, number, number][]>([]);
    const pathHistoryRef = useRef<[number, number, number][]>([]);
    const lastPathUpdateTime = useRef(0);
    const jumpKeyWasPressed = useRef(false);

    // Get current ball skin
    const ballSkin = ballSkins.find(s => s.id === options.ballSkinId) || ballSkins[0];
    const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[options.difficulty];

    // Physics body
    const [ref, api] = useSphere(() => ({
        mass: 1,
        position: [0, 5, 0],
        args: [0.6],
        material: { friction: 0.1, restitution: 0.05 },
        linearDamping: 0.1,
        angularDamping: 0.1,
        onCollide: (e) => {
            // Enable jumping when we touch the track
            if (e.body.name !== 'player') {
                canJump.current = true;
            }
        }
    }));

    const visualRef = useRef<Group>(null);
    const ballGroupRef = useRef<Group>(null);
    const pos = useRef(new Vector3(0, 5, 0));
    const vel = useRef(new Vector3(0, 0, 0));
    const rollingRotation = useRef(new Euler(0, 0, 0));
    const { camera } = useThree();

    useEffect(() => {
        const unsubPos = api.position.subscribe((v) => pos.current.set(v[0], v[1], v[2]));
        const unsubVel = api.velocity.subscribe((v) => vel.current.set(v[0], v[1], v[2]));
        return () => {
            unsubPos();
            unsubVel();
        };
    }, [api.position, api.velocity]);

    useEffect(() => {
        if (gameState === GameState.PLAYING) {
            api.position.set(0, 5, 0);
            api.velocity.set(0, 0, 0);
            api.angularVelocity.set(0, 0, 0);
            rollingRotation.current.set(0, 0, 0);
            camera.position.set(0, 11.5, 13);
            canJump.current = false;
            pathHistoryRef.current = [];
            setPathPoints([]);
        }
    }, [gameState, api, camera]);

    const keysPressed = useRef<{ [key: string]: boolean }>({});
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { 
            keysPressed.current[e.code] = true; 
        };
        const handleKeyUp = (e: KeyboardEvent) => { 
            keysPressed.current[e.code] = false; 
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        if (gameState !== GameState.PLAYING) return;

        // Calculate speed multiplier based on difficulty and current speed
        const speedMultiplier = currentSpeed * difficultyMultiplier;
        const forwardForce = BASE_FORWARD_FORCE * speedMultiplier;

        // Standard downward/forward force with speed multiplier
        api.applyForce([0, -28, -forwardForce], [0, 0, 0]);

        // Lateral Movement - only use A/D and Arrow keys
        const leftPressed = keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft'];
        const rightPressed = keysPressed.current['KeyD'] || keysPressed.current['ArrowRight'];
        
        if (leftPressed) {
            api.applyTorque([0, 0, TURN_TORQUE]);
            api.applyForce([-LATERAL_FORCE, 0, 0], [0, 0, 0]);
        }
        if (rightPressed) {
            api.applyTorque([0, 0, -TURN_TORQUE]);
            api.applyForce([LATERAL_FORCE, 0, 0], [0, 0, 0]);
        }

        // Jumping - only Space key, with key release requirement
        const jumpPressed = keysPressed.current['Space'];
        if (jumpPressed && canJump.current && !jumpKeyWasPressed.current) {
            api.applyImpulse([0, JUMP_FORCE, 0], [0, 0, 0]);
            canJump.current = false;
        }
        jumpKeyWasPressed.current = jumpPressed;

        // Speed caps
        if (vel.current.x > MAX_LATERAL_SPEED) api.velocity.set(MAX_LATERAL_SPEED, vel.current.y, vel.current.z);
        if (vel.current.x < -MAX_LATERAL_SPEED) api.velocity.set(-MAX_LATERAL_SPEED, vel.current.y, vel.current.z);

        // Update path history for pathing line - less frequently
        const currentTime = state.clock.getElapsedTime();
        if (currentTime - lastPathUpdateTime.current > 0.1) {
            pathHistoryRef.current.push([pos.current.x, pos.current.y - 0.3, pos.current.z]);
            if (pathHistoryRef.current.length > PATH_HISTORY_LENGTH) {
                pathHistoryRef.current.shift();
            }
            // Only update state every 0.5 seconds to reduce re-renders
            if (Math.floor(currentTime * 2) !== Math.floor((currentTime - 0.1) * 2)) {
                setPathPoints([...pathHistoryRef.current]);
            }
            lastPathUpdateTime.current = currentTime;
        }

        // Camera following logic
        const camOffset = new Vector3(0, 6.5, 13);
        const lookOffset = new Vector3(0, -4, -30);
        const targetCamPos = pos.current.clone().add(camOffset);
        camera.position.lerp(targetCamPos, 0.12);
        camera.lookAt(pos.current.clone().add(lookOffset));

        // Visual Animation
        if (visualRef.current) {
            visualRef.current.position.copy(pos.current);

            const speed = vel.current.length();
            const rollRate = speed * delta * 1.8;

            // Rolling forward (X-axis)
            rollingRotation.current.x -= rollRate;

            // Tilt when turning (Z-axis)
            const targetTilt = -vel.current.x * 0.045;
            rollingRotation.current.z = THREE.MathUtils.lerp(rollingRotation.current.z, targetTilt, 0.15);

            if (ballGroupRef.current) {
                ballGroupRef.current.rotation.set(rollingRotation.current.x, 0, rollingRotation.current.z);

                // Subtle Squash and Stretch
                const stretch = 1 + (speed * 0.002);
                const squash = 1 / Math.sqrt(stretch);
                ballGroupRef.current.scale.set(squash, squash, stretch);
            }
        }
    });

    return (
        <>
            {/* Physics Debug / Hidden Body */}
            <mesh ref={ref as React.RefObject<Mesh>} name="player" visible={false}>
                <sphereGeometry args={[0.6]} />
            </mesh>

            {/* Path Line - only render if we have enough points */}
            {pathPoints.length >= 2 && (
                <Line
                    points={pathPoints}
                    color={ballSkin.emissiveColor}
                    lineWidth={2}
                    transparent
                    opacity={0.4}
                />
            )}

            <group ref={visualRef}>
                {/* Neon Trail */}
                <Trail
                    width={1.2}
                    length={8}
                    color={new THREE.Color(ballSkin.emissiveColor)}
                    attenuation={(t) => t * t}
                >
                    {/* Main Ball Visuals */}
                    <group ref={ballGroupRef}>
                        {/* Core Dark Shell */}
                        <mesh castShadow>
                            <sphereGeometry args={[0.6, 32, 32]} />
                            <meshStandardMaterial
                                color={ballSkin.color}
                                roughness={0.1}
                                metalness={0.9}
                            />
                        </mesh>

                        {/* Glowing Grid Overlay */}
                        <mesh>
                            <sphereGeometry args={[0.61, 32, 32]} />
                            <meshStandardMaterial
                                color={ballSkin.wireframeColor}
                                emissive={ballSkin.emissiveColor}
                                emissiveIntensity={5}
                                wireframe
                                transparent
                                opacity={0.8}
                            />
                        </mesh>

                        {/* Inner Power Core */}
                        <mesh>
                            <octahedronGeometry args={[0.35, 1]} />
                            <meshBasicMaterial color={ballSkin.coreColor} />
                        </mesh>
                    </group>
                </Trail>

                {/* Ambient Glow / Halo */}
                <mesh scale={[1.2, 1.2, 1.2]}>
                    <sphereGeometry args={[0.6, 16, 16]} />
                    <meshStandardMaterial
                        color={ballSkin.emissiveColor}
                        emissive={ballSkin.emissiveColor}
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.05}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>
        </>
    );
};
