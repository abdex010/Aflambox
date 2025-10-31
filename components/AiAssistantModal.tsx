import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ContentItem, ChatMessage } from '../types';
import { recommendContent } from '../services/geminiService';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface AiAssistantModalProps {
  movies: ContentItem[];
  onClose: () => void;
  onSelectMovie: (movie: ContentItem) => void;
}

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ movies, onClose, onSelectMovie }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: [{ text: "Hello! What kind of movie, TV series, or program are you in the mood for today?" }],
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
        onClose();
    }, 300); // Animation duration
  };

  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', parts: [{ text: userInput }] },
    ];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const result = await recommendContent(movies, userInput);
      let recommendedContentItem: ContentItem | undefined;
      if (result.recommendedContentId !== null) {
        recommendedContentItem = movies.find(m => m.id === result.recommendedContentId);
      }
      
      setMessages(prev => [
        ...prev,
        { role: 'model', parts: [{ text: result.explanation, recommendedContent: recommendedContentItem }] }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again." }] }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, messages, movies]);

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className={`bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg h-[80vh] flex flex-col ${isClosing ? 'animate-slide-down-scale' : 'animate-slide-up-scale'}`}>
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-red-500" />
            AI Assistant
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close AI assistant">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-red-600' : 'bg-gray-700'}`}>
                <p className="text-white">{msg.parts[0].text}</p>
                {msg.parts[0].recommendedContent && (
                   <div className="mt-3 bg-gray-600/50 p-2 rounded-lg flex items-center gap-3">
                        <img src={msg.parts[0].recommendedContent.posterUrl} alt={msg.parts[0].recommendedContent.title} className="w-12 h-auto rounded-md"/>
                        <div className="flex-1">
                            <p className="font-bold text-white">{msg.parts[0].recommendedContent.title}</p>
                            <button onClick={() => onSelectMovie(msg.parts[0].recommendedContent!)} className="text-sm text-red-400 hover:underline">
                                View Details
                            </button>
                        </div>
                   </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-sm p-3 rounded-lg bg-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-medium"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-slow"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
          <div className="flex items-center bg-gray-700 rounded-lg">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g., a sci-fi series about space travel"
              className="w-full bg-transparent p-3 text-white placeholder-gray-400 focus:outline-none"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="p-3 text-white disabled:text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" transform="rotate(90)">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiAssistantModal;