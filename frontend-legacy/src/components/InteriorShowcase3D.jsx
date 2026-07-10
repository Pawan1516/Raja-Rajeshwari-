import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Sofa() {
  return (
    <group position={[0, -0.4, 0.4]}>
      {/* Seat Cushion */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.4, 1.2]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
      </mesh>
      {/* Backrest */}
      <mesh castShadow receiveShadow position={[0, 0.6, -0.5]}>
        <boxGeometry args={[3.2, 0.8, 0.3]} />
        <meshStandardMaterial color="#5C4033" roughness={0.8} />
      </mesh>
      {/* Left Armrest */}
      <mesh castShadow receiveShadow position={[-1.7, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.7, 1.3]} />
        <meshStandardMaterial color="#5C4033" roughness={0.8} />
      </mesh>
      {/* Right Armrest */}
      <mesh castShadow receiveShadow position={[1.7, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.7, 1.3]} />
        <meshStandardMaterial color="#5C4033" roughness={0.8} />
      </mesh>
    </group>
  );
}

function CoffeeTable() {
  return (
    <group position={[0, -0.6, 1.8]}>
      {/* Top Slab */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.1, 0.8]} />
        <meshStandardMaterial color="#C4A484" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.6, -0.2, -0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.6, -0.2, -0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[-0.6, -0.2, 0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.6, -0.2, 0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  );
}

function WallUnit() {
  return (
    <group position={[0, 0.5, -2]}>
      {/* Backboard panel */}
      <mesh receiveShadow>
        <boxGeometry args={[4.5, 2, 0.1]} />
        <meshStandardMaterial color="#ECEFF1" roughness={0.9} />
      </mesh>
      {/* TV Console unit */}
      <mesh castShadow position={[0, -0.7, 0.2]}>
        <boxGeometry args={[3.5, 0.3, 0.6]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.5} />
      </mesh>
      {/* TV screen */}
      <mesh position={[0, 0.2, 0.15]}>
        <boxGeometry args={[2.2, 1.2, 0.05]} />
        <meshStandardMaterial color="#111111" roughness={0.2} />
      </mesh>
    </group>
  );
}

function RoomScene() {
  const groupRef = useRef();

  // Animate a slow, comforting floating camera tilt
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Flooring with rich wood coloring */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#E0D2C3" roughness={0.7} />
      </mesh>

      {/* Decorative rug */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.89, 1]}>
        <planeGeometry args={[4.2, 3]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.9} /> {/* forest green rug */}
      </mesh>

      {/* Furniture elements */}
      <Sofa />
      <CoffeeTable />
      <WallUnit />
    </group>
  );
}

export default function InteriorShowcase3D() {
  const [webGLSupported, setWebGLSupported] = useState(true);

  // Check if browser supports WebGL
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const isSupported = !!(
        window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebGLSupported(isSupported);
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);

  if (!webGLSupported) {
    // Beautiful fallback static image if WebGL is unavailable
    return (
      <div 
        className="w-full h-full bg-cover bg-center rounded-3xl"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80')` }}
      >
        <div className="w-full h-full bg-black/30 backdrop-blur-xs flex items-center justify-center p-6 text-center text-white">
          <span className="bg-slate-900/80 px-4 py-2 rounded-full text-xs font-semibold">
            WebGL offline. Viewing premium snapshot.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[50vh] sm:h-[60vh] lg:h-full relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      <Canvas shadows camera={{ position: [5, 4, 7], fov: 40 }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 3]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        <pointLight position={[-4, 4, -4]} intensity={0.3} color="#FFE0B2" />
        <pointLight position={[0, 2.5, 0.2]} intensity={0.6} color="#FFE0B2" />

        {/* 3D Scene Elements */}
        <RoomScene />

        {/* Orbit Interaction */}
        <OrbitControls 
          enableZoom={true} 
          maxPolarAngle={Math.PI / 2 - 0.05} // prevent going underneath floor
          minDistance={3}
          maxDistance={12}
        />
      </Canvas>
      
      {/* 3D Drag HUD indicator */}
      <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-slate-300 font-bold uppercase tracking-wider pointer-events-none select-none border border-slate-800 shadow-md">
        🖱️ Click & Drag to Rotate
      </div>
    </div>
  );
}
