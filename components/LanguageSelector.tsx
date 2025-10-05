import React from 'react';
import { useTranslation } from '../i18n/i18n';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="absolute top-4 left-4 flex gap-3 z-50">
      <button 
        onClick={() => setLanguage('tr')} 
        className={`w-12 h-8 rounded-md overflow-hidden border-2 transition-all ${language === 'tr' ? 'border-yellow-400 scale-110' : 'border-transparent'}`}
        aria-label="Türkçe'yi seç"
      >
        <img src="/images/ui/flag_tr.svg" alt="Turkish Flag" className="w-full h-full object-cover" />
      </button>
      <button 
        onClick={() => setLanguage('en')} 
        className={`w-12 h-8 rounded-md overflow-hidden border-2 transition-all ${language === 'en' ? 'border-yellow-400 scale-110' : 'border-transparent'}`}
        aria-label="Select English"
      >
        <img src="/images/ui/flag_us.svg" alt="USA Flag" className="w-full h-full object-cover" />
      </button>
    </div>
  );
};

export default LanguageSelector;