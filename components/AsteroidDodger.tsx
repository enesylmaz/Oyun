import React, { useState, useEffect, useRef, useCallback } from 'react';
import SpaceButton from './SpaceButton';

interface Asteroid {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    imageUrl: string;
}

interface AsteroidDodgerProps {
    onGoBack: () => void;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const PLAYER_SPEED = 10;

const ASTEROID_IMAGES = [
    'https://i.imgur.com/aMlYiwZ.png',
    'https://i.imgur.com/TfdXZRW.png',
    'https://i.imgur.com/nUhkKpm.png'
];

const PLAYER_IMAGE = 'https://cdnb.artstation.com/p/assets/images/images/008/895/207/original/almir-sharifullin-1st-spaceship.gif?1515963945';


const AsteroidDodger: React.FC<AsteroidDodgerProps> = ({ onGoBack }) => {
    const [playerPos, setPlayerPos] = useState({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2 });
    const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    const keysPressed = useRef<{ [key: string]: boolean }>({});
    // FIX: Initialize useRef with a value (null) and provide a compatible type.
    const gameLoopRef = useRef<number | null>(null);
    const asteroidIdCounter = useRef(0);

    const resetGame = useCallback(() => {
        setPlayerPos({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2 });
        setAsteroids([]);
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        asteroidIdCounter.current = 0;
    }, []);

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
        const gameLoop = () => {
            if (!isPlaying || gameOver) return;

            setPlayerPos(prevPos => {
                let newX = prevPos.x;
                if (keysPressed.current['ArrowLeft']) newX -= PLAYER_SPEED;
                if (keysPressed.current['ArrowRight']) newX += PLAYER_SPEED;
                return { x: Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, newX)) };
            });

            setAsteroids(prevAsteroids => {
                const updated = prevAsteroids
                    .map(a => ({ ...a, y: a.y + a.speed }))
                    .filter(a => a.y < GAME_HEIGHT);
                
                if (Math.random() < 0.05 + (score / 10000) ) { // Difficulty increases with score
                    const newSize = Math.random() * 40 + 25;
                    updated.push({
                        id: asteroidIdCounter.current++,
                        x: Math.random() * (GAME_WIDTH - newSize),
                        y: -newSize,
                        size: newSize,
                        speed: Math.random() * 3 + 2,
                        imageUrl: ASTEROID_IMAGES[Math.floor(Math.random() * ASTEROID_IMAGES.length)]
                    });
                }
                return updated;
            });
            
            setScore(s => s + 1);
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };

        if (isPlaying && !gameOver) {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }

        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [isPlaying, gameOver, score]);
    
    useEffect(() => {
        const playerRect = { x: playerPos.x, y: GAME_HEIGHT - PLAYER_HEIGHT, width: PLAYER_WIDTH, height: PLAYER_HEIGHT };
        for (const asteroid of asteroids) {
            const asteroidRect = { x: asteroid.x, y: asteroid.y, width: asteroid.size, height: asteroid.size };
            if (
                playerRect.x < asteroidRect.x + asteroidRect.width &&
                playerRect.x + playerRect.width > asteroidRect.x &&
                playerRect.y < asteroidRect.y + asteroidRect.height &&
                playerRect.y + playerRect.height > asteroidRect.y
            ) {
                setIsPlaying(false);
                setGameOver(true);
                break;
            }
        }
    }, [playerPos, asteroids]);
    
    const PlayerShip = () => (
        <div style={{ position: 'absolute', left: playerPos.x, bottom: 0, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }}>
             <img 
                src={PLAYER_IMAGE} 
                alt="Oyuncu Gemisi" 
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );

    return (
        <section className="bg-slate-900/90 border-2 border-red-500 p-6 mt-7 rounded-xl shadow-[0_0_15px_rgba(255,84,84,0.3)] flex flex-col items-center">
            <h3 className="text-red-400 text-3xl text-center">Asteroit Tarlası</h3>
            <p className="text-center mt-2 text-yellow-300 font-bold min-h-[24px]">Ok tuşlarını kullanarak asteroitlerden kaç!</p>
            
            <div 
                className="relative bg-black mt-4 rounded-lg border-2 border-gray-500 overflow-hidden" 
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT, backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)', backgroundSize: '300px' }}
                aria-label="Asteroit Tarlası oyun alanı"
            >
                {!gameOver ? (
                    <>
                        <div className="absolute top-2 left-2 text-white text-2xl font-bold z-10 [text-shadow:_1px_1px_2px_black]" aria-live="polite">
                           Puan: {Math.floor(score / 10)}
                        </div>
                        <PlayerShip />
                        {asteroids.map(a => (
                            <img 
                                key={a.id}
                                src={a.imageUrl}
                                alt="asteroit"
                                className="absolute"
                                style={{
                                    left: a.x,
                                    top: a.y,
                                    width: a.size,
                                    height: a.size,
                                    transform: `rotate(${a.id * 35}deg)`
                                }}
                                role="presentation"
                            />
                        ))}
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/70">
                        <h4 className="text-5xl text-red-500 font-bold">Oyun Bitti!</h4>
                        <p className="text-3xl text-white mt-4">Puan: {Math.floor(score / 10)}</p>
                        <div className="flex gap-4 mt-8">
                            <SpaceButton variant="primary" onClick={resetGame}>Yeniden Oyna</SpaceButton>
                            <SpaceButton variant="secondary" onClick={onGoBack}>Ana Menüye Dön</SpaceButton>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AsteroidDodger;