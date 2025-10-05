
import React, { useEffect } from 'react';
import SpaceButton from './SpaceButton';

interface SplashScreenProps {
  onFinished: () => void;
  speak: (text: string) => void;
  cancel: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished, speak, cancel }) => {
  const title = "Uzay Maceraları";
  const crawlText = "Gökyüzünde parlayan sayısız yıldız, sessizce birbirine göz kırparken, gezegenler barış içinde dönüyordu. Ama evrenin derinliklerinde, karanlık bir güç yavaş yavaş uyanıyordu... Cesur kahramanlar, çocukların hayal gücünden doğarak bu karanlığa karşı ışığı savunmak için bir araya gelmek zorunda! Gezegenleri, yıldızları ve dostluğu korumak için çıktıkları bu yolculuk, tüm galaksinin kaderini belirleyecek. IŞIK MI, YOKSA KARANLIK MI KAZANACAK? Cevap, gökyüzüne bakan cesur kalplerde saklı...";

  useEffect(() => {
    const fullTextToSpeak = `${title}. ${crawlText}`;
    speak(fullTextToSpeak);

    const timer = setTimeout(onFinished, 30000); // Animation duration is 30s

    return () => {
      clearTimeout(timer);
      cancel();
    };
  }, [onFinished, speak, cancel, title, crawlText]);

  const handleSkip = () => {
    cancel();
    onFinished();
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden [perspective:400px] z-50">
      <SpaceButton variant="secondary" className="absolute top-4 right-4 z-50" onClick={handleSkip}>
        Atla
      </SpaceButton>

      <div className="absolute w-full max-w-4xl text-yellow-400 text-5xl leading-tight font-bold text-justify animate-crawl [transform-origin:50%_100%]">
        <h1 className="text-center text-6xl mb-12">{title}</h1>
        <p>{crawlText}</p>
      </div>
    </div>
  );
};

export default SplashScreen;
