import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const VoiceInput = ({ onResult, placeholder = "Speak in Hindi, English, Marathi, Gujarati, etc." }) => {
  const { currentLang, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [transcript, setTranscript] = useState('');

  // Map app lang to Web Speech API lang code
  const langCodeMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    bn: 'bn-IN'
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  const handleToggleListen = () => {
    if (!supported) {
      alert("Speech recognition is not directly supported in your current browser. You can type directly into the input.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = langCodeMap[currentLang] || 'hi-IN';

    if (!isListening) {
      try {
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event) => {
          const currentTranscript = event.results[0][0].transcript;
          setTranscript(currentTranscript);
          setIsListening(false);
          if (onResult) {
            onResult(currentTranscript);
          }
        };

        recognition.onerror = (event) => {
          console.log('Speech Recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } catch (err) {
        console.error('Speech recognition exception:', err);
        setIsListening(false);
      }
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggleListen}
        className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
          isListening
            ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-lg shadow-rose-500/30'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
        }`}
        title={isListening ? "Listening... Click to stop" : "Speak using Voice"}
        aria-label="Voice input"
      >
        {isListening ? (
          <MicOff className="w-4 h-4 animate-spin" />
        ) : (
          <Mic className="w-4 h-4 text-emerald-700" />
        )}
      </button>

      {isListening && (
        <span className="absolute left-10 ml-2 whitespace-nowrap bg-rose-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-md z-30 animate-bounce">
          🎙️ {t('listening')}
        </span>
      )}
    </div>
  );
};
