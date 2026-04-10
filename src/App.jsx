import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Rocket, 
  Satellite, 
  Orbit, 
  Globe, 
  Mail, 
  ExternalLink,
  Crosshair,
  Wifi,
  Target,
  Trophy,
  Zap,
  ShieldAlert
} from 'lucide-react';

// --- CUSTOM BRAND ICONS (Since Lucide removed them) ---
const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.5-1.42 6.5-7a4.6 4.6 0 0 0-1.39-3.2 4.2 4.2 0 0 0-.1-3.2s-1.14-.36-3.7 1.4a13.3 13.3 0 0 0-7 0c-2.56-1.76-3.7-1.4-3.7-1.4a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 2 8.98c0 5.58 3.36 6.65 6.5 7a4.8 4.8 0 0 0-1 3.02V22"/>
    <path d="M9 20c-5 1.5-5-2.5-7-3"/>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// --- INTERACTIVE GAMIFIED STARFIELD ---
const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let shootingStars = [];
    let ripples = [];
    let asteroids = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 2000); 
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          speed: Math.random() * 0.2 + 0.05,
          opacity: Math.random(),
          flickerRate: Math.random() * 0.02
        });
      }
    };

    const spawnAsteroid = () => {
      asteroids.push({
        x: Math.random() < 0.5 ? -50 : canvas.width + 50,
        y: Math.random() * (canvas.height / 2), // Keep them in the upper half mostly
        size: Math.random() * 15 + 10,
        speedX: (Math.random() * 1 + 0.5) * (Math.random() < 0.5 ? 1 : -1),
        speedY: Math.random() * 0.5 + 0.2,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.05
      });
    };

    const draw = () => {
      ctx.fillStyle = '#020205'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.width/1.5
      );
      gradient.addColorStop(0, 'rgba(30, 10, 60, 0.15)'); 
      gradient.addColorStop(0.5, 'rgba(10, 30, 80, 0.05)'); 
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Warp Ripples (Click effect)
      for (let i = ripples.length - 1; i >= 0; i--) {
        let r = ripples[i];
        r.radius += 10;
        r.alpha -= 0.02;
        if (r.alpha <= 0) {
          ripples.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 229, 255, ${r.alpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Draw stars
      stars.forEach(star => {
        star.y -= star.speed;
        star.opacity += star.flickerRate;

        if (star.opacity > 1 || star.opacity < 0.1) star.flickerRate *= -1;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 220, 255, ${star.opacity})`;
        ctx.fill();
      });

      // Shooting stars
      if (Math.random() < 0.01) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: 0,
          length: Math.random() * 100 + 50,
          speed: Math.random() * 10 + 10,
          opacity: 1
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        let ss = shootingStars[i];
        ss.x -= ss.speed;
        ss.y += ss.speed;
        ss.opacity -= 0.02;

        if (ss.opacity <= 0) {
          shootingStars.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.moveTo(ss.x, ss.y);
          ctx.lineTo(ss.x + ss.length, ss.y - ss.length);
          ctx.strokeStyle = `rgba(0, 229, 255, ${ss.opacity})`; 
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Asteroids
      if (Math.random() < 0.005 && asteroids.length < 5) spawnAsteroid();

      for (let i = asteroids.length - 1; i >= 0; i--) {
        let ast = asteroids[i];
        ast.x += ast.speedX;
        ast.y += ast.speedY;
        ast.rotation += ast.rotSpeed;

        if (ast.y > canvas.height + 50 || ast.x < -100 || ast.x > canvas.width + 100) {
          asteroids.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(ast.x, ast.y);
        ctx.rotate(ast.rotation);
        
        ctx.beginPath();
        ctx.moveTo(-ast.size, -ast.size/2);
        ctx.lineTo(-ast.size/2, -ast.size);
        ctx.lineTo(ast.size/2, -ast.size/1.5);
        ctx.lineTo(ast.size, ast.size/2);
        ctx.lineTo(ast.size/2, ast.size);
        ctx.lineTo(-ast.size/2, ast.size/1.2);
        ctx.closePath();
        
        ctx.fillStyle = '#1a1a2e'; // Dark rock
        ctx.fill();
        ctx.strokeStyle = '#00e5ff'; // Glowing edge
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      let hitAsteroid = false;

      // Check if clicked on asteroid
      for (let i = asteroids.length - 1; i >= 0; i--) {
        const ast = asteroids[i];
        const dist = Math.hypot(clickX - ast.x, clickY - ast.y);
        if (dist <= ast.size * 1.5) {
          // Destroy asteroid
          asteroids.splice(i, 1);
          hitAsteroid = true;
          // Create big ripple
          ripples.push({ x: clickX, y: clickY, radius: 0, alpha: 1 });
          ripples.push({ x: clickX, y: clickY, radius: 20, alpha: 0.8 });
          
          window.dispatchEvent(new CustomEvent('asteroid-destroyed'));
          break;
        }
      }

      if (!hitAsteroid) {
        // Just a warp ripple
        ripples.push({ x: clickX, y: clickY, radius: 0, alpha: 0.8 });
        window.dispatchEvent(new CustomEvent('warp-fired'));
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousedown', handleCanvasClick);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousedown', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-auto" />;
};


// --- MAIN PORTFOLIO ---
export default function App() {
  const [warpCharge, setWarpCharge] = useState(0);
  const [hasScanned, setHasScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // Gamification State
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [activeToast, setActiveToast] = useState(null);
  const toastTimeout = useRef(null);

  const showToast = useCallback((title, points, isLevelUp = false) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setActiveToast({ title, points, isLevelUp, id: Date.now() });
    toastTimeout.current = setTimeout(() => setActiveToast(null), 3500);
  }, []);

  const gainXp = useCallback((amount) => {
    setXp(prev => {
      const newXp = prev + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      if (newLevel > Math.floor(prev / 100) + 1) {
        setTimeout(() => showToast(`LEVEL UP: RANK ${newLevel}`, 0, true), 500);
        setLevel(newLevel);
      }
      return newXp;
    });
  }, [showToast]);

  const unlockAchievement = useCallback((id, title, xpReward) => {
    if (!achievements.includes(id)) {
      setAchievements(prev => [...prev, id]);
      showToast(title, xpReward);
      gainXp(xpReward);
    }
  }, [achievements, gainXp, showToast]);

  // Event Listeners for Game Mechanics
  useEffect(() => {
    const handleWarp = () => gainXp(1);
    const handleAsteroid = () => {
      gainXp(15);
      unlockAchievement('first_asteroid', 'Space Debris Cleared', 25);
    };
    
    window.addEventListener('warp-fired', handleWarp);
    window.addEventListener('asteroid-destroyed', handleAsteroid);
    return () => {
      window.removeEventListener('warp-fired', handleWarp);
      window.removeEventListener('asteroid-destroyed', handleAsteroid);
    };
  }, [gainXp, unlockAchievement]);

  // Charge warp drive & scroll achievements
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = Math.min(100, Math.max(0, (scrolled / max) * 100));
      setWarpCharge(percentage);

      if (percentage > 25) unlockAchievement('dossier_reach', 'Sector 1 Reached', 20);
      if (percentage > 60) unlockAchievement('archives_reach', 'Deep Space Reached', 30);
      if (percentage > 95) unlockAchievement('comms_reach', 'Comms Established', 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [unlockAchievement]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeepScan = () => {
    if (hasScanned || isScanning) return;
    setIsScanning(true);
    
    // Simulate scan delay
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      unlockAchievement('deep_scan', 'Biometrics Analyzed', 40);
    }, 2000);
  };

  const projects = [
    {
      id: "proj_1",
      name: "Sector: Nebula-9",
      title: "Space Weather Impact Modelling System",
      desc: "Interactive 3D visualization of space weather conditions and their effects on satellite operations, suggeting optimal recommended actions to mitigate risks.",
      tech: ["React.js", "Three.js", "Tailwind CSS", "Python Flask"],
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: "proj_2",
      name: "Sector: Orion-V",
      title: "Full-Stack Blog Application",
      desc: "A full stack blogging platform with CRUD functionality along with likes, comments and filtering capabilities.",
      tech: ["React.js", "Tailwind CSS", "Java", "MySQL"],
      color: "from-purple-500 to-pink-600"
    },
    {
      id: "proj_3",
      name: "Sector: Helios Prime",
      title: "Weather Based Outfit Recommendation System",
      desc: "Recommendation system that suggests outfits based on current weather conditions and user preferences, utilizing a machine learning model trained on a large dataset of weather and fashion data.",
      tech: ["Tailwind CSS", "Python Flask"],
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 cursor-crosshair">
      <Starfield />

      {/* --- GAMIFICATION HUD (Top Left) --- */}
      <div className="fixed top-6 left-6 md:left-12 z-50 flex flex-col gap-3 pointer-events-none">
        
        {/* Level / XP Plate */}
        <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 p-3 rounded-lg flex items-center gap-4 shadow-[0_0_20px_rgba(0,229,255,0.1)] w-56">
          <div className="relative flex items-center justify-center w-10 h-10 bg-cyan-950/50 rounded-full border border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.4)]">
             <span className="font-black text-cyan-300 text-lg">{level}</span>
             <div className="absolute -bottom-2 -right-2 bg-cyan-500 text-black text-[8px] font-bold px-1 rounded">LVL</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between font-mono text-[10px] text-cyan-400 mb-1">
              <span>Experience</span>
              <span>{xp % 100}/100</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden w-full">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-300 shadow-[0_0_10px_#00e5ff] transition-all duration-500 ease-out"
                style={{ width: `${xp % 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Warp Drive Charge */}
        <div className="bg-black/40 backdrop-blur-md border border-cyan-500/20 px-3 py-2 rounded-lg flex items-center gap-3 w-56">
          <Orbit className="w-4 h-4 text-cyan-500 animate-[spin_4s_linear_infinite]" />
          <div className="flex-1">
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-cyan-500 block mb-1">Warp Drive</span>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden w-full">
              <div 
                className="h-full bg-cyan-500 transition-all duration-300"
                style={{ width: `${warpCharge}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- TOAST NOTIFICATIONS (Bottom Right) --- */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${activeToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`bg-black/80 backdrop-blur-lg border p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center gap-4 ${activeToast?.isLevelUp ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : 'border-cyan-500/50'}`}>
          {activeToast?.isLevelUp ? (
            <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
          ) : (
            <Trophy className="w-6 h-6 text-cyan-400" />
          )}
          <div className="flex flex-col pr-4">
             <span className={`font-mono text-[10px] uppercase tracking-widest ${activeToast?.isLevelUp ? 'text-yellow-500' : 'text-slate-400'}`}>
               {activeToast?.isLevelUp ? 'SYSTEM UPGRADE' : 'ACHIEVEMENT UNLOCKED'}
             </span>
             <span className={`font-bold ${activeToast?.isLevelUp ? 'text-yellow-300 text-lg' : 'text-white'}`}>
               {activeToast?.title}
             </span>
          </div>
          {activeToast?.points > 0 && (
            <div className="font-mono text-sm font-bold text-cyan-400 ml-auto border-l border-white/10 pl-4">
              +{activeToast.points} XP
            </div>
          )}
        </div>
      </div>

      {/* FLIGHT PATH LINE */}
      <div className="absolute top-0 left-6 md:left-[17rem] w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent z-10 hidden lg:block">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-16 bg-cyan-400 rounded-full shadow-[0_0_15px_#00e5ff] transition-all duration-300"
          style={{ top: `${warpCharge}%` }}
        />
      </div>

      <main className="relative z-10 flex flex-col w-full pl-0 lg:pl-[17rem]">
        
        {/* --- 1. HERO: THE ECLIPSE --- */}
        <section id="hero" className="min-h-screen w-full flex flex-col justify-center relative px-6 md:px-12 overflow-hidden">
          
          <div className="absolute top-1/2 left-[70%] md:left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] md:w-[60vw] max-w-[800px] aspect-square rounded-full bg-[#020205] shadow-[0_0_150px_rgba(138,43,226,0.5),inset_0_0_80px_rgba(0,0,0,1)] border border-white/5 z-0" />
          
          <div className="relative z-10 max-w-4xl pt-20 lg:pt-0">
            <div className="flex items-center gap-3 mb-6">
              <Crosshair className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="font-mono text-xs tracking-[0.3em] text-cyan-400 uppercase">Coordinates Locked</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 uppercase">
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                Monazzah Shaheen
              </span>
            </h1>
            
            <p className="max-w-xl text-lg text-slate-400 font-light leading-relaxed mb-10 border-l-2 border-purple-500/50 pl-4 bg-gradient-to-r from-purple-500/10 to-transparent py-2 pointer-events-none">
              I am a developer navigating the digital universe, building scalable and fun web applications. With skills in full-stack development and data analysis, I turn ideas into interactive experiences. <br/>
              <span className="text-cyan-400 text-sm mt-2 block font-mono">Mission: Destroy floating asteroids by clicking them to earn XP.</span>
            </p>

            <button onClick={() => scrollTo('dossier')} className="group relative flex items-center gap-4 px-8 py-4 bg-transparent overflow-hidden border border-cyan-500/30 hover:border-cyan-400 transition-colors pointer-events-auto cursor-pointer">
              <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform" />
              <span className="font-mono text-sm tracking-widest uppercase text-cyan-300 relative z-10">Initiate Launch Sequence</span>
              <Rocket className="w-4 h-4 text-cyan-300 relative z-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
            </button>
          </div>
        </section>

        {/* --- 2. DOSSIER: INTERACTIVE SCANNER --- */}
        <section id="dossier" className="min-h-screen w-full flex items-center py-24 px-6 md:px-12 relative pointer-events-none">
          <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center z-10 pointer-events-auto">
            
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Clickable Radar Game */}
              <div 
                onClick={handleDeepScan}
                className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full border bg-cyan-950/10 shadow-[0_0_30px_rgba(0,229,255,0.1)] overflow-hidden flex items-center justify-center transition-all duration-500 ${hasScanned ? 'border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.2)]' : isScanning ? 'border-cyan-400 cursor-wait' : 'border-cyan-500/30 cursor-pointer hover:border-cyan-400 hover:scale-105'}`}
              >
                <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-12 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-20 rounded-full border border-cyan-500/20" />
                <div className="absolute w-full h-[1px] bg-cyan-500/30" />
                <div className="absolute h-full w-[1px] bg-cyan-500/30" />
                
                {/* Sweeping Scanner line */}
                <div className={`absolute inset-0 rounded-full ${isScanning ? 'animate-[spin_1s_linear_infinite]' : hasScanned ? 'animate-[spin_8s_linear_infinite] opacity-50' : 'animate-[spin_4s_linear_infinite]'}`}
                     style={{ background: 'conic-gradient(from 0deg, transparent 75%, rgba(0,229,255,0.4) 100%)' }}>
                  <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />
                </div>

                <div className={`w-3 h-3 rounded-full relative z-10 transition-colors ${hasScanned ? 'bg-green-400 shadow-[0_0_15px_#4ade80]' : 'bg-cyan-400 shadow-[0_0_10px_#00e5ff]'}`} />
                
                {hasScanned && (
                  <>
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                    <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                  </>
                )}

                {/* Overlay Text */}
                {!hasScanned && !isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity">
                     <span className="font-mono text-xs text-white uppercase tracking-widest text-center px-4">Click to Initiate<br/>Deep Scan</span>
                  </div>
                )}
              </div>
            </div>

            <div className={`space-y-8 bg-black/40 p-8 border border-white/5 backdrop-blur-md rounded-xl relative overflow-hidden transition-all duration-700 ${hasScanned ? 'opacity-100 translate-x-0' : 'opacity-10 translate-x-10'}`}>
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-2xl font-light text-white uppercase tracking-widest flex items-center gap-3">
                  <Satellite className="w-6 h-6 text-purple-400" /> Biometric Scan
                </h2>
                <span className={`font-mono text-[10px] uppercase ${hasScanned ? 'text-green-400 animate-pulse' : 'text-slate-500'}`}>
                  {hasScanned ? 'DATA DECRYPTED' : 'ENCRYPTED'}
                </span>
              </div>
              
              <div className="space-y-6 font-mono text-sm text-slate-400">
                <p>
                  <strong className="text-cyan-400">STATUS:</strong> Active Developer<br/>
                  <strong className="text-cyan-400">SPECIALTY:</strong> Full-Stack Engineering<br/>
                  <strong className="text-cyan-400">ORIGIN:</strong> Earth (Sol System)
                </p>
                <p className="leading-relaxed">
                  Log Entry: I build scalable systems that blend functionality with engaging user experiences. With a strong foundation in both frontend and backend technologies, I create applications that are fun and also solve real-world problems. Always exploring new technologies, I aim to weave solutions that are efficient and fun to use.
                </p>
                
                <div className="pt-4">
                  <h3 className="text-white mb-4 uppercase tracking-widest text-xs">Primary Tech Modules</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Java', 'Python', 'JavaScript', 'React', 'TypeScript', 'HTML','CSS', 'Three.js', 'SQL', 'PostgreSQL', 'Docker', 'Git', 'GitHub', 'VS Code', 'Eclipse', 'Power BI', 'Postman', 'Spring', 'REST APIs'].map(skill => (
                      <span key={skill} className="px-3 py-1 bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs rounded-sm hover:bg-cyan-500/20 hover:border-cyan-400 transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- 3. ARCHIVES: PLANETARY DISCOVERY --- */}
        <section id="archives" className="min-h-screen w-full py-24 px-6 md:px-12 relative pointer-events-none">
          <div className="max-w-6xl w-full mx-auto z-10 relative pointer-events-auto">
            
            <div className="mb-16">
              <span className="font-mono text-xs text-cyan-500 tracking-[0.2em] uppercase flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4" /> Starmap Database
              </span>
              <h2 className="text-4xl font-light text-white tracking-tight uppercase">Explored <span className="font-bold">Sectors</span></h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 md:gap-6 lg:gap-12 pt-10">
              {projects.map((proj, idx) => (
                <div 
                  key={idx} 
                  onMouseEnter={() => unlockAchievement(`scan_${proj.id}`, `Scanned: ${proj.name}`, 15)}
                  className="group flex flex-col items-center text-center relative"
                >
                  
                  {/* Planet Visual */}
                  <div className="relative w-40 h-40 mb-8 flex justify-center items-center cursor-pointer" onClick={() => unlockAchievement(`land_${proj.id}`, `Landed on ${proj.name}`, 50)}>
                    <div className="absolute inset-[-20px] rounded-full border border-dashed border-white/20 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-[-40px] rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
                    
                    {/* Targeting reticle on hover */}
                    <div className="absolute inset-[-10px] rounded-full border-2 border-transparent group-hover:border-red-500/50 scale-150 group-hover:scale-100 transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none" />
                    
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${proj.color} shadow-[inset_-15px_-15px_30px_rgba(0,0,0,0.5),0_0_30px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-500 flex items-center justify-center`}>
                      <div className="w-full h-full rounded-full bg-black/20 mix-blend-overlay" />
                    </div>
                  </div>

                  {/* Project Data */}
                  <div className="bg-[#05050A]/80 border border-white/10 p-6 rounded-lg w-full backdrop-blur-sm group-hover:border-cyan-500/40 transition-colors relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#020205] px-3 font-mono text-[10px] text-cyan-400 border border-cyan-500/30 rounded-full whitespace-nowrap">
                      {proj.name}
                    </div>
                    <h3 className="text-xl font-medium text-white mb-3 mt-2">{proj.title}</h3>
                    <p className="text-sm text-slate-400 mb-6">{proj.desc}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {proj.tech.map(t => (
                        <span key={t} className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                    <button onClick={() => unlockAchievement(`land_${proj.id}`, `Landed on ${proj.name}`, 50)} className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 hover:text-white transition-colors uppercase tracking-widest border-b border-cyan-400/30 hover:border-white pb-1">
                      Land on Planet <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* --- 4. COMMS: TRANSMISSION RELAY --- */}
        <section id="comms" className="w-full py-32 px-6 md:px-12 relative overflow-hidden pointer-events-none">
          <div className="max-w-4xl mx-auto text-center relative z-10 bg-gradient-to-b from-cyan-900/10 to-transparent p-12 border-t border-cyan-500/20 rounded-t-[3rem] pointer-events-auto">
            
            <div className="w-20 h-20 mx-auto bg-cyan-950/50 rounded-full border border-cyan-500/50 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
              <Wifi className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 uppercase tracking-widest">Comm <span className="font-bold">Relay</span></h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 font-mono text-sm leading-relaxed">
              &gt; SYSTEM WAITING FOR INPUT...<br/>
              Ready to embark on a new mission. If you have an objective that requires technical precision and innovative vision, transmit your coordinates to my comms array.
            </p>
            
            <a 
              href="mailto:monazzahshaheen2016@gmail.com" 
              onClick={() => unlockAchievement('message_sent', 'Message Transmitted', 100)}
              className="inline-flex items-center gap-3 px-10 py-5 bg-cyan-500/10 border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all duration-300 uppercase tracking-[0.2em] font-bold text-sm shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_40px_rgba(0,229,255,0.6)]"
            >
              <Mail className="w-5 h-5" /> Send Transmission
            </a>

            <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-center gap-8">
              <a href="https://github.com/monazzahshaheen" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-400 border border-transparent transition-all">
                  <GithubIcon className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
                </div>
                <span className="font-mono text-[10px] text-slate-500 uppercase">GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/monazzahshaheen/" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-400 border border-transparent transition-all">
                  <LinkedinIcon className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
                </div>
                <span className="font-mono text-[10px] text-slate-500 uppercase">LinkedIn</span>
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}