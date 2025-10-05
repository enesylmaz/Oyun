import React, { useState, useEffect } from 'react';
import { Planet, CardData } from '../types';
import SpaceButton from './SpaceButton';

interface MatchingGameProps {
  planets: Planet[];
  onGameComplete: () => void;
  level: number;
  onCorrectMove: () => void;
  onIncorrectMove: () => void;
  onGoBack: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

const MatchingGame: React.FC<MatchingGameProps> = ({ planets, onGameComplete, level, onCorrectMove, onIncorrectMove, onGoBack }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedCards, setSelectedCards] = useState<HTMLElement[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const gameCards: CardData[] = [];
    planets.forEach(planet => {
      gameCards.push({ type: 'ad', value: planet.ad, matchKey: planet.key });
      gameCards.push({ type: 'ozellik', value: planet.ozellik, matchKey: planet.key });
    });
    setCards(shuffleArray(gameCards));
    setMatchedPairs(0);
    setSelectedCards([]);
    setStatusMessage(`Seviye ${level} - Kartlara tıklayarak gezegen adlarını ve doğru özelliklerini eşleştir!`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planets, level]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const clickedCard = e.currentTarget;

    if (clickedCard.dataset.matched === 'true' || selectedCards.length === 2 || selectedCards.includes(clickedCard)) {
      return;
    }

    clickedCard.classList.add('border-red-500', 'shadow-[0_0_10px_#ff0000]');
    const newSelectedCards = [...selectedCards, clickedCard];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      setTimeout(() => checkMatch(newSelectedCards), 800);
    }
  };
  
  const checkMatch = (pair: HTMLElement[]) => {
    const [card1, card2] = pair;
    const key1 = card1.dataset.key;
    const key2 = card2.dataset.key;
    const type1 = card1.dataset.type;
    const type2 = card2.dataset.type;

    if (key1 === key2 && type1 !== type2) {
      onCorrectMove();
      card1.classList.remove('border-red-500', 'shadow-[0_0_10px_#ff0000]');
      card2.classList.remove('border-red-500', 'shadow-[0_0_10px_#ff0000]');
      card1.classList.add('bg-green-600', 'border-green-600', 'text-black', 'cursor-default');
      card2.classList.add('bg-green-600', 'border-green-600', 'text-black', 'cursor-default');
      card1.dataset.matched = 'true';
      card2.dataset.matched = 'true';
      
      const newMatchedCount = matchedPairs + 1;
      setMatchedPairs(newMatchedCount);
      
      if (newMatchedCount === planets.length) {
        setStatusMessage(`Tebrikler! Seviye ${level} tamamlandı! 🌟`);
        setTimeout(onGameComplete, 2500);
      }
    } else {
      onIncorrectMove();
      card1.classList.add('bg-red-600', 'border-red-600');
      card2.classList.add('bg-red-600', 'border-red-600');
      
      setTimeout(() => {
        card1.classList.remove('border-red-500', 'shadow-[0_0_10px_#ff0000]', 'bg-red-600', 'border-red-600');
        card2.classList.remove('border-red-500', 'shadow-[0_0_10px_#ff0000]', 'bg-red-600', 'border-red-600');
      }, 500);
    }
    setSelectedCards([]);
  };

  return (
    <section className="bg-slate-900/90 border-2 border-cyan-400 p-6 mt-7 rounded-xl shadow-[0_0_15px_rgba(84,197,255,0.2)]">
      <h3 className="text-cyan-400 text-3xl text-center">Gezegen Eşleştirme Oyunu</h3>
      <p className="text-center mt-2 text-yellow-300 font-bold min-h-[24px]">{statusMessage}</p>
      <div className="flex flex-wrap justify-center gap-3 mt-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-40 h-24 flex items-center justify-center bg-gray-800 border-4 border-cyan-400 rounded-lg cursor-pointer text-sm font-bold transition-all duration-200 text-center p-1 hover:scale-105"
            data-key={card.matchKey}
            data-type={card.type}
            onClick={handleCardClick}
          >
            {card.value}
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <SpaceButton variant="info" onClick={onGoBack}>Ana Menüye Dön</SpaceButton>
      </div>
    </section>
  );
};

export default MatchingGame;