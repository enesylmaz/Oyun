import React, { useState } from 'react';
import SpaceButton from './SpaceButton';
import BotanyLab from './BotanyLab';

interface SpaceFacilityProps {
    onGoBack: () => void;
    onMissionComplete: () => void;
}

type Mission = 'botany' | null;

const SpaceFacility: React.FC<SpaceFacilityProps> = ({ onGoBack, onMissionComplete }) => {
    const [currentMission, setCurrentMission] = useState<Mission>(null);

    const renderHub = () => (
        <div className="bg-slate-900/90 border-2 border-purple-400 p-6 mt-7 rounded-xl shadow-[0_0_15px_rgba(192,132,252,0.3)] flex flex-col items-center">
            <h2 className="text-purple-300 text-3xl text-center">Uzay Tesisi Komuta Merkezi</h2>
            <p className="text-center mt-2 text-yellow-300 font-bold">Görevini seç, astronot!</p>
            
            <div 
                className="relative bg-black mt-4 rounded-lg border-2 border-gray-500 w-full max-w-3xl h-96 bg-cover bg-center"
                style={{ backgroundImage: 'url(/images/space_facility/hub.jpeg)' }}
                aria-label="Uzay tesisi haritası"
            >
                {/* Mission Modules */}
                <div 
                    className="absolute p-2 rounded-lg text-center cursor-pointer border-2 border-green-500 bg-green-900/80 hover:bg-green-700/80 transition-all hover:scale-105" 
                    style={{ top: '30%', left: '15%'}}
                    onClick={() => setCurrentMission('botany')}
                >
                    <h4 className="font-bold text-green-300">Botanik Laboratuvarı</h4>
                    <p className="text-xs">GÖREVE BAŞLA</p>
                </div>
                
                <div 
                    className="absolute p-2 rounded-lg text-center cursor-not-allowed border-2 border-gray-600 bg-gray-800/80" 
                    style={{ top: '65%', left: '40%'}}
                >
                    <h4 className="font-bold text-gray-500">Motor Odası</h4>
                    <p className="text-xs text-gray-600">[YAKINDA]</p>
                </div>

                 <div 
                    className="absolute p-2 rounded-lg text-center cursor-not-allowed border-2 border-gray-600 bg-gray-800/80" 
                    style={{ top: '25%', left: '70%'}}
                >
                    <h4 className="font-bold text-gray-500">Gözlemevi</h4>
                    <p className="text-xs text-gray-600">[YAKINDA]</p>
                </div>
            </div>

            <SpaceButton variant="secondary" onClick={onGoBack} className="mt-6">Ana Menüye Dön</SpaceButton>
        </div>
    );

    const renderMission = () => {
        switch (currentMission) {
            case 'botany':
                return <BotanyLab 
                            onComplete={onMissionComplete}
                            onReturnToHub={() => setCurrentMission(null)}
                        />;
            default:
                return renderHub();
        }
    }

    return (
        <section>
            {renderMission()}
        </section>
    );
};

export default SpaceFacility;