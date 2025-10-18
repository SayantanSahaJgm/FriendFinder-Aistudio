import React, { useState, useRef, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { ICONS } from '../constants';
import type { ChatMode, ChatStatus, ChatMessage } from '../types';
import { enhanceRandomChat, startBotChat, createBotChat } from '../ai';
import SelfieCapture from './SelfieCapture';
import VideoChat from './VideoChat';

const RandomScreen: React.FC = () => {
  const [mode, setMode] = useState<ChatMode>('text');
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [aiDecision, setAiDecision] = useState<string | null>(null);
  const [isBotChat, setIsBotChat] = useState(false);
  
  // State for text chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);
  
  const startSearch = async () => {
    setStatus('searching');
    setAiDecision(null);
    setIsBotChat(false);
    setMessages([]);
    setCurrentMessage('');

    try {
      const result = await enhanceRandomChat();
      setAiDecision(result);
      
      const searchTimeout = setTimeout(async () => {
        if (mode === 'text') {
          setIsBotChat(true);
          setStatus('connected');
          setIsBotTyping(true);
          
          try {
            // Use the new, cleaner method to start the bot chat
            const { chat, initialMessage } = await startBotChat();
            setChatSession(chat);
            const botGreeting: ChatMessage = { id: '0', sender: 'bot', text: initialMessage };
            setMessages([botGreeting]);
          } catch (error) {
            console.error("Error getting initial bot message:", error);
            // Fallback to a static message and an empty chat session on error
            setChatSession(createBotChat());
            const fallbackMessage: ChatMessage = { id: '0', sender: 'bot', text: "Hey! Couldn't find a user right now, but you can chat with me. What's on your mind?" };
            setMessages([fallbackMessage]);
          } finally {
            setIsBotTyping(false);
          }
        } else {
          // For audio/video, connect to a simulated user
          setStatus('connected');
        }
      }, 3000);

      // For non-text modes, find a "user" faster for demo purposes
      if (mode !== 'text') {
        setTimeout(() => {
          clearTimeout(searchTimeout); // Found a user, so cancel the bot timeout
          setStatus('connected');
        }, 1500);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      setStatus('error');
    }
  };

  const handleSelfieCaptured = (dataUri: string) => {
    setStatus('idle');
    startSearch();
  };

  const handleStartClick = () => {
    if (mode === 'video') {
      setStatus('capturingSelfie');
    } else {
      startSearch();
    }
  };

  const resetState = () => {
    setStatus('idle');
    setAiDecision(null);
    setIsBotChat(false);
    setMessages([]);
    setChatSession(null);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || !chatSession || isBotTyping) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: currentMessage };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsBotTyping(true);

    try {
      const response = await chatSession.sendMessage({ message: userMessage.text });
      const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'bot', text: response.text };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message to bot:", error);
       const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'bot', text: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const renderIdle = () => (
    <div className="bg-white rounded-lg shadow-md p-6 text-center w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">Choose Your Chat Mode</h2>
      <p className="text-gray-500 mt-2 mb-6">Connect with someone new</p>
      
      <div className="flex justify-center bg-gray-100 rounded-lg p-1 mb-6">
        {(['text', 'audio', 'video'] as ChatMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`w-1/3 py-2 px-4 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              mode === m ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {m === 'text' && <ICONS.Text className="w-5 h-5" />}
            {m === 'audio' && <ICONS.Mic className="w-5 h-5" />}
            {m === 'video' && <ICONS.Video className="w-5 h-5" />}
            <span className="capitalize">{m}</span>
          </button>
        ))}
      </div>

      <button onClick={handleStartClick} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
        Start Chatting
      </button>
    </div>
  );

  const renderSearching = () => (
    <div className="bg-white rounded-lg shadow-md p-8 text-center w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">Finding a Match...</h2>
      <ICONS.Refresh className="h-16 w-16 my-6 animate-spin text-blue-500 mx-auto" />
      <p className="text-gray-500">Please wait while we connect you.</p>
      <button onClick={resetState} className="mt-6 bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors">Cancel</button>
      {aiDecision && (
        <div className="text-left animate-fade-in mt-6 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <h3 className="font-bold text-sm text-blue-800 flex items-center gap-2"><ICONS.Sparkles className="w-4 h-4" /> AI Privacy Check</h3>
          <p className="text-xs text-blue-700 mt-1">{aiDecision}</p>
        </div>
      )}
    </div>
  );
  
  const renderTextChat = () => (
    <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-2xl mx-auto flex flex-col">
      <header className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {isBotChat ? <ICONS.Bot className="h-6 w-6 text-blue-500" /> : <ICONS.User className="h-6 w-6 text-gray-600" />}
          <h2 className="text-lg font-bold text-gray-800">
            {isBotChat ? "AI Assistant" : `Connected (${mode})`}
          </h2>
        </div>
        <div className='flex gap-2'>
          <button onClick={() => startSearch()} className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Next</button>
          <button onClick={resetState} className="px-3 py-1.5 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600">Stop</button>
        </div>
      </header>
      <main ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender !== 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0"><ICONS.Bot className="w-5 h-5 text-gray-600"/></div>}
            <p className={`max-w-xs md:max-w-md p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
              {msg.text}
            </p>
          </div>
        ))}
         {isBotTyping && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0"><ICONS.Bot className="w-5 h-5 text-gray-600"/></div>
            <div className="p-3 rounded-2xl bg-gray-200 rounded-bl-none">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse-fast"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse-medium"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse-slow"></span>
              </div>
            </div>
          </div>
        )}
      </main>
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex items-center gap-2">
        <input 
          type="text" 
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type a message..." 
          className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={!isBotChat || isBotTyping}
        />
        <button type="submit" className="bg-blue-500 text-white p-2.5 rounded-full hover:bg-blue-600 disabled:bg-blue-300" disabled={!isBotChat || isBotTyping || !currentMessage.trim()}>
          <ICONS.Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
  
  const renderConnected = () => (
    <div className="w-full h-full flex flex-col p-2">
       {mode === 'video' ? (
         <VideoChat onNext={() => startSearch()} onStop={resetState} />
       ) : mode === 'text' ? (
         renderTextChat()
       ) : (
         <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-2xl mx-auto flex flex-col items-center justify-center p-8">
            <ICONS.Mic className="w-24 h-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700">Audio Chat</h2>
            <p className="text-gray-500 mt-2">This feature is coming soon!</p>
            <div className='flex gap-4 mt-6'>
                <button onClick={() => startSearch()} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Next</button>
                <button onClick={resetState} className="px-6 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">Stop</button>
            </div>
         </div>
       )}
    </div>
  );

  const renderError = () => (
    <div className="bg-white rounded-lg shadow-md p-8 text-center w-full max-w-md mx-auto">
      <ICONS.XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Connection Error</h2>
      <p className="text-gray-500 mt-2">Could not connect to a user. Please try again.</p>
      <button onClick={resetState} className="mt-6 bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600">Try Again</button>
    </div>
  );

  const renderContent = () => {
    switch (status) {
      case 'idle': return renderIdle();
      case 'capturingSelfie': return <SelfieCapture onSelfieCaptured={handleSelfieCaptured} onCancel={resetState} />;
      case 'searching': return renderSearching();
      case 'connected': return renderConnected();
      case 'error': return renderError();
      default: return null;
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-50">
      {renderContent()}
    </div>
  );
};

export default RandomScreen;