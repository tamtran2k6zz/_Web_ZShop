import React, { useState, useRef } from 'react';
import ThreeScene, { ModelType } from './ThreeScene';
import Navbar3D from './Navbar3D';
import Hero3D from './Hero3D';
import BentoGrid3D from './BentoGrid3D';
import PaymentSimulator3D from './PaymentSimulator3D';
import Footer3D from './Footer3D';
import { UserRole } from '../../types';

interface LandingPage3DProps {
  onEnterStore: () => void;
  onProductClick: (id: string) => void;
  onOpenCart: () => void;
  cartItemCount?: number;
  userRole?: UserRole;
  onLogin?: () => void;
  onLogout?: () => void;
  onGoToAdmin?: () => void;
  onOpenSellerChannel?: () => void;
}

const LandingPage3D: React.FC<LandingPage3DProps> = ({
  onEnterStore,
  onProductClick,
  onOpenCart,
  cartItemCount = 0,
  userRole,
  onLogin,
  onLogout,
  onGoToAdmin,
  onOpenSellerChannel,
}) => {
  // 3D Scene Controls State
  const [activeModel, setActiveModel] = useState<ModelType>('core');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  // Procedural Web Audio Ambient Synthesizer
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleAudioAmbience = () => {
    if (!isAudioPlaying) {
      // Start ambient synth
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Space drone chord: C2 (65.4Hz), G2 (98.0Hz), C3 (130.8Hz), E3 (164.8Hz)
        const frequencies = [65.4, 98.0, 130.8, 164.8];
        const oscs: OscillatorNode[] = [];

        frequencies.forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Subtle stereo panning / filter
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, ctx.currentTime);

          osc.connect(filter);
          filter.connect(masterGain);
          osc.start();
          oscs.push(osc);
        });

        oscillatorsRef.current = oscs;
        setIsAudioPlaying(true);
      } catch (err) {
        console.warn('AudioContext not allowed or not supported:', err);
      }
    } else {
      // Stop ambient synth
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (_) {}
      });
      oscillatorsRef.current = [];
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsAudioPlaying(false);
    }
  };

  const handleScrollToPayment = () => {
    const el = document.getElementById('payment-simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030308] text-white font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* 1. Fixed Background WebGL 3D Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ThreeScene
          modelType={activeModel}
          isWireframe={isWireframe}
          speedMultiplier={speedMultiplier}
        />
      </div>

      {/* 2. Top Glassmorphic Navigation Bar */}
      <Navbar3D
        onEnterStore={onEnterStore}
        onOpenCart={onOpenCart}
        cartItemCount={cartItemCount}
        userRole={userRole}
        onLogin={onLogin}
        onLogout={onLogout}
        onGoToAdmin={onGoToAdmin}
        onOpenSellerChannel={onOpenSellerChannel}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={toggleAudioAmbience}
      />

      {/* 3. Hero Section with 3D HUD */}
      <Hero3D
        onEnterStore={onEnterStore}
        onExplorePayment={handleScrollToPayment}
        activeModel={activeModel}
        onChangeModel={setActiveModel}
        isWireframe={isWireframe}
        onToggleWireframe={() => setIsWireframe(!isWireframe)}
        speedMultiplier={speedMultiplier}
        onChangeSpeed={setSpeedMultiplier}
      />

      {/* 4. MotionSites Inspired Bento Grid */}
      <BentoGrid3D
        onProductClick={onProductClick}
        onEnterStore={onEnterStore}
      />

      {/* 5. Quantum Payment Simulator */}
      <PaymentSimulator3D
        onEnterStore={onEnterStore}
      />

      {/* 6. Mega Footer */}
      <Footer3D
        onEnterStore={onEnterStore}
        onGoToAdmin={onGoToAdmin}
        onOpenSellerChannel={onOpenSellerChannel}
      />
    </div>
  );
};

export default LandingPage3D;
