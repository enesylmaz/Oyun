import { useState, useCallback, useEffect, useRef } from 'react';

interface UseTextToSpeechProps {
  isMuted: boolean;
}

const preferredVoices = [
    'Microsoft Tolga - Turkish (Turkey)',
    'Yelda',
    'Google Türkçe',
];

export const useTextToSpeech = ({ isMuted }: UseTextToSpeechProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
      const synth = synthRef.current;

      const updateVoices = () => {
        if (!synth) return;
        const voices = synth.getVoices();
        if (voices.length > 0) {
          const languageVoices = voices.filter(v => v.lang.startsWith('tr'));
          let foundVoice: SpeechSynthesisVoice | undefined;

          for (const voiceName of preferredVoices) {
            foundVoice = languageVoices.find(voice => voice.name === voiceName);
            if (foundVoice) break;
          }
          
          if (foundVoice) {
            setSelectedVoice(foundVoice);
          } else if (languageVoices.length > 0) {
            setSelectedVoice(languageVoices[0]);
          } else {
            setSelectedVoice(null);
          }
        }
      };
      
      updateVoices();
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = updateVoices;
      }
      
      return () => {
        if (synth && synth.onvoiceschanged !== undefined) {
          synth.onvoiceschanged = null;
        }
        synth?.cancel();
      };
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported || !synthRef.current || isMuted || !text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("Speech synthesis error:", e);
      setIsSpeaking(false);
    };

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    synthRef.current.cancel();
    synthRef.current.speak(utterance);
  }, [isSupported, isMuted, selectedVoice]);

  const cancel = useCallback(() => {
    if (!isSupported || !synthRef.current) return;
    synthRef.current.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { 
    isSupported, isSpeaking, speak, cancel
  };
};