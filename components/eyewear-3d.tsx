"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Float, 
  PerspectiveCamera, 
  MeshTransmissionMaterial, 
  ContactShadows,
  PresentationControls
} from "@react-three/drei";
import { RotateCcw } from "lucide-react";
import * as THREE from "three";

function EyewearModel() {
  const meshRef = useRef<THREE.Group>(null);
  const leftLensRef = useRef<THREE.Mesh>(null);
  const rightLensRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // --- Cinematic 360 Turntable Rotation ---
    // Continuous rotation for world-class product feel
    meshRef.current.rotation.y = t * 0.4; 
    
    // Subtle tilt based on time
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    
    // Reactive mouse shift (additive)
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.05 + (state.mouse.y * 0.1);
    meshRef.current.position.x = state.mouse.x * 0.05;

    // Lens shimmer effect
    if (leftLensRef.current && rightLensRef.current) {
        leftLensRef.current.rotation.z = Math.sin(t * 0.8) * 0.05;
        rightLensRef.current.rotation.z = Math.sin(t * 0.8) * 0.05;
    }
  });

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: "#111827",
    roughness: 0.05,
    metalness: 0.9,
    envMapIntensity: 2
  });

  return (
    <group ref={meshRef}>
      {/* Precision Frame Sculpture */}
      {/* Left Eye Orbit */}
      <mesh position={[-0.8, 0, 0]}>
        <torusGeometry args={[0.5, 0.045, 32, 100]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>
      {/* Right Eye Orbit */}
      <mesh position={[0.8, 0, 0]}>
        <torusGeometry args={[0.5, 0.045, 32, 100]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>
      
      {/* High-Index Refraction Lenses */}
      <mesh ref={leftLensRef} position={[-0.8, 0, 0.02]}>
        <circleGeometry args={[0.485, 64]} />
        <MeshTransmissionMaterial 
          backside 
          samples={16} 
          resolution={512}
          thickness={0.8} 
          roughness={0}
          chromaticAberration={0.04} 
          anisotropy={0.3} 
          distortion={0.3} 
          distortionScale={0.5} 
          temporalDistortion={0.1} 
          color="#f0f9ff"
          transmission={1}
        />
      </mesh>
      <mesh ref={rightLensRef} position={[0.8, 0, 0.02]}>
        <circleGeometry args={[0.485, 64]} />
        <MeshTransmissionMaterial 
          backside 
          samples={16} 
          resolution={512}
          thickness={0.8} 
          roughness={0}
          chromaticAberration={0.04} 
          anisotropy={0.3} 
          distortion={0.3} 
          distortionScale={0.5} 
          temporalDistortion={0.1} 
          color="#f0f9ff"
          transmission={1}
        />
      </mesh>

      {/* Titanium Bridge */}
      <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.6]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>
      
      {/* Aerodynamic Temples (Arms) */}
      <group position={[-1.32, 0.12, -0.6]} rotation={[Math.PI / 20, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.025, 0.015, 1.3]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>
      </group>
      <group position={[1.32, 0.12, -0.6]} rotation={[Math.PI / 20, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.025, 0.015, 1.3]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

export default function Eyewear3D() {
  return (
    <div className="h-full w-full min-h-[500px] relative">
      <Canvas dpr={[1, 2]} shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0.5, 5]} fov={35} />
        
        {/* Standalone Cinematic Lighting (No External HDR needed) */}
        <ambientLight intensity={0.2} />
        
        {/* Main Studio Key Light */}
        <spotLight 
          position={[10, 15, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={3} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        
        {/* Teal Accent Fill Light */}
        <pointLight position={[-10, 5, -5]} intensity={2} color="#0b6e72" />
        
        {/* Secondary Warm Rim Light */}
        <pointLight position={[5, -5, 5]} intensity={1.5} color="#ffffff" />
        
        {/* Top-Down Spotlight for Frame Reflections */}
        <directionalLight position={[0, 10, 0]} intensity={1.5} />
        
        <PresentationControls
          global
          snap
          speed={2}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}
        >
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
            <EyewearModel />
          </Float>
        </PresentationControls>
        
        <ContactShadows 
          position={[0, -1.8, 0]} 
          opacity={0.5} 
          scale={12} 
          blur={2.8} 
          far={5} 
        />
      </Canvas>
      
      {/* Cinematic HUD elements */}
      <div className="absolute top-6 left-6 border-l-2 border-primary/60 pl-4 py-1 animate-in">
        <p className="text-[11px] font-black tracking-[0.25em] text-primary uppercase mb-0.5">Automated Scan Active</p>
        <p className="text-sm font-black text-foreground/80 tracking-tight">H-Series Carbon Prototype</p>
      </div>
      
      {/* 360 Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 glass-premium px-4 py-2 rounded-full border border-primary/20 animate-in delay-500">
         <RotateCcw className="h-3 w-3 text-primary animate-spin" style={{ animationDuration: '4s' }} />
         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/80">360° Visualizer</span>
      </div>
    </div>
  );
}
