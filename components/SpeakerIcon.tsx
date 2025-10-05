
import React from 'react';

interface SpeakerIconProps {
  isMuted: boolean;
  toggleMute: () => void;
}

const SpeakerIcon: React.FC<SpeakerIconProps> = ({ isMuted, toggleMute }) => {
  
  return (
    <button
      onClick={toggleMute}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-slate-800/70 text-white hover:bg-slate-700 transition-colors"
      aria-label={isMuted ? "Sesi Aç" : "Sesi Kapat"}
    >
      {isMuted ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1l22 22" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.657 6.343a9 9 0 010 12.728M9.536 14.485a5 5 0 01-7.071 0M5.464 10.364a9 9 0 0112.728 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  );
};

export default SpeakerIcon;
