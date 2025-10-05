
import React from 'react';
import { Planet } from '../types';

interface PlanetDetailProps {
  planet: Planet | null;
}

const PlanetDetail: React.FC<PlanetDetailProps> = ({ planet }) => {
  
  return (
    <section className="bg-slate-900/90 border-2 border-yellow-300 p-6 mt-7 rounded-xl text-left shadow-[0_0_15px_rgba(255,222,84,0.2)] min-h-[300px]">
      <h3 className="text-yellow-300 text-3xl text-center [text-shadow:_1px_1px_3px_black]">
        {planet ? `✨ ${planet.ad} - ${planet.ozellik}` : `🌎 Seçilen Gezegenin Detayları`}
      </h3>
      <div id="gezegen-detaylari" className="mt-4 text-center">
        {planet ? (
          <>
            <img src={planet.resim} alt={`${planet.ad}`} className="w-full max-w-sm mx-auto rounded-lg mt-2 shadow-lg" />
            <p className="text-lg leading-relaxed mt-4">{planet.bilgi}</p>
          </>
        ) : (
          <p>Yukarıdan bir gezegen seçerek detaylı bilgi ve fotoğrafını görebilirsin.</p>
        )}
      </div>
    </section>
  );
};

export default PlanetDetail;
