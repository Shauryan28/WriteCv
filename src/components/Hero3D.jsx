import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Pencil(props) {
    const mesh = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.z = Math.sin(t / 2) / 8 - 0.5; // Gentle tilt
        mesh.current.rotation.y = t * 0.2; // Slow spin
        mesh.current.position.y = Math.sin(t) * 0.3; // Float visual
    });

    return (
        <group {...props} ref={mesh} dispose={null}>
            {/* Pencil Body (Hexagonal) */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 5, 6]} />
                <meshStandardMaterial color="#FFC107" roughness={0.3} metalness={0.1} />
            </mesh>

            {/* Wood Tip */}
            <mesh position={[0, 3, 0]}>
                <coneGeometry args={[0.4, 1, 6]} />
                <meshStandardMaterial color="#E0C097" roughness={0.8} />
            </mesh>

            {/* Graphite Tip */}
            <mesh position={[0, 3.5, 0]}>
                <coneGeometry args={[0.1, 0.4, 6]} />
                <meshStandardMaterial color="#333333" roughness={0.5} />
            </mesh>

            {/* Metal Ferrule */}
            <mesh position={[0, -2.7, 0]}>
                <cylinderGeometry args={[0.42, 0.42, 0.5, 32]} />
                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Eraser */}
            <mesh position={[0, -3.1, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
                <meshStandardMaterial color="#FF8A80" roughness={0.6} />
            </mesh>
        </group>
    );
}

function FloatingPaperPlane() {
    const group = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        group.current.position.y = Math.sin(t * 1.5) * 0.2;
        group.current.rotation.z = Math.sin(t) * 0.1;
    });

    return (
        <group ref={group} position={[-3, 2, -2]} rotation={[0, 0.5, 0]} scale={0.5}>
            <mesh>
                <coneGeometry args={[1, 2, 3]} /> {/* Abstract plane shape */}
                <meshStandardMaterial color="white" roughness={0.4} />
            </mesh>
        </group>
    )
}

function CrumpledPaper({ position, color }) {
    const mesh = useRef();
    useFrame((state) => {
        mesh.current.rotation.x += 0.01;
        mesh.current.rotation.y += 0.01;
    })
    return (
        <mesh ref={mesh} position={position} scale={0.4}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={color} flatShading />
        </mesh>
    )
}

export default function Hero3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 10], fov: 40 }} dpr={[1, 2]}>
                <ambientLight intensity={0.8} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#eef" />

                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
                    {/* Main Pencil - Positioned to the RIGHT to allow text on LEFT/CENTER */}
                    <Pencil position={[3.5, 0, 0]} rotation={[0, 0, -0.4]} />
                </Float>

                <FloatingPaperPlane />
                <CrumpledPaper position={[-4, -3, -2]} color="#ffffff" />
                <CrumpledPaper position={[4, 3, -4]} color="#f0f0f0" />

                <Environment preset="apartment" />
                <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2.5} far={4} />
            </Canvas>
        </div>
    );
}
