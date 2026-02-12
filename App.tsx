import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatInterface from './components/ChatInterface';
import FinalDiagnostic from './components/FinalDiagnostic';
import StickyHeader from './components/StickyHeader';
import { sendMessageToAI } from './services/aiService';
import { Message, AppState, FinalReportData } from './types';
import { INITIAL_MESSAGE } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.CHAT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [finalReport, setFinalReport] = useState<FinalReportData | null>(null);

  // Initial load
  useEffect(() => {
    // Add initial AI message with Hardcoded Options for the first interaction
    // to ensure the user starts with buttons immediately.
    const timer = setTimeout(() => {
      setMessages([
        {
          id: uuidv4(),
          role: 'model',
          text: INITIAL_MESSAGE,
          options: [
            "Pensando em montar",
            "Dando os primeiros passos",
            "Já vendo, quero escalar",
            "Escala Agressiva"
          ]
        },
      ]);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      text: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Call AI (OpenAI via Backend)
    // We pass the entire history including the new user message for context
    const response = await sendMessageToAI(text, [...messages, userMessage]);

    setIsTyping(false);

    // Check for Tool Call
    if (response.toolCall) {

      if (response.toolCall.type === 'generateFinalReport') {
        // Handle Final Report
        const reportData = response.toolCall.data as FinalReportData;
        setFinalReport(reportData);

        const transitionMessage: Message = {
          id: uuidv4(),
          role: 'model',
          text: response.text, // "Gerando Dossiê..."
        };
        setMessages((prev) => [...prev, transitionMessage]);

        setTimeout(() => {
          setAppState(AppState.FINAL_REPORT);
        }, 2000);
      }

    } else {
      // Normal text response
      const aiMessage: Message = {
        id: uuidv4(),
        role: 'model',
        text: response.text,
        options: response.options
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-200 font-sans selection:bg-yellow-500/30">

      {/* Background Grid Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#18181b 1px, transparent 1px), linear-gradient(90deg, #18181b 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}>
      </div>

      {/* Vignette */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>

      <StickyHeader />

      <main className="relative z-10 h-[100dvh] flex flex-col pt-20">
        {appState === AppState.CHAT && (
          <ChatInterface
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
          />
        )}

        {appState === AppState.FINAL_REPORT && finalReport && (
          <div className="flex-grow flex items-start justify-center p-0 md:p-4 overflow-y-auto">
            <FinalDiagnostic data={finalReport} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;