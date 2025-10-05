import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MARS_ROVER_LEVELS } from '../constants';
import { Vector2D } from '../types';
import SpaceButton from './SpaceButton';

interface MarsRoverProps {
  onGoBack: () => void;
  onCollectRock: () => void; // Re-using for gem collect sound
  onCrash: () => void;
}

interface Meteor {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
}

// Game constants
const WORLD_WIDTH = 2000;
const GAME_HEIGHT = 600;
const ROVER_WIDTH = 60;
const ROVER_HEIGHT = 30;
const GEM_SIZE = 30;
const METEOR_SIZE_MIN = 20;
const METEOR_SIZE_MAX = 40;
const FACILITY_WIDTH = 120;
const FACILITY_HEIGHT = 120;

// Physics
const ACCELERATION = 0.08;
const FRICTION = 0.99;
const MAX_SPEED = 3.5;
const GRAVITY = 0.2;
const JUMP_FORCE = -7;

// Image assets
const BG_IMAGE = 'https://i.imgur.com/68q4mfm.png';
const ROVER_IMAGE = 'https://i.imgur.com/F4gMqcM.png';
const GEM_IMAGE = 'https://i.imgur.com/fWhiGhp.png';
const METEOR_IMAGE = 'https://i.imgur.com/TfdXZRW.png';
const FACILITY_IMAGE = 'https://i.imgur.com/4pyLEb8.png';


