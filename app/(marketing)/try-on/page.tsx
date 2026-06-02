"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scan, 
  Camera, 
  Upload, 
  ChevronLeft, 
  Sparkles, 
  RotateCcw, 
  Download,
  Info,
  Check
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const Eyewear3D = dynamic(() => import("@/components/eyewear-3d"), { ssr: false });

export default function TryOnPage() {
  const [step, setStep] = useState(1);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(0.8);
  const [yOffset, setYOffset] = useState(-20);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const frames = [
    { name: "V-Series Titanium", color: "Onyx Black", type: "Classic" },
    { name: "Aero-Lite v2", color: "Frost Silver", type: "Modern" },
    { name: "Zenith Rimless", color: "Champagne Gold", type: "Luxury" }
  ];

  const startCamera = async () => {
    setUploadedImage(null);
    setIsCalibrating(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setTimeout(() => {
        setIsCalibrating(false);
        setStep(2);
      }, 2500);
    } catch (err) {
      console.error("Camera error:", err);
      setIsCalibrating(false);
      alert("Camera access denied or unavailable.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setIsCalibrating(true);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setTimeout(() => {
        setIsCalibrating(false);
        setStep(2);
      }, 2000);
    }
  };

  const handleCapture = () => {
    // Cinematic capture simulation with success feedback
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 glass-premium px-8 py-4 rounded-2xl border border-primary/40 text-primary font-black text-xs z-[100] animate-in slide-in-from-bottom-5';
    toast.innerText = 'PREPARING HIGH-RES SCENE...';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.innerText = 'IMAGE SYNCED TO VAULT √';
      setTimeout(() => toast.remove(), 2000);
    }, 1500);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUploadedImage(null);
    setStep(1);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (uploadedImage) URL.revokeObjectURL(uploadedImage);
    };
  }, [stream, uploadedImage]);

  return (
    <div className="min-h-screen bg-[#080c16] text-white selection:bg-primary/30">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 flex justify-between items-center bg-gradient-to-b from-[#080c16] to-transparent">
        <Link href="/" className="group flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
            <ChevronLeft className="h-5 w-5" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Exit Studio</span>
        </Link>
        <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-3 glass-premium">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Diagnostic Engine Online</span>
        </div>
      </nav>

      <main className="pt-24 h-screen flex flex-col container mx-auto max-w-[1400px]">
        {/* Main Content Area */}
        <div className="flex-1 grid lg:grid-cols-[1fr_400px] gap-12 items-center py-12">
          
          {/* Try-On Viewport */}
          <div className="relative h-full min-h-[500px] rounded-[48px] bg-black border border-white/10 overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-20 bg-[#080c16]"
                >
                  <div className="relative mb-8">
                     <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
                     <div className="relative h-32 w-32 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-primary" />
                     </div>
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter mb-4">Initialize Your Vision.</h2>
                  <p className="text-white/40 max-w-md leading-relaxed mb-10 font-bold uppercase text-xs tracking-widest">
                    To start the virtual try-on, enable your camera or upload a clear, front-facing photo of your face.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <button 
                      onClick={startCamera}
                      className="flex-1 h-16 rounded-2xl bg-white text-black font-black text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-white/90 transition-all active:scale-95 shadow-xl"
                    >
                      {isCalibrating ? "CALIBRATING..." : "START SCAN"}
                      <Scan className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 h-16 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
                    >
                      UPLOAD IMAGE
                      <Upload className="h-4 w-4 opacity-40" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0"
                >
                   {/* Background: Image or Video */}
                   {uploadedImage ? (
                     <div className="absolute inset-0 w-full h-full grayscale opacity-70">
                       <Image src={uploadedImage} alt="User" fill className="object-cover" />
                     </div>
                   ) : (
                     <video 
                       ref={videoRef}
                       autoPlay 
                       playsInline 
                       muted
                       className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 scale-x-[-1]"
                     />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-transparent to-transparent" />
                   
                   {/* 3D Eyewear Overlay */}
                   <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                      <div 
                        className="w-full h-full max-w-3xl opacity-90 transition-all duration-300"
                        style={{ 
                          transform: `scale(${scale}) translateY(${yOffset}px)`
                        }}
                      >
                        <Eyewear3D />
                      </div>
                   </div>

                   {/* Landmark HUD */}
                   <div className="absolute inset-0 z-10 pointer-events-none">
                      <div className="absolute h-[2px] w-full bg-primary/30 top-1/2 animate-[neural-pulse_4s_linear_infinite]" />
                      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[320px] border border-primary/30 rounded-[120px] bg-primary/5 backdrop-blur-[2px]" />
                   </div>
                   
                   {/* HUD Metadata */}
                   <div className="absolute bottom-10 left-10 flex items-center gap-4">
                      <div className="glass-premium px-4 py-2 border border-white/10 rounded-xl">
                        <p className="text-[10px] font-black uppercase text-white/40 mb-1">Optical Calibration</p>
                        <div className="flex items-center gap-2">
                           <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                           <span className="text-xs font-bold tracking-tight">
                             {uploadedImage ? "STATIC ANALYSIS ACTIVE" : "LIVE NEURAL SYNC"}
                           </span>
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Calibration Overlay */}
            <AnimatePresence>
              {isCalibrating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-[#080c16]/80 backdrop-blur-xl flex flex-col items-center justify-center p-12 overflow-hidden"
                >
                  <div className="absolute h-[500px] w-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                  <div className="relative space-y-8 text-center">
                    <div className="h-24 w-24 mx-auto rounded-full border-4 border-white/30 border-t-primary animate-spin" />
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter mb-2">Analyzing Geometry</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Aligning Precision AR Matrix</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Configuration Panel */}
          <div className="flex flex-col h-full space-y-8">
            <div className="glass-premium p-8 rounded-[32px] border border-white/10 shadow-xl space-y-8 flex-1">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-2">Current Frame</h3>
                <h2 className="text-2xl font-black tracking-tight">{frames[selectedFrame].name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-black bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase">{frames[selectedFrame].type}</span>
                  <span className="text-[10px] font-bold text-white/40 uppercase">{frames[selectedFrame].color}</span>
                </div>
              </div>

              {step === 2 && (
                <div className="space-y-6 pt-4 border-t border-white/5">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Micro-Calibration</h4>
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-bold uppercase text-white/40">
                            <span>Frame Scale</span>
                            <span>{Math.round(scale * 100)}%</span>
                         </div>
                         <input 
                           type="range" min="0.5" max="1.2" step="0.01" value={scale} 
                           onChange={(e) => setScale(parseFloat(e.target.value))}
                           className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                         />
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-bold uppercase text-white/40">
                            <span>Eye Alignment (Y)</span>
                            <span>{yOffset} px</span>
                         </div>
                         <input 
                           type="range" min="-120" max="120" step="1" value={yOffset} 
                           onChange={(e) => setYOffset(parseInt(e.target.value))}
                           className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                         />
                      </div>
                   </div>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Studio Collection</h4>
                <div className="grid gap-3">
                  {frames.map((f, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedFrame(i)}
                      className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${selectedFrame === i ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <div className="flex flex-col items-start">
                        <span className={`text-sm font-black tracking-tight ${selectedFrame === i ? 'text-white' : 'text-white/80'}`}>{f.name}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedFrame === i ? 'text-white/60' : 'text-white/30'}`}>{f.color}</span>
                      </div>
                      {selectedFrame === i ? (
                        <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                      ) : (
                        <Sparkles className="h-4 w-4 text-white/20 group-hover:text-primary transition-colors" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleCapture}
                className="h-14 rounded-2xl bg-white text-black font-black text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-xl"
              >
                <Download className="h-4 w-4" />
                CAPTURE
              </button>
              <button onClick={stopCamera} className="h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all">
                <RotateCcw className="h-4 w-4 opacity-40" />
                RESET
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
