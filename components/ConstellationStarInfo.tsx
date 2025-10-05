import React from 'react';
import SpaceButton from './SpaceButton';
import { STAR_DATA } from '../constants'; // Assuming star data might be needed here, if not it can be removed.

interface ConstellationStarInfoProps {
    onStartPuzzle: () => void;
    onGoBack: () => void;
}

const starInfoData = [
    {
        name: "Alkaid",
        description: [
            "Büyük Kepçe’nin “sapının” en ucundaki yıldızdır.",
            "Çok sıcak ve mavi-beyaz renkte bir yıldızdır."
        ]
    },
    {
        name: "Mizar",
        description: [
            "Gökyüzündeki en ünlü çift yıldızlardan biridir. Yanında küçük bir yıldız (Alcor) vardır, keskin gözlü insanlar çıplak gözle bile ayırabilir.",
            "Bu ikili, eski zamanlarda göz testlerinde kullanılırmış."
        ]
    },
    {
        name: "Alioth",
        description: [
            "Kepçe sapındaki en parlak yıldızdır.",
            "Manyetik olarak değişken bir yıldızdır, parlaklığı zaman zaman az da olsa değişir."
        ]
    },
    {
        name: "Megrez",
        description: [
            "Kepçenin sapıyla kovasını birleştiren yıldızdır.",
            "Büyük Kepçe’nin en sönük yıldızıdır."
        ]
    },
    {
        name: "Phecda",
        description: [
            "Kepçenin sol alt köşesindeki yıldızdır.",
            "Büyük Ayı takımyıldızının gövdesini oluşturan yıldızlardan biridir."
        ]
    },
    {
        name: "Merak",
        description: [
            "Kepçenin sağ alt köşesindeki yıldızdır.",
            "Dubhe ile birlikte Kutup Yıldızı’nı (Polaris) bulmak için kullanılır. (Bu yüzden bu ikisine “Gösterici Yıldızlar” denir)."
        ]
    },
    {
        name: "Dubhe",
        description: [
            "Kepçenin sağ üst köşesindeki yıldızdır.",
            "Turuncu renkte dev bir yıldızdır.",
            "Merak ile beraber çizilen çizgi, kuzeyde Kutup Yıldızı’na doğru işaret eder."
        ]
    }
];

const ConstellationStarInfo: React.FC<ConstellationStarInfoProps> = ({ onStartPuzzle, onGoBack }) => {
    return (
        <section className="bg-slate-900/90 border-2 border-yellow-300 p-6 mt-7 rounded-xl shadow-[0_0_15px_rgba(255,222,84,0.2)]">
            <h2 className="text-3xl text-yellow-300 text-center mb-6">Büyük Ayı'nın Yıldızlarını Tanıyalım</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {starInfoData.map(star => (
                    <div key={star.name} className="bg-black/40 p-4 rounded-lg border border-cyan-400/50 flex flex-col">
                        <h3 className="text-xl text-cyan-400 font-bold mb-2 flex items-center">
                           <span className="text-2xl mr-2">☆</span> {star.name}
                        </h3>
                        <div className="flex-grow">
                          {star.description.map((line, index) => (
                              <p key={index} className="text-sm mb-1">{line}</p>
                          ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <SpaceButton variant="secondary" onClick={onGoBack}>Ana Menüye Dön</SpaceButton>
                <SpaceButton variant="info" onClick={onStartPuzzle}>Bulmacaya Başla</SpaceButton>
            </div>
        </section>
    );
};

export default ConstellationStarInfo;