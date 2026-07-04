import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Center, Float, Html, useProgress } from '@react-three/drei';
import { X, ZoomIn, RotateCcw, HelpCircle } from 'lucide-react';

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 bg-slate-950/80 px-6 py-5 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-2xl">
        <div className="w-8 h-8 border-4 border-wood border-t-transparent rounded-full animate-spin"></div>
        <span className="text-white text-[10px] font-extrabold uppercase tracking-widest">{progress.toFixed(0)}% Loaded</span>
      </div>
    </Html>
  );
}

function ImageFrame({ url }) {
  const texture = useTexture(url);
  const meshRef = useRef();

  // Gentle self-rotation tilt
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.08;
    }
  });

  const aspect = texture ? texture.image.width / texture.image.height : 4/3;
  const width = 4;
  const height = width / aspect;

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[width, height, 0.12]} />
      <meshStandardMaterial attach="material-0" color="#2c1a11" roughness={0.6} />
      <meshStandardMaterial attach="material-1" color="#2c1a11" roughness={0.6} />
      <meshStandardMaterial attach="material-2" color="#2c1a11" roughness={0.6} />
      <meshStandardMaterial attach="material-3" color="#2c1a11" roughness={0.6} />
      <meshStandardMaterial attach="material-4" map={texture} roughness={0.2} metalness={0.05} />
      <meshStandardMaterial attach="material-5" color="#1a0f0a" roughness={0.9} />
    </mesh>
  );
}

export default function ThreeDViewerModal({ isOpen, imageUrl, title, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between select-none">
      
      {/* Top Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-900 bg-slate-950/50 backdrop-blur-xs z-10">
        <div>
          <span className="text-[10px] font-extrabold text-wood uppercase tracking-widest">3D Vision Showcase</span>
          <h2 className="text-white font-outfit font-extrabold text-sm sm:text-base leading-none mt-1">{title}</h2>
        </div>
        <button 
          onClick={onClose}
          className="bg-slate-900 text-slate-400 hover:text-white p-2 rounded-full border border-slate-800 transition-smooth hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 3D Canvas Area */}
      <div className="flex-grow w-full relative">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-wood border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Initializing 3D Canvas...</span>
            </div>
          </div>
        }>
          <Canvas shadows camera={{ position: [0, 0, 5], fov: 48 }}>
            <ambientLight intensity={0.7} />
            <directionalLight 
              position={[5, 8, 5]} 
              intensity={1.3} 
              castShadow 
              shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[-4, 4, -2]} intensity={0.4} color="#FFE0B2" />

            <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.4}>
              <Center>
                <ImageFrame url={imageUrl} />
              </Center>
            </Float>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]} receiveShadow>
              <planeGeometry args={[30, 30]} />
              <shadowMaterial opacity={0.35} />
            </mesh>

            <OrbitControls 
              enableDamping
              dampingFactor={0.06}
              minDistance={2}
              maxDistance={8}
            />
          </Canvas>
        </Suspense>

        {/* 3D Guide HUD overlays */}
        <div className="absolute bottom-6 left-6 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-2 pointer-events-none select-none shadow-xl">
          <HelpCircle className="w-4 h-4 text-wood" />
          <span className="text-[10px] text-slate-350 font-bold uppercase tracking-wider">
            🖱️ Left Click + Drag to Rotate &bull; 🔍 Scroll to Zoom
          </span>
        </div>
      </div>
      
    </div>
  );
}
