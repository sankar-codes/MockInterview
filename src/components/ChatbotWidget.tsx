import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: [{ text: "Hi! I'm your personal interview coach. Do you have any doubts about interview prep or technical concepts?" }] }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: inputValue.trim() }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Need to format messages for the API (only pass history except the very first static greeting if preferred, but it's fine to pass all)
      const res = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get response');
      
      setMessages([...newMessages, { role: 'model', parts: [{ text: data.reply }] }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([...newMessages, { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again later." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all z-50",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"
        )}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] max-h-[70vh] bg-[#151619] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Interview Coach</h3>
              <p className="text-xs text-green-400 font-mono">Online</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  msg.role === 'user' ? "bg-white/10" : "bg-orange-500/20"
                )}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-orange-500" />}
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-2xl max-w-[75%] text-sm",
                  msg.role === 'user' ? "bg-orange-500 text-white rounded-tr-none" : "bg-white/10 text-gray-200 rounded-tl-none markdown-body prose prose-invert prose-sm"
                )}>
                  {msg.role === 'user' ? (
                    msg.parts[0].text
                  ) : (
                    <div className="markdown-body">
                      <Markdown>{msg.parts[0].text}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 flex-row">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-orange-500" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-white/10 bg-black/50">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors text-white placeholder-gray-500"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors text-white"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