const MarsRover: React.FC<MarsRoverProps> = ({ onGoBack, onCollectRock, onCrash }) => {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [levelComplete, setLevelComplete] = useState(false);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [collectedGems, setCollectedGems] = useState<boolean[]>([]);
  const [gameWidth, setGameWidth] = useState(1000);

  const containerRef = useRef<HTMLDivElement>(null);
  const roverPos = useRef<Vector2D>({ x: 50, y: 100 });
  const roverVel = useRef<Vector2D>({ x: 0, y: 0 });
  const roverAngle = useRef(0);
  const isGrounded = useRef(false);
  const cameraX = useRef(0);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const gameLoopRef = useRef<number | null>(null);
  const meteorIdCounter = useRef(0);
  const [, forceUpdate] = useState(false);

  const levelData = currentLevel !== null ? MARS_ROVER_LEVELS[currentLevel] : null;

  const resetRover = useCallback(() => {
    if (!levelData) return;
    const initialGems = new Array(levelData.gems.length).fill(false);
    setMeteors([]);
    setCollectedGems(initialGems);
    roverPos.current = { x: 50, y: levelData.terrain[0].y - ROVER_HEIGHT };
    roverVel.current = { x: 0, y: 0 };
    roverAngle.current = 0;
    cameraX.current = 0;
    isGrounded.current = false;
    setLevelComplete(false); // Also reset level complete state
  }, [levelData]);


  const startGame = useCallback((level: number) => {
    setCurrentLevel(level);
    setLevelComplete(false);
  }, []);
  
  useEffect(() => {
      if(currentLevel !== null) {
          resetRover();
      }
  }, [currentLevel, resetRover]);


  const gameLoop = useCallback(() => {
    if (!levelData || levelComplete) return;

    // --- Meteor Logic ---
    if (Math.random() < levelData.meteorFrequency) {
        const newSize = Math.random() * (METEOR_SIZE_MAX - METEOR_SIZE_MIN) + METEOR_SIZE_MIN;
        setMeteors(prev => [...prev, {
            id: meteorIdCounter.current++,
            x: cameraX.current + Math.random() * gameWidth,
            y: -newSize,
            size: newSize,
            speed: Math.random() * 2 + 2,
        }]);
    }
    setMeteors(prev => prev.map(m => ({ ...m, y: m.y + m.speed })).filter(m => m.y < GAME_HEIGHT));

    // --- Input & Horizontal Movement ---
    if (keysPressed.current['ArrowRight']) roverVel.current.x += ACCELERATION;
    if (keysPressed.current['ArrowLeft']) roverVel.current.x -= ACCELERATION;
    roverVel.current.x = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, roverVel.current.x * FRICTION));
    roverPos.current.x += roverVel.current.x;

    // --- Vertical Movement & Gravity ---
    if (keysPressed.current['ArrowUp'] && isGrounded.current) {
        roverVel.current.y = JUMP_FORCE;
        isGrounded.current = false;
    }
    roverVel.current.y += GRAVITY;
    roverPos.current.y += roverVel.current.y;
    
    // --- Terrain Collision ---
    isGrounded.current = false;
    let groundAngle = 0;
    const roverCenter = roverPos.current.x + ROVER_WIDTH / 2;

    for (let i = 0; i < levelData.terrain.length - 1; i++) {
        const p1 = levelData.terrain[i];
        const p2 = levelData.terrain[i+1];
        if (roverCenter >= p1.x && roverCenter <= p2.x) {
            const ratio = (roverCenter - p1.x) / (p2.x - p1.x);
            const groundHeight = p1.y + (p2.y - p1.y) * ratio;
            
            if (roverPos.current.y + ROVER_HEIGHT >= groundHeight && roverVel.current.y >= 0) {
                roverPos.current.y = groundHeight - ROVER_HEIGHT;
                roverVel.current.y = 0;
                isGrounded.current = true;
                groundAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            }
            break;
        }
    }
    roverAngle.current = isGrounded.current ? groundAngle : roverAngle.current * 0.95;

    // --- Gem Collection ---
    const roverCenterX = roverPos.current.x + ROVER_WIDTH / 2;
    const roverCenterY = roverPos.current.y + ROVER_HEIGHT / 2;

    levelData.gems.forEach((gem, index) => {
        if (!collectedGems[index]) {
            const dx = roverCenterX - gem.x;
            const dy = roverCenterY - gem.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < (ROVER_WIDTH / 2 + GEM_SIZE / 2) * 0.8) { // 80% overlap needed
                setCollectedGems(prev => {
                    const newCollected = [...prev];
                    newCollected[index] = true;
                    return newCollected;
                });
                onCollectRock();
            }
        }
    });

    // --- Boundaries & Crash checks ---
    if (roverPos.current.x < 0) roverPos.current.x = 0;
    if (roverPos.current.y > GAME_HEIGHT + ROVER_HEIGHT * 2) {
        onCrash();
        resetRover();
        return;
    }

    const roverRect = { x: roverPos.current.x, y: roverPos.current.y, width: ROVER_WIDTH, height: ROVER_HEIGHT };
    for (const meteor of meteors) {
        if (roverRect.x < meteor.x + meteor.size && roverRect.x + roverRect.width > meteor.x &&
            roverRect.y < meteor.y + meteor.size && roverRect.y + roverRect.height > meteor.y) {
            onCrash();
            resetRover();
            return;
        }
    }

    // --- Win Condition Check ---
    const allGemsCollected = collectedGems.every(g => g);
    if (allGemsCollected) {
        const facilityStartX = WORLD_WIDTH - FACILITY_WIDTH;
        if (roverPos.current.x + ROVER_WIDTH / 2 >= facilityStartX) {
            setLevelComplete(true);
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
            return; // Stop the loop
        }
    }

    // --- Camera Update ---
    cameraX.current = Math.max(0, Math.min(WORLD_WIDTH - gameWidth, roverPos.current.x - gameWidth / 2 + ROVER_WIDTH/2));
    
    forceUpdate(p => !p);
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [levelData, collectedGems, onCollectRock, onCrash, resetRover, meteors, gameWidth, levelComplete]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        setGameWidth(width);
      }
    });
    resizeObserver.observe(container);

    setGameWidth(container.clientWidth);

    return () => resizeObserver.disconnect();
  }, [currentLevel]);

  useEffect(() => {
    if (currentLevel !== null && !levelComplete) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [currentLevel, gameLoop, levelComplete]);
  
  const backToMenu = useCallback(() => {
      setCurrentLevel(null);
      setMeteors([]);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
  }, []);

  const goToNextLevel = useCallback(() => {
      if(currentLevel !== null && currentLevel < MARS_ROVER_LEVELS.length - 1) {
          startGame(currentLevel + 1);
      } else {
          onGoBack();
      }
  }, [currentLevel, startGame, onGoBack]);

  if (currentLevel === null) {
    return (
      <section className="bg-slate-900/90 border-2 border-orange-500 p-6 mt-7 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] flex flex-col items-center">
        <h3 className="text-orange-400 text-3xl text-center">Mars Macerası</h3>
        <p className="text-center mt-2 text-yellow-300 font-bold">Bir seviye seçerek göreve başla!</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
          {MARS_ROVER_LEVELS.map((_, index) => (
            <SpaceButton key={index} variant="secondary" onClick={() => startGame(index)}>
              {index + 1}
            </SpaceButton>
          ))}
        </div>
        <SpaceButton variant="info" className="mt-8" onClick={onGoBack}>Ana Menüye Dön</SpaceButton>
      </section>
    );
  }

  const terrainPath = levelData ? "M" + levelData.terrain.map(p => `${p.x},${p.y}`).join(" L") + ` L${WORLD_WIDTH},${GAME_HEIGHT} L0,${GAME_HEIGHT} Z` : "";
  const gemsLeft = collectedGems.filter(g => !g).length;
  const allGemsCollected = gemsLeft === 0;

  const lastTerrainPoint = levelData ? levelData.terrain[levelData.terrain.length - 1] : { x: WORLD_WIDTH, y: GAME_HEIGHT / 2 };
  const facilityY = lastTerrainPoint.y - FACILITY_HEIGHT;
  const facilityX = WORLD_WIDTH - FACILITY_WIDTH;

  return (
    <section className="bg-slate-900/90 border-2 border-orange-500 p-6 mt-7 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] flex flex-col items-center w-full">
      <div className="flex justify-between w-full items-center mb-4 flex-wrap gap-2">
        <h3 className="text-orange-400 text-3xl">Seviye {currentLevel + 1}</h3>
        <p className="text-yellow-300 text-2xl font-bold">Kalan Kristal: {gemsLeft}</p>
      </div>
      <div
        ref={containerRef}
        className="relative rounded-lg border-2 border-gray-500 overflow-hidden w-full"
        style={{ height: GAME_HEIGHT }}
      >
        <div 
          className="absolute top-0 left-0"
          style={{
              width: WORLD_WIDTH,
              height: GAME_HEIGHT,
              transform: `translateX(-${cameraX.current}px)`,
              background: `url(${BG_IMAGE})`,
              backgroundSize: 'cover'
          }}
        >
          <svg width={WORLD_WIDTH} height={GAME_HEIGHT} className="absolute top-0 left-0">
            <defs>
                <linearGradient id="terrainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#873e1c" />
                    <stop offset="100%" stopColor="#C25B25" />
                </linearGradient>
            </defs>
            <path d={terrainPath} fill="url(#terrainGradient)" stroke="#4d230f" strokeWidth="3" />
          </svg>

          {meteors.map(meteor => (
              <div key={`met-${meteor.id}`} className="absolute" style={{left: meteor.x, top: meteor.y, width: meteor.size, height: meteor.size,}}>
                <img src={METEOR_IMAGE} alt="Meteor" className="w-full h-full animate-spin [animation-duration:3s]" />
              </div>
          ))}
          
          <div className="absolute" style={{ left: roverPos.current.x, top: roverPos.current.y, width: ROVER_WIDTH, height: ROVER_HEIGHT, transform: `rotate(${roverAngle.current}rad)`, transformOrigin: 'center center' }}>
            <img src={ROVER_IMAGE} alt="Mars Rover" className="w-full h-full" />
          </div>

          {levelData?.gems.map((gem, index) =>
            !collectedGems[index] && (
              <div key={index} className="absolute animate-pulse" style={{ left: gem.x - GEM_SIZE / 2, top: gem.y - GEM_SIZE / 2, width: GEM_SIZE, height: GEM_SIZE }}>
                <img src={GEM_IMAGE} alt="Kristal" className="w-full h-full" />
              </div>
            )
          )}
          <img 
            src={FACILITY_IMAGE}
            alt="Mars Tesisi"
            className="absolute"
            style={{
                left: facilityX,
                top: facilityY,
                width: FACILITY_WIDTH,
                height: FACILITY_HEIGHT,
            }}
          />
        </div>
        {allGemsCollected && !levelComplete && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center p-4 rounded-lg bg-black/70 z-20 animate-pulse">
                <h4 className="text-xl text-green-400 font-bold">Hedef Güncellendi!</h4>
                <p className="text-yellow-300">Tüm kristalleri topladın! Şimdi haritanın sonundaki üsse geri dön.</p>
            </div>
        )}
        {levelComplete && (
             <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/70 z-10">
                <h4 className="text-5xl text-green-400 font-bold">Seviye Tamamlandı!</h4>
                <div className="flex gap-4 mt-8">
                    <SpaceButton variant="secondary" onClick={backToMenu}>Seviye Seçimi</SpaceButton>
                    {currentLevel < MARS_ROVER_LEVELS.length - 1 ? (
                        <SpaceButton variant="primary" onClick={goToNextLevel}>Sıradaki Seviye</SpaceButton>
                    ) : (
                        <SpaceButton variant="primary" onClick={onGoBack}>Harika! Ana Menü</SpaceButton>
                    )}
                </div>
            </div>
        )}
      </div>
       <SpaceButton variant="info" className="mt-6" onClick={backToMenu}>Seviye Seçimine Dön</SpaceButton>
    </section>
  );
};

export default MarsRover;