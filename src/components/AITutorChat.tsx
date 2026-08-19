import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Volume2, RefreshCw, MessageSquare, Lightbulb, Compass } from 'lucide-react';
import { AIChatMessage, Language, WordEntry } from '../types';
import { speakWord } from '../utils/audioSpeech';

interface AITutorChatProps {
  selectedLanguage: Language;
  initialPromptWord?: WordEntry | null;
}

export const AITutorChat: React.FC<AITutorChatProps> = ({ selectedLanguage, initialPromptWord }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Halo! Saya Tutor Leksika AI 🌿. Saya siap membantu Anda mempelajari tata bahasa, kosakata, etiket kesantunan, serta terjemahan kalimat untuk Bahasa ${selectedLanguage.name} maupun bahasa daerah lainnya di Indonesia. Ada yang ingin Anda tanyakan?`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPromptWord) {
      const prompt = `Tolong jelaskan secara mendalam tentang kata "${initialPromptWord.translation}" (${initialPromptWord.word}) dalam Bahasa ${selectedLanguage.name}, beserta contoh penggunaan dan adat budaya lokalnya.`;
      handleSendMessage(prompt);
    }
  }, [initialPromptWord]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          selectedLanguage: selectedLanguage.name
        })
      });

      const data = await response.json();
      const botText = data.text || 'Mohon maaf, terjadi gangguan sinyal AI. Silakan tanyakan kembali.';

      const botMsg: AIChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: AIChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Mohon maaf, sambungan server AI terputus. Pastikan kunci API Gemini sudah terkonfigurasi di Secrets.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakResponse = (text: string) => {
    speakWord(text.slice(0, 150), 'id-ID');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-[75vh]">
      
      {/* Chat Header */}
      <div className="bg-white p-4 sm:p-5 border-b border-slate-200 text-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-700 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Tutor Leksika AI</h3>
            <p className="text-xs text-slate-500 font-medium">
              Pakar Bahasa Daerah • Bahasa {selectedLanguage.name.replace('Bahasa ', '')}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-green-50 rounded-full text-xs font-bold text-green-800 border border-green-200">
          Gemini AI
        </span>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-slate-50 border-b border-slate-200/80 overflow-x-auto flex items-center gap-2 scrollbar-none shrink-0">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Saran Pertanyaan:
        </span>

        {[
          `Bagaimana cara menyapa orang tua secara sopan dalam Bahasa ${selectedLanguage.name}?`,
          `Terjemahkan 'Saya suka makan masakan khas Indonesia' ke ${selectedLanguage.name}`,
          `Berikan 3 kata paling populer beserta contoh kalimatnya`
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-700 text-xs font-medium rounded-xl shrink-0 transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user' ? 'bg-emerald-700 text-white' : 'bg-amber-400 text-slate-950 shadow-xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-none font-medium'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              <div className="flex items-center justify-between text-[10px] opacity-70 pt-1 border-t border-black/10">
                <span>{msg.timestamp}</span>
                {msg.sender === 'bot' && (
                  <button
                    onClick={() => handleSpeakResponse(msg.text)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                    title="Bacakan Jawaban"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none text-xs font-semibold text-slate-500 flex items-center gap-2 shadow-2xs">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Tutor Leksika AI sedang menyusun penjelasan...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder={`Tanyakan apa saja seputar Bahasa ${selectedLanguage.name} atau kebudayaan lokal...`}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-medium"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md disabled:opacity-50 transition-all cursor-pointer"
            title="Kirim Pesan"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
};
