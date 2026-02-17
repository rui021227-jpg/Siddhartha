import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle } from 'lucide-react';
import api from '../services/api';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

interface ErrorState {
    show: boolean;
    message: string;
}

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [error, setError] = useState<ErrorState>({ show: false, message: '' });
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize conversation
    useEffect(() => {
        const initChat = async () => {
            try {
                const response = await api.post('/conversations/', {
                    title: 'New Reflection',
                    topic: 'general'
                });
                setConversationId(response.data.id);
            } catch (err: any) {
                console.error("Failed to start conversation", err);
                setError({
                    show: true,
                    message: 'Unable to start conversation. Please refresh the page.'
                });
            }
        };
        initChat();
    }, []);

    // Auto-scroll with smooth behavior - optimized with useCallback
    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, []);

    useEffect(() => {
        // Delay scroll to allow DOM update
        const timer = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timer);
    }, [messages, scrollToBottom]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !conversationId || isLoading) return;

        const userMsg = input.trim();
        const tempUserId = `u-${Date.now()}`;

        // Optimistically add user message
        const userMessage: Message = {
            id: tempUserId,
            role: 'user',
            content: userMsg,
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError({ show: false, message: '' });

        try {
            const response = await api.post(`/conversations/${conversationId}/messages/`, {
                content: userMsg
            });

            // Add assistant response
            setMessages(prev => [...prev, response.data]);

            // Focus back on input
            inputRef.current?.focus();
        } catch (err: any) {
            console.error("Failed to send message", err);

            // Remove the optimistic user message on error
            setMessages(prev => prev.filter(m => m.id !== tempUserId));

            // Restore input
            setInput(userMsg);

            // Show error
            const errorMsg = err.response?.data?.detail ||
                err.message ||
                'Failed to send message. Please try again.';
            setError({ show: true, message: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-3xl px-8 pt-24 pb-12">
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-12 pr-4 custom-scrollbar scroll-smooth"
            >
                {/* Initial Quote / Spirit State */}
                <div className="flex flex-col items-center justify-center text-center space-y-6 pt-8 pb-12 opacity-80">
                    <div className="text-textSecondary/30 italic font-serif text-lg max-w-md">
                        "The river is everywhere at the same time, at the source and at the mouth... in the ocean and in the mountains, everywhere."
                    </div>
                    <div className="text-textSecondary/40">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="1" /><path d="M12 8a5 5 0 0 1 0 10" /><path d="m9 21 3-6 3 6" /><path d="m6 9 6 2 6-2" /></svg>
                    </div>
                </div>

                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="text-textSecondary/40">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="7" r="1" /><path d="M12 8a5 5 0 0 1 0 10" /><path d="m9 21 3-6 3 6" /><path d="m6 9 6 2 6-2" /></svg>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-textSecondary/60 font-medium">Siddhartha</span>
                                </div>
                            )}

                            {msg.role === 'user' && (
                                <span className="text-[10px] uppercase tracking-[0.2em] text-textSecondary/60 font-medium mb-3 mr-2">You</span>
                            )}

                            <div className={`max-w-[85%] ${msg.role === 'user'
                                ? 'bg-white shadow-sm border border-border px-6 py-4 rounded-2xl rounded-tr-none text-textPrimary leading-relaxed text-sm'
                                : 'font-serif italic text-2xl text-textPrimary/90 leading-tight pl-2'
                                }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center space-x-3 pl-2"
                    >
                        <div className="text-textSecondary/20 animate-pulse duration-1000">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="7" r="1" /><path d="M12 8a5 5 0 0 1 0 10" /><path d="m9 21 3-6 3 6" /><path d="m6 9 6 2 6-2" /></svg>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-serif italic text-textSecondary opacity-40">Reflecting...</span>
                    </motion.div>
                )}

                {/* Error Display */}
                {error.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                    >
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{error.message}</span>
                    </motion.div>
                )}
            </div>

            <form
                onSubmit={handleSend}
                className="mt-12 group relative"
            >
                <div className="absolute inset-0 bg-white/50 blur-xl rounded-full -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Share your thoughts..."
                    disabled={isLoading || !conversationId}
                    className="w-full bg-white/40 border border-border/80 focus:border-accent/40 rounded-full py-5 px-10 focus:outline-none transition-all duration-500 font-serif italic text-xl shadow-sm placeholder:text-textSecondary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading || !conversationId}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-textSecondary/40 hover:text-textPrimary transition-colors disabled:opacity-0 duration-500"
                >
                    <Send className="h-5 w-5 stroke-[1.5]" />
                </button>
                <div className="mt-4 text-[9px] text-center uppercase tracking-[0.3em] text-textSecondary/30 leading-none">
                    Press enter to reflect
                </div>
            </form>
        </div>
    );
};

export default ChatPage;
