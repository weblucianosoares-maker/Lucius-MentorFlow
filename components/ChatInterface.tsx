import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Message } from '../types';
import Typewriter from './Typewriter';

interface ChatInterfaceProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isTyping, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoize scrollToBottom to maintain function identity
  const scrollToBottom = useCallback(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Reset showOptions when new messages arrive
  useEffect(() => {
    setShowOptions(false);
  }, [messages]);

  const handleTypewriterComplete = useCallback(() => {
    scrollToBottom();
    setShowOptions(true);
    // Focus input after a short delay
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [scrollToBottom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleOptionClick = (optionText: string) => {
    onSendMessage(optionText);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-6 pb-4 relative z-10">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 flex items-center justify-center rounded-sm">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-widest font-mono">MENTORFLOW</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">SISTEMA ONLINE</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-[10px] text-zinc-600 font-mono">PROTOCOLO: AES-256</div>
          <div className="text-[10px] text-yellow-600/50 font-mono">PERSONA IA: ARQUITETO DE R$ 1 BI</div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto mb-4 space-y-6 pr-2">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex w-full flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] md:max-w-[80%] p-4 rounded-lg border ${msg.role === 'user'
                ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                : 'bg-transparent border-none pl-0'
                }`}
            >
              <div className="text-[10px] mb-1 font-mono uppercase opacity-50 flex items-center gap-2">
                {msg.role === 'user' ? (
                  <>
                    <span>ID_VISITANTE</span>
                    <div className="w-1 h-1 bg-zinc-500 rounded-full"></div>
                  </>
                ) : (
                  <>
                    <span className="text-yellow-500">ARQUITETO_SISTEMA</span>
                    <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                  </>
                )}
              </div>

              {msg.role === 'model' ? (
                <Typewriter
                  text={msg.text}
                  onComplete={index === messages.length - 1 ? handleTypewriterComplete : undefined}
                  showCursor={index === messages.length - 1}
                />
              ) : (
                <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
              )}
            </div>

            {/* Render Options if they exist and it's the model message */}
            {msg.role === 'model' && msg.options && msg.options.length > 0 && (index !== messages.length - 1 || showOptions) && (
              <div className="mt-2 ml-0 pl-4 max-w-[90%] md:max-w-[80%] flex flex-wrap gap-2 animate-fade-in">
                {msg.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    disabled={isTyping || index !== messages.length - 1} // Only active if it's the last message
                    className="px-4 py-2 border border-yellow-500/30 bg-zinc-900/50 text-yellow-500 hover:bg-yellow-500 hover:text-black active:bg-yellow-600 rounded-sm text-xs md:text-sm font-mono transition-all duration-200 uppercase tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                  >
                    {`> ${option}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="pl-0">
              <div className="text-[10px] mb-1 font-mono uppercase opacity-50 text-yellow-500">ARQUITETO_SISTEMA</div>
              <div className="flex items-center gap-1 h-6">
                <span className="w-1.5 h-1.5 bg-yellow-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-yellow-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-yellow-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative mt-auto">
        <div className="absolute top-0 left-0 -mt-8 flex items-center gap-2 text-xs text-zinc-600 font-mono">
          <span>&gt;</span>
          <span>Aguardando comando estratégico...</span>
        </div>
        <div className="relative group">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua resposta aqui..."
            className="w-full bg-black/50 border-b border-zinc-700 focus:border-yellow-500 text-zinc-200 p-4 pl-8 outline-none transition-colors font-mono placeholder-zinc-700"
            disabled={isTyping}
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-yellow-500 font-bold">&gt;</span>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-yellow-400 disabled:opacity-30 transition-colors"
          >
            <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;