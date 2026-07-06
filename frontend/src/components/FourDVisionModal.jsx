import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Center, Float, Sparkles, Html } from '@react-three/drei';
import { X, Sun, Moon, Sparkle, Film, Move, Info, ZoomIn } from 'lucide-react';
import { API_BASE_URL } from '../constants';
import * as THREE from 'three';
import { createLuminanceDepthMap } from '../utils/depthMapGenerator';

function ImmersiveScene({ imageUrl, depthMapUrl, displacementScale, cinematicEnabled, mood, dayNight }) {
  const texture = useTexture(imageUrl);
  // Fallback to imageUrl if depthMapUrl generation fails or is blocked
  const depthTexture = useTexture(depthMapUrl || imageUrl);
  const meshRef = useRef();
  const spotLightRef = useRef();
  const { camera, mouse } = useThree();

  const targetCameraPos = useRef(new THREE.Vector3(0, 0, 5.2));

  // Determine aspect ratio for the 3D plane
  const aspect = texture ? texture.image.width / texture.image.height : 4/3;
  const width = 4;
  const height = width / aspect;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (cinematicEnabled) {
      // Cinematic Camera Path: slow sweep in a figure-8 shape
      const radius = 5.2;
      targetCameraPos.current.x = Math.sin(time * 0.2) * 0.65;
      targetCameraPos.current.y = Math.cos(time * 0.3) * 0.35;
      targetCameraPos.current.z = radius + Math.sin(time * 0.1) * 0.4;
    } else {
      // Mouse-based Parallax Interaction
      targetCameraPos.current.x = mouse.x * 0.8;
      targetCameraPos.current.y = mouse.y * 0.5;
      targetCameraPos.current.z = 5.2;
    }

    // Smoothly interpolate the camera position
    camera.position.lerp(targetCameraPos.current, 0.05);
    camera.lookAt(0, 0, 0);

    // Subtle floating breathing effect on the canvas mesh
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(time * 0.45) * 0.025;
    }
  });

  // Calculate dynamic lighting parameters based on mood and day/night state
  const isNight = dayNight === 'night';
  let ambientColor = '#ffffff';
  let ambientIntensity = isNight ? 0.3 : 0.8;
  
  let directColor = '#ffffff';
  let directIntensity = isNight ? 0.4 : 1.5;
  let directPos = isNight ? [-5, 6, 2] : [6, 8, 4];
  
  let spotColor = '#ffffff';
  let spotIntensity = isNight ? 0.8 : 0.4;

  let sparkleColor = '#ffffff';

  if (mood === 'warm') {
    ambientColor = '#ffeada';
    directColor = '#ffcaa3';
    spotColor = '#ffa259';
    sparkleColor = '#ffa259';
    directIntensity = isNight ? 0.5 : 1.7;
    spotIntensity = isNight ? 1.4 : 0.7;
  } else if (mood === 'cool') {
    ambientColor = '#e0f2fe';
    directColor = '#bae6fd';
    spotColor = '#38bdf8';
    sparkleColor = '#38bdf8';
    directIntensity = isNight ? 0.4 : 1.4;
    spotIntensity = isNight ? 1.2 : 0.6;
  } else if (mood === 'luxury') {
    ambientColor = '#fef08a';
    directColor = '#fde047';
    spotColor = '#ca8a04';
    sparkleColor = '#fde047';
    directIntensity = isNight ? 0.6 : 1.9;
    spotIntensity = isNight ? 1.8 : 0.9;
  }

  return (
    <>
      {/* Dynamic Lighting System */}
      <ambientLight color={ambientColor} intensity={ambientIntensity} />
      
      <directionalLight 
        position={directPos} 
        color={directColor} 
        intensity={directIntensity} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      
      <spotLight 
        ref={spotLightRef}
        position={[0, 4, 3]} 
        angle={Math.PI / 6} 
        penumbra={0.8} 
        color={spotColor} 
        intensity={spotIntensity}
        castShadow
      />

      {/* Floating Sparkles catching highlights */}
      <Sparkles 
        count={60} 
        scale={[width * 1.5, height * 1.5, 3]} 
        size={1.6} 
        speed={0.35} 
        color={sparkleColor} 
      />

      {/* 3D Displacement Mesh Canvas */}
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.15}>
        <Center>
          <mesh ref={meshRef} castShadow receiveShadow>
            <planeGeometry args={[width, height, 160, 160]} />
            <meshStandardMaterial 
              map={texture} 
              displacementMap={depthTexture}
              displacementScale={displacementScale}
              displacementBias={-0.03}
              roughness={0.4}
              metalness={0.05}
            />
          </mesh>
        </Center>
      </Float>

      {/* Floor Shadow receiver */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height/2 - 0.8, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </>
  );
}

