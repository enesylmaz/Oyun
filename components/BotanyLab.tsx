import React, { useState } from 'react';
import SpaceButton from './SpaceButton';

interface BotanyLabProps {
    onComplete: () => void;
    onReturnToHub: () => void;
}

const BotanyLab: React.FC<BotanyLabProps> = ({ onComplete, onReturnToHub }) => {
    const [hasSoil, setHasSoil] = useState(false);
    const [hasSeed, setHasSeed] = useState(false);
    const [isWatered, setIsWatered] = useState(false);
    const [isLightOn, setIsLightOn] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [message, setMessage] = useState("Görevin: Uzayda bitki yetiştirmek. Adımları doğru sırayla tamamla!");

    const handleAddSoil = () => {
        if (!hasSoil) {
            setHasSoil(true);
            setMessage("Harika! Şimdi tohumu eklemelisin.");
        }
    };
    
    const handleAddSeed = () => {
        if (hasSoil && !hasSeed) {
            setHasSeed(true);
            setMessage("Çok güzel! Bitkinin suya ihtiyacı var.");
        }
    };

    const handleWater = () => {
        if (hasSeed && !isWatered) {
            setIsWatered(true);
            setMessage("Neredeyse bitti! Son olarak büyüme lambasını aç.");
        }
    };

    const handleToggleLight = () => {
        if (isWatered && !isLightOn) {
            setIsLightOn(true);
            setMessage("TEBRİKLER! Görevi tamamladın, filizin büyüyor!");
            setIsComplete(true);
        }
    };

    return (
        <div className="bg-slate-900/90 border-2 border-green-400 p-6 mt-7 rounded-xl shadow-[0_0_15px_rgba(74,222,128,0.3)] flex flex-col items-center">
            <h2 className="text-green-300 text-3xl text-center">Botanik Laboratuvarı Görevi</h2>
            <p className="text-center mt-2 text-yellow-300 font-bold min-h-[48px] md:min-h-[24px]">{message}</p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-6 w-full">
                {/* Items */}
                <div className="flex flex-row md:flex-col gap-4">
                    <button onClick={handleAddSoil} disabled={hasSoil} className="w-20 h-20 bg-yellow-900/80 rounded-lg flex flex-col items-center justify-center border-2 border-yellow-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-yellow-800/80 transition-all">
                        <img src="/images/space_facility/botany_soil.png" alt="Toprak" className="w-12 h-12" />
                        <span className="text-xs font-bold">Toprak</span>
                    </button>
                    <button onClick={handleAddSeed} disabled={!hasSoil || hasSeed} className="w-20 h-20 bg-green-900/80 rounded-lg flex flex-col items-center justify-center border-2 border-green-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-800/80 transition-all">
                        <img src="/images/space_facility/botany_seed.png" alt="Tohum" className="w-12 h-12" />
                        <span className="text-xs font-bold">Tohum</span>
                    </button>
                    <button onClick={handleWater} disabled={!hasSeed || isWatered} className="w-20 h-20 bg-blue-900/80 rounded-lg flex flex-col items-center justify-center border-2 border-blue-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-800/80 transition-all">
                        <img src="/images/space_facility/botany_water.png" alt="Su" className="w-12 h-12" />
                        <span className="text-xs font-bold">Su</span>
                    </button>
                     <button onClick={handleToggleLight} disabled={!isWatered || isLightOn} className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center border-2 transition-all ${isLightOn ? 'bg-yellow-500 border-yellow-300' : 'bg-gray-700 border-gray-500 hover:bg-gray-600/80 disabled:opacity-30 disabled:cursor-not-allowed'}`}>
                        <img src="/images/space_facility/botany_light.png" alt="Işık" className="w-12 h-12" />
                        <span className="text-xs font-bold">{isLightOn ? 'AÇIK' : 'KAPALI'}</span>
                    </button>
                </div>
                
                {/* Pot */}
                <div className="w-64 h-64 bg-gray-800/50 rounded-lg flex items-center justify-center border-2 border-gray-600 relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-1/2 bg-yellow-900 transition-transform duration-500" style={{ transform: hasSoil ? 'translateY(0)' : 'translateY(100%)' }}></div>
                    <div className="absolute w-4 h-4 bg-green-300 rounded-full transition-opacity duration-500" style={{ top: '45%', opacity: hasSeed && !isComplete ? 1 : 0 }}></div>
                     <div className="absolute bottom-0 w-full h-1/2 bg-blue-700/30 transition-opacity duration-500" style={{ opacity: isWatered ? 1 : 0 }}></div>
                     <div className="absolute top-0 w-full h-full bg-yellow-200/20 transition-opacity duration-500" style={{ opacity: isLightOn ? 1 : 0, pointerEvents: 'none' }}></div>
                     <img 
                        src="/images/space_facility/botany_sprout.png"
                        alt="Filiz" 
                        className="absolute w-24 h-24 transition-all duration-1000"
                        style={{ bottom: isComplete ? '30%' : '-50%', opacity: isComplete ? 1 : 0 }}
                     />
                </div>
            </div>
            
            <div className="flex gap-4 mt-8">
                {isComplete ? (
                    <SpaceButton variant="primary" onClick={onComplete}>Harika! Ana Menüye Dön</SpaceButton>
                ) : (
                    <SpaceButton variant="secondary" onClick={onReturnToHub}>İstasyona Geri Dön</SpaceButton>
                )}
            </div>
        </div>
    );
};

export default BotanyLab;