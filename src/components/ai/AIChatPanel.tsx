'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const GREETING: Message = {
  role: 'assistant',
  content:
    'Hello! I am the Celestial Oracle, powered by Groq + Llama 3.3. Ask me anything about constellations, planets, the ISS, satellites, or the wider cosmos.',
};

export default function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const updatedMessages: Message[] = [
      ...messages,
      { role: 'user', content: userText },
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Build the history for the API — exclude the greeting from conversation history
      const historyForAPI = updatedMessages
        .slice(1) // skip the greeting
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyForAPI }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `[ERROR] ${msg}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 flex flex-col gap-4 h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm text-neutral-300 tracking-wide">
            CELESTIAL ORACLE
          </h2>
          <p className="mt-1 text-xs text-neutral-500 font-mono">
            Powered by Groq · Llama 3.3 · Ask about the cosmos
          </p>
        </div>
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
            }`}
          />
          <span className="text-[10px] font-mono text-neutral-500 tracking-widest">
            {isLoading ? 'PROCESSING' : 'ONLINE'}
          </span>
        </div>
      </div>
      <div className="panel-rule" />

      {/* Message list */}
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-neutral-700">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded p-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-neutral-800 text-white'
                  : 'bg-black border border-neutral-800 text-neutral-300'
              }`}
            >
              <div className="font-display text-[10px] tracking-widest text-neutral-500 mb-1">
                {msg.role === 'user' ? 'YOU' : 'ORACLE · GROQ'}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-black border border-neutral-800 text-neutral-500 text-xs font-mono p-3 rounded">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="tracking-widest">ANALYZING COSMIC DATA</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-neutral-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about planets, ISS, constellations..."
          className="flex-1 bg-black border border-neutral-700 text-neutral-300 text-sm p-2 rounded focus:outline-none focus:border-neutral-500 placeholder-neutral-600"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 rounded transition-colors font-display text-xs tracking-wider"
        >
          SEND
        </button>
      </div>
    </div>
  );
}
