import React from 'react';
import { BrainCircuit, Copy, ThumbsUp, RefreshCw, Send } from 'lucide-react';

interface ChatViewProps {
    messages: Record<string, Array<{ role: 'user' | 'ai', content: string }>>;
    activeChatId: string;
    input: string;
    setInput: (value: string) => void;
    handleSend: () => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatView: React.FC<ChatViewProps> = ({
    messages,
    activeChatId,
    input,
    setInput,
    handleSend,
    messagesEndRef
}) => {
    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
                    {(messages[activeChatId] || []).map((msg, i) => (
                        <div key={i} className={`flex gap-4 md:gap-6 ${msg.role === 'ai' ? 'items-start' : 'items-start justify-end'}`}>
                            {msg.role === 'ai' && (
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-ocean-700 flex-shrink-0 flex items-center justify-center shadow-lg shadow-teal-500/20 translate-y-1">
                                    <BrainCircuit className="w-6 h-6 text-white" />
                                </div>
                            )}
                            <div className={`group relative max-w-[85%] md:max-w-[75%] ${msg.role === 'user'
                                ? 'bg-teal-950/40 border border-teal-500/20 px-5 py-3 rounded-[24px] text-teal-50 shadow-xl'
                                : 'text-[#ececec] py-2 leading-relaxed tracking-wide'
                                }`}>
                                <div className="prose prose-invert text-[15px] font-normal leading-relaxed">
                                    {msg.content}
                                </div>
                                {msg.role === 'ai' && (
                                    <div className="mt-5 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-teal-500/10 rounded-xl text-teal-400/60 hover:text-teal-400 transition-all"><Copy className="w-4 h-4" /></button>
                                        <button className="p-2 hover:bg-teal-500/10 rounded-xl text-teal-400/60 hover:text-teal-400 transition-all"><ThumbsUp className="w-4 h-4" /></button>
                                        <button className="p-2 hover:bg-teal-500/10 rounded-xl text-teal-400/60 hover:text-teal-400 transition-all"><RefreshCw className="w-4 h-4" /></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            <div className="p-6 md:p-10 pt-0">
                <div className="max-w-3xl mx-auto relative group">
                    <div className="relative flex items-end gap-3 bg-teal-950/20 border border-teal-500/10 rounded-[32px] p-2.5 pl-5 md:pl-7 focus-within:border-teal-500/40 focus-within:bg-teal-950/30 transition-all shadow-2xl backdrop-blur-md">
                        <textarea
                            placeholder="Message BrainBoosterAI..."
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                            }}
                            className="flex-1 bg-transparent py-4 resize-none outline-none text-teal-50 placeholder-teal-700/60 text-[15px] max-h-[200px] custom-scrollbar"
                        />
                        <div className="pb-2 pr-2">
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className={`p-3 md:p-3.5 rounded-2xl transition-all shadow-xl ${input.trim()
                                    ? 'bg-gradient-to-br from-teal-500 to-ocean-600 text-white hover:shadow-teal-500/30 active:scale-95'
                                    : 'bg-white/5 text-teal-900 cursor-not-allowed'
                                    }`}
                            >
                                <Send className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-teal-800 font-black uppercase tracking-widest mt-4">
                        Neural sync active • v8.4 Quantum Intelligence
                    </p>
                </div>
            </div>
        </div>
    );
};
