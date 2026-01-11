import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

// REMOVED: Supabase client initialization and any related functions
// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// );

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickReplies = [
  "Je veux en savoir plus sur le coaching",
  "Comment réserver une session ?",
  "Quels sont vos tarifs ?",
  "Comment créer du contenu avec Octogoal ?"
];

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Bonjour ! Je suis l'assistant Octogoal. Comment puis-je vous aider aujourd'hui ? (Fonctionnalité de chat IA temporairement indisponible)", // Updated initial message
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false); // Kept for UI, but won't be triggered by AI
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const sentMessage = message; // Store message before clearing
    setMessage('');
    // setIsTyping(true); // No AI typing simulation for now

    // Simulate a simple response or indicate feature is unavailable
    // This part replaces the Supabase call
    setTimeout(() => {
      let assistantResponseContent = "Merci pour votre message. La fonctionnalité de réponse intelligente est en cours de maintenance. L'équipe Octogoal vous contactera bientôt.";
      if (sentMessage.toLowerCase().includes("coaching")) {
        assistantResponseContent = "Pour toute question sur le coaching, l'équipe Octogoal vous répondra directement. La fonctionnalité de chat IA est temporairement indisponible.";
      } else if (sentMessage.toLowerCase().includes("session") || sentMessage.toLowerCase().includes("réserver")){
        assistantResponseContent = "Pour réserver une session, veuillez contacter Octogoal directement. La fonctionnalité de chat IA est temporairement indisponible.";
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: assistantResponseContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      // setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
    // Automatically send the quick reply as if the user typed and sent it.
    // This provides a more interactive feel even without AI.
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: reply,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage(''); // Clear the input field

    // Simulate a simple response for quick replies
    setTimeout(() => {
      let assistantResponseContent = "Merci pour votre question. La fonctionnalité de réponse intelligente est en cours de maintenance. L'équipe Octogoal vous contactera bientôt.";
      if (reply.toLowerCase().includes("coaching")) {
        assistantResponseContent = "Pour toute question sur le coaching, l'équipe Octogoal vous répondra directement. La fonctionnalité de chat IA est temporairement indisponible.";
      } else if (reply.toLowerCase().includes("session") || reply.toLowerCase().includes("réserver")){
        assistantResponseContent = "Pour réserver une session, veuillez contacter Octogoal directement. La fonctionnalité de chat IA est temporairement indisponible.";
      } else if (reply.toLowerCase().includes("tarifs")){
        assistantResponseContent = "Concernant les tarifs, l'équipe Octogoal vous fournira les informations. La fonctionnalité de chat IA est temporairement indisponible.";
      } else if (reply.toLowerCase().includes("créer du contenu")){
        assistantResponseContent = "Pour créer du contenu avec Octogoal, veuillez nous contacter. La fonctionnalité de chat IA est temporairement indisponible.";
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: assistantResponseContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-16 h-16 bg-accent-blue rounded-full flex items-center justify-center shadow-lg hover:bg-accent-turquoise transition-colors z-50 ${
          isOpen ? 'hidden' : ''
        }`}
      >
        <MessageSquare size={24} className="text-white" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-8 right-8 w-96 bg-neutral-900 rounded-2xl shadow-xl overflow-hidden border border-white/10 z-50`}
          >
            {/* Header */}
            <div className="bg-accent-blue p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/LOGO_OCTOGOAL.png"
                  alt="Octogoal"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-white">Assistant Octogoal</h3>
                  <p className="text-xs text-white/80">Répond en quelques secondes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? (
                    <ChevronUp size={20} className="text-white" />
                  ) : (
                    <ChevronDown size={20} className="text-white" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <div className="h-[calc(600px-144px)] overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-accent-blue text-white'
                          : 'bg-neutral-800 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-60">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-800 rounded-2xl px-4 py-2">
                      <Loader2 className="w-5 h-5 animate-spin text-accent-blue" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Quick Replies */}
            {!isMinimized && messages.length <= 2 && (
              <div className="p-4 grid grid-cols-2 gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-sm text-left p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            {!isMinimized && (
              <div className="p-4 border-t border-white/10">
                <div className="relative">
                  <TextareaAutosize
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Écrivez votre message..."
                    className="w-full bg-neutral-800 rounded-lg pl-4 pr-12 py-3 resize-none max-h-32 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                    maxRows={4}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || isTyping}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg ${
                      message.trim() && !isTyping
                        ? 'text-accent-blue hover:bg-neutral-700'
                        : 'text-neutral-600'
                    } transition-colors`}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