export default function FourDVisionModal({ isOpen, imageUrl, depthMapUrl: dbDepthMapUrl, title, onClose }) {
  const [depthMapUrl, setDepthMapUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Custom Controls
  const [displacementScale, setDisplacementScale] = useState(0.4);
  const [cinematicEnabled, setCinematicEnabled] = useState(true);
  const [mood, setMood] = useState('luxury'); // warm, cool, luxury
  const [dayNight, setDayNight] = useState('day'); // day, night

  // Use pre-computed database depth map if available, otherwise estimate on-the-fly
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setDepthMapUrl(null);
      
      // Resolve backend path relative to API if it is a local path (starts with /uploads)
      const resolvedDbUrl = dbDepthMapUrl && dbDepthMapUrl.startsWith('/uploads')
        ? `${API_BASE_URL}${dbDepthMapUrl}`
        : dbDepthMapUrl;

      if (resolvedDbUrl) {
        setDepthMapUrl(resolvedDbUrl);
        setLoading(false);
      } else if (imageUrl) {
        createLuminanceDepthMap(imageUrl)
          .then((url) => {
            setDepthMapUrl(url);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false); // Graceful fallback
          });
      } else {
        setLoading(false);
      }
    }
  }, [isOpen, imageUrl, dbDepthMapUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-md flex flex-col justify-between select-none">
      
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-900 bg-slate-950/70 backdrop-blur-md z-20">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-wood-light bg-wood/20 border border-wood/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkle className="w-3 h-3 text-wood-light" />
            <span>4D AI Vision Model</span>
          </span>
          <h2 className="text-white font-outfit font-extrabold text-sm sm:text-lg leading-none mt-1.5">{title}</h2>
        </div>
        <button 
          onClick={onClose}
          className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white p-2.5 rounded-full border border-slate-800 transition-smooth hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Canvas & Overlay Controls */}
      <div className="flex-grow w-full relative flex flex-col lg:flex-row">
        
        {/* WebGL 3D Viewer Area */}
        <div className="flex-grow h-full relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10 gap-3.5">
              <div className="w-10 h-10 border-4 border-wood border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center space-y-1">
                <span className="text-white text-xs font-extrabold uppercase tracking-widest block">AI Depth Modeling</span>
                <span className="text-slate-500 text-[10px]">Analyzing 2D pixels to generate immersive 3D layers...</span>
              </div>
            </div>
          ) : (
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10 gap-3">
                <div className="w-8 h-8 border-4 border-wood border-t-transparent rounded-full animate-spin"></div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Initializing WebGL Scene...</span>
              </div>
            }>
              <Canvas shadows camera={{ position: [0, 0, 5.2], fov: 45 }}>
                <ImmersiveScene 
                  imageUrl={imageUrl} 
                  depthMapUrl={depthMapUrl}
                  displacementScale={displacementScale}
                  cinematicEnabled={cinematicEnabled}
                  mood={mood}
                  dayNight={dayNight}
                />
                
                <OrbitControls 
                  enableDamping
                  dampingFactor={0.05}
                  minDistance={2}
                  maxDistance={7.5}
                />
              </Canvas>
            </Suspense>
          )}

          {/* Interactive Guides HUD */}
          <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-slate-950/80 backdrop-blur-md border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-2.5 pointer-events-none select-none shadow-2xl text-xs max-w-sm">
            <Info className="w-4 h-4 text-wood shrink-0" />
            <span className="text-[10px] text-slate-350 font-bold uppercase tracking-wider leading-relaxed">
              {cinematicEnabled 
                ? "🎥 Cinematic Path Active. Left-click & drag to take manual control." 
                : "🖱️ Manual Parallax Active. Move mouse to trigger depth changes."}
            </span>
          </div>
        </div>

        {/* Dashboard Overlay Control Panel */}
        <div className="w-full lg:w-80 bg-slate-900/60 lg:border-l border-t lg:border-t-0 border-slate-900 backdrop-blur-lg p-5 flex flex-col justify-between shrink-0 space-y-6 z-10">
          
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-outfit font-extrabold text-sm uppercase tracking-wider text-white">4D AI Vision Settings</h3>
              <p className="text-[10px] text-slate-500 mt-1">Fine-tune lighting, camera paths, and depth scale</p>
            </div>

            {/* Depth Level scale Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">3D Depth Scale</span>
                <span className="text-wood font-extrabold text-[10px] bg-wood/10 px-2 py-0.5 rounded-md">{(displacementScale * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.05" 
                max="0.95" 
                step="0.05" 
                value={displacementScale}
                onChange={(e) => setDisplacementScale(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-wood"
              />
              <div className="flex justify-between text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                <span>Minimal</span>
                <span>Hyper-Extrusion</span>
              </div>
            </div>

            {/* Day / Night Toggle */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">AI Sun Cycle</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDayNight('day')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-smooth ${
                    dayNight === 'day' 
                      ? 'bg-wood border-wood text-white shadow-lg shadow-wood/10' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Day Mode</span>
                </button>
                <button
                  onClick={() => setDayNight('night')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-smooth ${
                    dayNight === 'night' 
                      ? 'bg-wood border-wood text-white shadow-lg shadow-wood/10' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Night Mode</span>
                </button>
              </div>
            </div>

            {/* Scene Lighting Mood Switch */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Lighting Palette</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'luxury', label: 'Luxury Gold' },
                  { id: 'warm', label: 'Warm Cozy' },
                  { id: 'cool', label: 'Cool Modern' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMood(item.id)}
                    className={`py-2 rounded-xl text-[10px] font-extrabold uppercase transition-smooth border ${
                      mood === item.id 
                        ? 'bg-white border-white text-slate-950 font-black shadow-md' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cinematic Camera Sweep toggle */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Camera Sweep Mode</span>
              <button
                onClick={() => setCinematicEnabled(!cinematicEnabled)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-smooth ${
                  cinematicEnabled 
                    ? 'bg-forest border-forest text-white shadow-lg shadow-forest/10' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cinematicEnabled ? <Film className="w-4 h-4" /> : <Move className="w-4 h-4" />}
                <span>{cinematicEnabled ? 'Cinematic Walkthrough' : 'Mouse Parallax'}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[9px] text-slate-500 leading-normal">
            <strong>4D Engine:</strong> Heightmaps are analyzed live based on color contrast, generating real-time structural depth grids. Adjust depth scaling to alter 3D extrusion heights.
          </div>
        </div>

      </div>

    </div>
  );
}
