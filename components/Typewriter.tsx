import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  showCursor?: boolean;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 15, onComplete, showCursor = true }) => {
  const [displayedText, setDisplayedText] = useState('');

  // Use a ref for onComplete to avoid resetting the effect when the callback identity changes
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Reset state
    let currentIndex = 0;
    setDisplayedText('');

    const intervalId = setInterval(() => {
      // Use slice to ensure text integrity even if intervals overlap or race conditions occur
      // This guarantees we display exactly what is in the source text up to the current index
      setDisplayedText(text.slice(0, currentIndex + 1));
      currentIndex++;

      if (currentIndex >= text.length) {
        clearInterval(intervalId);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, speed);

    return () => {
      clearInterval(intervalId);
    };
  }, [text, speed]); // Removed onComplete from dependencies

  // Handle Markdown-ish simple formatting (bold) AND custom red helper text
  const formatText = (content: string) => {
    // Split by both bold markers and helper text markers
    const parts = content.split(/(\*\*.*?\*\*|\(\(\(.*?\)\)\))/g);

    return parts.map((part, i) => {
      // Bold
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-yellow-400 font-bold">{part.slice(2, -2)}</strong>;
      }

      // Red Helper Text: ((( ... )))
      if (part.startsWith('(((') && part.endsWith(')))')) {
        return (
          <span key={i} className="block mt-1 text-red-500 text-xs font-mono opacity-80 pl-2 border-l-2 border-red-500/30">
            {part.slice(3, -3)}
          </span>
        );
      }

      return part;
    });
  };

  return (
    <span className="whitespace-pre-wrap font-mono text-sm md:text-base leading-relaxed text-zinc-300">
      {formatText(displayedText)}
      {showCursor && <span className="inline-block w-2 h-4 ml-1 align-middle bg-yellow-500 animate-blink" />}
    </span>
  );
};

export default Typewriter;