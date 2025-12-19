
import React, { useState, useRef, useEffect } from 'react';
import { FarmContext } from '../types';
import { askWeeraAI } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface GeminiAssistantProps {
  context: FarmContext;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const result = await askWeeraAI(context, userMsg, messages);
      setMessages([...newMessages, { role: 'model', text: result }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'model', text: "I'm having trouble connecting to my database. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = () => {
    if (!isOpen && messages.length === 0) {
      setMessages([{ role: 'model', text: "Hello! I am WEERA AI. I've analyzed your farm data. How can I help you today? You can ask me about yields, profits, or recommendations." }]);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[90vw] max-w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden flex flex-col animate-scaleIn">
          {/* Header */}
          <div className="bg-[#3d634d] p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-robot text-xl"></i>
              </div>
              <div>
                <h3 className="font-black leading-none text-sm">WEERA AI</h3>
                <p className="text-[10px] text-green-200 font-bold uppercase mt-1 tracking-widest">Digital Consultant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
              <i className="fa-solid fa-minus"></i>
            </button>
          </div>

          {/* Chat Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#3d634d] text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about orders, harvest, expenses..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 bg-gray-100 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-green-100 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-12 h-12 bg-[#3d634d] text-white rounded-2xl flex items-center justify-center hover:bg-[#2d4d3a] transition-all disabled:opacity-50 shadow-lg shadow-green-100"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
            <div className="mt-3 flex justify-center">
               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Powered by Gemini 3 Flash</p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleOpen}
        className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-200 transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-red-500 text-white' : 'bg-[#3d634d] text-white'
        }`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-chevron-down' : 'fa-comment-dots'} text-2xl`}></i>
      </button>
    </div>
  );
};

export default GeminiAssistant;
