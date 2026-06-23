'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hello! I am the Celestial Oracle. Ask me any doubts about constellations, planets, the ISS, or anything in the cosmos.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Format history for Gemini API
      const history = messages.slice(1).map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      history.push({ role: 'user', parts: [{ text: userMsg }] });

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API Key missing. Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "You are the Celestial Oracle for Project Zenith. You are an expert in astronomy. Answer questions about planets, constellations, satellites, and the ISS concisely. Match the serious, sleek, scientific tone of the dashboard." }]
          },
          contents: history
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API Request Failed: ${response.status}`);
      }
      
      const data = await response.json();
      const modelReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not process that request.';
      
      setMessages(prev => [...prev, { role: 'model', content: modelReply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'model', content: `[ERROR] ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 flex flex-col gap-4 h-[480px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm text-neutral-300 tracking-wide">CELESTIAL ORACLE</h2>
          <p className="mt-1 text-xs text-neutral-500">Ask doubts about the cosmos</p>
        </div>
      </div>
      <div className="panel-rule" />

      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-neutral-700">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded p-3 text-sm ${msg.role === 'user' ? 'bg-neutral-800 text-white' : 'bg-black border border-neutral-800 text-neutral-300'}`}>
              <div className="font-display text-[10px] tracking-widest text-neutral-500 mb-1">
                {msg.role === 'user' ? 'YOU' : 'ORACLE'}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-black border border-neutral-800 text-neutral-500 text-xs font-mono p-3 rounded animate-pulse">
              Analyzing cosmic data...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 mt-auto pt-2 border-t border-neutral-800">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about planets, ISS..."
          className="flex-1 bg-black border border-neutral-700 text-neutral-300 text-sm p-2 rounded focus:outline-none focus:border-neutral-500"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white px-4 rounded transition-colors font-display text-xs tracking-wider"
        >
          SEND
        </button>
      </div>
    </div>
  );
}
