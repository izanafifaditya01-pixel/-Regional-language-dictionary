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
      text: `Selamat datang di ruang konsultasi bahasa Leksika Nusantara. Saya siap membantu Anda mempelajari tata bahasa, kosakata, tingkatan kesantunan adat, serta terjemahan kalimat untuk Bahasa ${selectedLanguage.name} maupun rumpun bahasa Sulawesi Tenggara lainnya. Silakan ajukan pertanyaan Anda.`,
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
    <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col h-[75vh]">
      
      {/* Chat Header */}
      <div className="bg-white p-4 sm:p-5 border-b border-stone-200/90 text-stone-900 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14532D] text-white flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight">Tutor Bahasa Daerah</h3>
            <p className="text-xs text-stone-500">
              Pendamping Linguistik · Fokus {selectedLanguage.name}
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-stone-500 hidden sm:inline">
          Tata Bahasa · Adat · Pelafalan
        </span>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-[#EFECE4]/60 border-b border-stone-200/80 overflow-x-auto flex items-center gap-2 scrollbar-none shrink-0">
        <span className="text-xs font-semibold text-stone-600 flex items-center gap-1 shrink-0 whitespace-nowrap">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          Topik Diskusi:
        </span>

        {[
          `Bagaimana cara menyapa orang tua secara sopan dalam Bahasa ${selectedLanguage.name}?`,
          `Terjemahkan 'Mari kita menjaga persaudaraan kampung' ke ${selectedLanguage.name}`,
          `Berikan 3 kosakata sehari-hari beserta contoh kalimatnya`
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            className="px-3 py-1.5 bg-white border border-stone-200/90 hover:border-[#14532D]/50 text-stone-700 text-xs font-medium rounded-lg shrink-0 transition-colors cursor-pointer whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#F8F6F1]/70">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user' ? 'bg-[#14532D] text-white' : 'bg-[#EFECE4] text-[#14532D] border border-stone-200'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-[#14532D] text-white rounded-tr-none'
                  : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              <div className="flex items-center justify-between text-[10px] opacity-75 pt-1.5 border-t border-current/10">
                <span className="font-mono tabular-nums">{msg.timestamp}</span>
                {msg.sender === 'bot' && (
                  <button
                    onClick={() => handleSpeakResponse(msg.text)}
                    className="p-1 hover:bg-stone-100 rounded text-stone-600 transition-colors cursor-pointer"
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
            <div className="w-8 h-8 rounded-lg bg-[#EFECE4] text-[#14532D] border border-stone-200 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-white border border-stone-200/90 rounded-2xl rounded-tl-none text-xs font-medium text-stone-600 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#14532D]" />
              <span>Menyusun penjelasan linguistik...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-stone-200/90 shrink-0">
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
            placeholder={`Tanyakan kosakata, tata bahasa, atau adat tutur ${selectedLanguage.name}...`}
            className="flex-1 px-4 py-2.5 bg-[#F8F6F1] border border-stone-200/90 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#14532D]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="p-2.5 bg-[#14532D] hover:bg-[#166534] text-white rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
            title="Kirim Pesan"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
};
