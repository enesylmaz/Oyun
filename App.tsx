
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GameStage, Planet } from './types';
import { 
    ALL_PLANETS, 
    TOUR_GROUP_1,
    TOUR_GROUP_2,
    TOUR_GROUP_3,
    TOUR_GROUP_4,
    TOUR_GROUP_5,
    TOUR_GROUP_6
} from './constants';
import { useTextToSpeech } from './useTextToSpeech';
import SplashScreen from './components/SplashScreen';
import PlanetDetail from './components/PlanetDetail';
import MatchingGame from './components/MatchingGame';
import ConstellationPuzzle from './components/ConstellationPuzzle';
import ConstellationStarInfo from './components/ConstellationStarInfo';
import AsteroidDodger from './components/AsteroidDodger';
import MarsRover from './components/MarsRover';
import SpaceButton from './components/SpaceButton';
import SpeakerIcon from './components/SpeakerIcon';

const NASA_API_KEY = "DEMO_KEY";

const App: React.FC = () => {
    
    const tourData = useMemo(() => [
        { tourPlanets: TOUR_GROUP_1, title: "Güneş'in En Yakın Komşuları" },
        { tourPlanets: TOUR_GROUP_2, title: "Evimiz: Dünya" },
        { tourPlanets: TOUR_GROUP_3, title: "Gelecekteki Evimiz?: Mars" },
        { tourPlanets: TOUR_GROUP_4, title: "Sistemin Devleri" },
        { tourPlanets: TOUR_GROUP_5, title: "Buz Dünyaları" },
        { tourPlanets: TOUR_GROUP_6, title: "Uçsuz Bucaksız Sınırlar" },
    ], []);

    const [gameState, setGameState] = useState<GameStage>(GameStage.START_SCREEN);
    const [planetLevel, setPlanetLevel] = useState(0);
    const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
    const [planetsForCurrentGame, setPlanetsForCurrentGame] = useState<Planet[]>([]);
    const [backgroundImage, setBackgroundImage] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const { speak, cancel } = useTextToSpeech({ isMuted });
    const [completedGames, setCompletedGames] = useState({ planet: false, constellation: false });

    const musicRef = useRef<HTMLAudioElement | null>(null);
    const musicRef2 = useRef<HTMLAudioElement | null>(null);
    const correctSfxRef = useRef<HTMLAudioElement | null>(null);
    const incorrectSfxRef = useRef<HTMLAudioElement | null>(null);
    const rockCollectSfxRef = useRef<HTMLAudioElement | null>(null);


useEffect(() => {
  musicRef2.current = new Audio('/audio/music.mp3'); // public/audio/music.mp3
  musicRef2.current.loop = true;
  correctSfxRef.current = new Audio('https://www.fesliyanstudios.com/play-mp3/418');
  incorrectSfxRef.current = new Audio('https://www.fesliyanstudios.com/play-mp3/10');
  rockCollectSfxRef.current = new Audio('https://www.fesliyanstudios.com/play-mp3/623');
  rockCollectSfxRef.current.volume = 0.7;
}, []);

useEffect(() => {
  if (!musicRef2.current) return;
  
  if (isMuted) {
      musicRef2.current.pause();
      return;
  }

  if (gameState > GameStage.SPLASH && gameState < GameStage.END_SCREEN) {
      if(musicRef2.current.paused) {
        musicRef2.current.currentTime = 0;
        musicRef2.current.play().catch(err => console.log("Main music could not be started:", err));
      }
  } else {
    musicRef2.current.pause();
  }

}, [gameState, isMuted]);

    useEffect(() => {
      if (completedGames.planet && completedGames.constellation) {
        setGameState(GameStage.END_SCREEN);
      }
    }, [completedGames]);

    useEffect(() => {
       
        const fetchNasaImage = async () => {
            try {
                const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
                const data = await response.json();
                if (data.media_type === "image" && data.url) {
                    setBackgroundImage(data.url);
                } else {
                    setBackgroundImage('/images/ui/background.jpeg');
                }
            } catch (error) {
                console.error("Failed to fetch NASA image, using fallback.", error);
                setBackgroundImage('/images/ui/background.jpeg');
            }
        };

        fetchNasaImage();
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    useEffect(() => {
        const musicElement = musicRef.current;
        if (!musicElement) return;

        if (isMuted) {
            musicElement.pause();
            cancel();
        } else {
            if (gameState !== GameStage.START_SCREEN && musicElement.paused) {
                musicElement.play().catch(e => console.error("Audio play failed:", e));
            } else if (gameState === GameStage.START_SCREEN) {
                musicElement.pause();
            }
        }
    }, [isMuted, gameState, cancel]);
    
    useEffect(() => {
      if (selectedPlanet) {
          speak(selectedPlanet.bilgi);
      }
      return () => cancel();
    }, [selectedPlanet, speak, cancel]);

    useEffect(() => {
        if (gameState === GameStage.PLANET_TOUR) {
            const currentTour = tourData[planetLevel];
            if (currentTour && currentTour.tourPlanets.length === 1) {
                setSelectedPlanet(currentTour.tourPlanets[0]);
            }
        }
    }, [gameState, planetLevel, tourData]);

    const handlePlanetSelect = useCallback((planetKey: string) => {
        const planet = ALL_PLANETS.find(p => p.key === planetKey) || null;
        setSelectedPlanet(planet);
    }, []);

    const handleGameComplete = () => {
        if (planetLevel < tourData.length - 1) {
            setPlanetLevel(prev => prev + 1);
            setGameState(GameStage.PLANET_TOUR);
            setSelectedPlanet(null);
        } else {
            setCompletedGames(prev => ({ ...prev, planet: true }));
            setGameState(GameStage.MAIN_MENU);
        }
    };

    const playCorrectSound = () => {
        if (!isMuted && correctSfxRef.current) {
            correctSfxRef.current.currentTime = 0;
            correctSfxRef.current.play();
        }
    };

    const playIncorrectSound = () => {
        if (!isMuted && incorrectSfxRef.current) {
            incorrectSfxRef.current.currentTime = 0;
            incorrectSfxRef.current.play();
        }
    };
    
    const playRockCollectSound = () => {
        if (!isMuted && rockCollectSfxRef.current) {
            rockCollectSfxRef.current.currentTime = 0;
            rockCollectSfxRef.current.play();
        }
    };

const startAdventure = () => {
  if (!isMuted && musicRef2.current) {
    musicRef2.current.currentTime = 0;
    musicRef2.current.play().catch(err => console.log("Müzik başlatılamadı:", err));
  }
  setGameState(GameStage.SPLASH);
};
    
    const restartGame = () => {
      if(musicRef2.current) musicRef2.current.play();
        setPlanetLevel(0);
        setSelectedPlanet(null);
        setCompletedGames({ planet: false, constellation: false });
        setGameState(GameStage.START_SCREEN);
    }

    const handleSplashFinished = useCallback(() => {
        setGameState(GameStage.MAIN_MENU);
    }, []);

    const goToMatchGame = () => {
        const learnedPlanets = tourData
            .slice(0, planetLevel + 1)
            .flatMap(data => data.tourPlanets);

        setPlanetsForCurrentGame(learnedPlanets);
        setGameState(GameStage.MATCH_GAME);
    };
    
    const goToMainMenu = useCallback(() => {
        setGameState(GameStage.MAIN_MENU);
    }, []);

    const renderCurrentStage = () => {
        switch (gameState) {
            case GameStage.START_SCREEN:
                 return (
                    <div className="fixed inset-0 flex flex-col items-center justify-center z-40 bg-black/50 p-4">
                        <h1 className="text-6xl md:text-8xl text-yellow-300 [text-shadow:_2px_2px_8px_rgba(255,222,84,0.7)] tracking-wider">
                           Uzay Maceraları
                        </h1>
                        <img 
                            src="https://cdnb.artstation.com/p/assets/images/images/008/895/207/original/almir-sharifullin-1st-spaceship.gif?1515963945" 
                            alt="Uzay Gemisi"
                            className="my-8 max-w-xs md:max-w-sm animate-float"
                        />
                        <SpaceButton variant="primary" className="mt-4 text-2xl px-8 py-4" onClick={startAdventure}>
                            MACERAYA BAŞLA
                        </SpaceButton>
                    </div>
                );
            case GameStage.MAIN_MENU:
                return (
                    <div className="p-8 text-center">
                        <h2 className="text-4xl text-cyan-400 mb-8 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.7)]">Oyun Seç</h2>
                        <div className="flex flex-col md:flex-row gap-6 justify-center flex-wrap">
                            <SpaceButton 
                                variant="primary" 
                                className="text-xl px-6 py-3" 
                                onClick={() => {
                                    setPlanetLevel(0);
                                    setSelectedPlanet(null);
                                    setGameState(GameStage.PLANET_TOUR);
                                }}
                                disabled={completedGames.planet}
                            >
                                Gezegen Eşleştirme {completedGames.planet && '✅'}
                            </SpaceButton>
                            <SpaceButton 
                                variant="secondary" 
                                className="text-xl px-6 py-3" 
                                onClick={() => setGameState(GameStage.CONSTELLATION_INTRO)}
                                disabled={completedGames.constellation}
                            >
                                Yıldız Birleştirme {completedGames.constellation && '✅'}
                            </SpaceButton>
                             <SpaceButton 
                                variant="danger" 
                                className="text-xl px-6 py-3" 
                                onClick={() => setGameState(GameStage.ASTEROID_DODGE)}
                            >
                                Asteroit Tarlası
                            </SpaceButton>
                            <SpaceButton 
                                variant="warning" 
                                className="text-xl px-6 py-3" 
                                onClick={() => setGameState(GameStage.MARS_ROVER)}
                            >
                                Mars Macerası
                            </SpaceButton>
                        </div>
                        <SpaceButton variant="info" className="mt-8" onClick={restartGame}>Ana Ekrana Dön</SpaceButton>
                    </div>
                );
            case GameStage.PLANET_TOUR:
                const currentTour = tourData[planetLevel];
                return (
                    <div className="bg-slate-900/90 p-5 rounded-2xl">
                        <h2 className="text-3xl text-cyan-400">{`🔭 Bölüm ${planetLevel + 1}: ${currentTour.title}`}</h2>
                        <div className="flex flex-wrap justify-center gap-3 my-5">
                            {currentTour.tourPlanets.map(p => (
                                <SpaceButton key={p.key} onClick={() => handlePlanetSelect(p.key)}>{p.ad}</SpaceButton>
                            ))}
                        </div>
                        <PlanetDetail planet={selectedPlanet} />
                        <div className="flex justify-center gap-4 mt-6">
                           <SpaceButton variant="info" onClick={goToMainMenu}>Ana Menüye Dön</SpaceButton>
                           <SpaceButton variant="secondary" onClick={goToMatchGame}>Oyuna Başla!</SpaceButton>
                        </div>
                    </div>
                );
            case GameStage.MATCH_GAME:
                return <MatchingGame 
                            planets={planetsForCurrentGame} 
                            onGameComplete={handleGameComplete} 
                            level={planetLevel + 1}
                            onCorrectMove={playCorrectSound}
                            onIncorrectMove={playIncorrectSound}
                            onGoBack={goToMainMenu}
                        />;
            case GameStage.CONSTELLATION_INTRO:
                return (
                    <div className="bg-slate-900/90 border-2 border-yellow-300 p-6 mt-7 rounded-xl shadow-[0_0_15px_rgba(255,222,84,0.2)] text-center">
                        <h2 className="text-3xl text-yellow-300">Harika Gidiyorsun!</h2>
                        <p className="mt-4 text-lg">Gezegenleri öğrendin! Şimdi sıra gökyüzünün en bilinen takımyıldızlarından birinde: Büyük Ayı! Bu takımyıldız, Kutup Yıldızı'nı bulmamıza yardım eden ünlü 'Kepçe'yi içerir. Yıldızlarını birleştirmeye hazır mısın?</p>
                        <img 
                            src="https://i0.wp.com/www.kozmikanafor.com/wp-content/uploads/2018/07/buyuk-ayi-yildizlar-2665153.jpg?resize=678%2C381&ssl=1" 
                            alt="Büyük Ayı Takımyıldızı"
                            className="max-w-sm mx-auto my-4 bg-white/10 p-2 rounded-lg border border-cyan-400"
                        />
                         <div className="flex justify-center gap-4 mt-6">
                            <SpaceButton variant="secondary" onClick={goToMainMenu}>Ana Menüye Dön</SpaceButton>
                            <SpaceButton variant="info" onClick={() => setGameState(GameStage.CONSTELLATION_STAR_INFO)}>Yıldızları Tanı</SpaceButton>
                        </div>
                    </div>
                );
            case GameStage.CONSTELLATION_STAR_INFO:
                return <ConstellationStarInfo 
                            onStartPuzzle={() => setGameState(GameStage.CONSTELLATION_PUZZLE)}
                            onGoBack={goToMainMenu}
                        />;
            case GameStage.CONSTELLATION_PUZZLE:
                return <ConstellationPuzzle 
                            onPuzzleComplete={() => {
                                setCompletedGames(prev => ({...prev, constellation: true }));
                                setGameState(GameStage.MAIN_MENU)
                            }} 
                            onIncorrectMove={playIncorrectSound} 
                            onCorrectMove={playCorrectSound}
                            speak={speak}
                            onGoBack={goToMainMenu}
                        />;
            case GameStage.ASTEROID_DODGE:
                return <AsteroidDodger onGoBack={goToMainMenu} />;
            case GameStage.MARS_ROVER:
                return <MarsRover 
                    onGoBack={goToMainMenu} 
                    onCollectRock={playRockCollectSound}
                    onCrash={playIncorrectSound}
                />;
            case GameStage.END_SCREEN:
                 return (
                    <div className="bg-slate-900/90 border-2 border-yellow-300 p-6 mt-7 rounded-xl shadow-[0_0_15px_rgba(255,222,84,0.2)] text-center">
                        <h2 className="text-4xl text-yellow-300">✨ TEBRİKLER KAHRAMAN! ✨</h2>
                        <p className="mt-4 text-xl">Bütün oyunları tamamladın! Evrenin sırlarını çözmeye bir adım daha yaklaştın. Daha fazlası için güncellemeleri bekle.</p>
                        <SpaceButton variant="primary" className="mt-6" onClick={restartGame}>Yeniden Oyna</SpaceButton>
                    </div>
                );
            default:
                return null;
        }
    }

    if (gameState === GameStage.SPLASH) {
        return <SplashScreen onFinished={handleSplashFinished} speak={speak} cancel={cancel} />;
    }

    return (
        <div 
            className="min-h-screen text-gray-300 text-center relative bg-cover bg-center bg-fixed transition-background-image duration-1000"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="absolute inset-0 bg-black/60 z-0"></div>
            
            <SpeakerIcon isMuted={isMuted} toggleMute={toggleMute} />

            {(gameState > GameStage.SPLASH || gameState === GameStage.MAIN_MENU) && gameState !== GameStage.START_SCREEN && (
                <header className="py-4 relative z-20">
                    <h1 className="text-4xl text-yellow-300 [text-shadow:_2px_2px_8px_rgba(255,222,84,0.7)] tracking-wider">
                        Uzay Maceraları
                    </h1>
                </header>
            )}

            <main className="p-5 max-w-6xl mx-auto relative z-10">
                {renderCurrentStage()}
            </main>
        </div>
    );
};

export default App;