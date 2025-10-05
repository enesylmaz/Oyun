import React, { useState, useEffect } from 'react';
import { Star, DropZone } from '../types';
import { STAR_DATA, DROP_ZONES_DATA, CONSTELLATION_LINES } from '../constants';
import SpaceButton from './SpaceButton';

interface ConstellationPuzzleProps {
    onPuzzleComplete: () => void;
    onIncorrectMove: () => void;
    onCorrectMove: () => void;
    speak: (text: string) => void;
    onGoBack: () => void;
}

const ConstellationPuzzle: React.FC<ConstellationPuzzleProps> = ({ onPuzzleComplete, onIncorrectMove, onCorrectMove, speak, onGoBack }) => {
    const [stars, setStars] = useState<Star[]>(STAR_DATA);
    const [dropZones, setDropZones] = useState<DropZone[]>(DROP_ZONES_DATA);
    const [message, setMessage] = useState("Yıldızları doğru yerlerine sürükleyerek takımyıldızı tamamla!");
    const [selectedStarInfo, setSelectedStarInfo] = useState<string>(STAR_DATA[0].info);

    useEffect(() => {
        setMessage("Yıldızları doğru yerlerine sürükleyerek takımyıldızı tamamla!");
        setSelectedStarInfo(STAR_DATA[0].info)
    }, []);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, star: Star) => {
        e.dataTransfer.setData("starId", star.id.toString());
        const starInfo = star.info;
        setSelectedStarInfo(starInfo);
        speak(`${star.name}. ${starInfo}`);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, zone: DropZone) => {
        e.preventDefault();
        const starId = parseInt(e.dataTransfer.getData("starId"));

        if(zone.filledBy) {
            onIncorrectMove();
            return;
        }

        if (zone.id === starId) {
            onCorrectMove();
            const newDropZones = dropZones.map(z => z.id === zone.id ? { ...z, filledBy: starId } : z);
            setDropZones(newDropZones);
            
            const newStars = stars.filter(s => s.id !== starId);
            setStars(newStars);
            
            if (newStars.length === 0) {
                const successMessage = "Tebrikler! Büyük Ayı takımyıldızını tamamladın!";
                setMessage(successMessage);
                speak(successMessage);
                setTimeout(onPuzzleComplete, 3000);
            }
        } else {
            onIncorrectMove();
        }
    };
    
    const resetPuzzle = () => {
        setStars(STAR_DATA);
        setDropZones(DROP_ZONES_DATA);
        const resetMessage = "Yıldızları doğru yerlerine sürükleyerek takımyıldızı tamamla!";
        setMessage(resetMessage);
        speak(resetMessage);
    }

    return (
        <section className="bg-slate-900/90 border-2 border-yellow-300 p-6 mt-7 rounded-xl shadow-[0_0_15px_rgba(255,222,84,0.2)]">
            <h3 className="text-yellow-300 text-3xl text-center">Büyük Ayı Takımyıldızı Bulmacası</h3>
            <p className="text-center text-cyan-400 mt-2 min-h-[24px]">{message}</p>
            
            <div className="flex flex-col md:flex-row gap-6 mt-4">
                {/* Puzzle Area */}
                <div className="w-full md:w-2/3 h-96 bg-black/50 rounded-lg relative border-2 border-cyan-400 overflow-hidden bg-[url('/images/constellation/map.png')] bg-center bg-no-repeat bg-contain">
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        {CONSTELLATION_LINES.map(([id1, id2], index) => {
                            const zone1 = dropZones.find(z => z.id === id1);
                            const zone2 = dropZones.find(z => z.id === id2);

                            if (zone1 && zone2 && zone1.filledBy && zone2.filledBy) {
                                return (
                                    <line
                                        key={index}
                                        x1={zone1.position.left}
                                        y1={zone1.position.top}
                                        x2={zone2.position.left}
                                        y2={zone2.position.top}
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                        className="opacity-70"
                                    />
                                );
                            }
                            return null;
                        })}
                    </svg>
                    {dropZones.map(zone => (
                        <div
                            key={zone.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-dashed border-yellow-300 flex items-center justify-center transition-colors"
                            style={{ top: zone.position.top, left: zone.position.left }}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, zone)}
                        >
                            {zone.filledBy && (
                                <div className="w-6 h-6 bg-white rounded-full shadow-[0_0_15px_white] animate-pulse"></div>
                            )}
                        </div>
                    ))}
                </div>
                {/* Stars and Info Area */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <div className="flex-grow bg-black/30 p-4 rounded-lg border border-gray-600">
                        <h4 className="text-yellow-300 text-xl mb-2">Sürüklenecek Yıldızlar</h4>
                        <div className="flex flex-wrap gap-3">
                            {stars.map(star => (
                                <div
                                    key={star.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, star)}
                                    className="p-2 bg-gray-800 rounded-md cursor-grab active:cursor-grabbing flex items-center gap-2 hover:bg-gray-700"
                                >
                                    <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_8px_white]"></div>
                                    <span>{star.name}</span>
                                </div>
                            ))}
                        </div>
                         {stars.length === 0 && <p className="text-green-400 mt-4">Tüm yıldızlar yerleştirildi!</p>}
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-600 min-h-[100px]">
                        <h4 className="text-yellow-300 text-xl mb-2">Yıldız Bilgisi</h4>
                        <p>{selectedStarInfo}</p>
                    </div>
                     <div className="flex gap-2">
                        <SpaceButton onClick={resetPuzzle} variant="info" className="flex-1">Bulmacayı Sıfrla</SpaceButton>
                        <SpaceButton onClick={onGoBack} variant="secondary" className="flex-1">Ana Menüye Dön</SpaceButton>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConstellationPuzzle;