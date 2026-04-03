"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export default function HelpChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "assistant", content: "Hi! I'm the ScholarDoc Hub assistant. How can I help you with your website inquiries today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: userMessage.content, lang: "English" }),
            });

            if (!response.ok) throw new Error("Failed to fetch response");
            const data = await response.json();

            setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative inline-block z-50 text-slate-900">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-300"
            >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
            </button>

            {isOpen && (
                <div className="fixed sm:absolute top-16 right-4 sm:top-10 sm:right-0 w-80 sm:w-96 h-[500px] sm:h-[450px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                    {/* Header */}
                    <div className="bg-primary-900 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            <span className="font-semibold">Support Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-primary-800 p-1.5 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === "user"
                                    ? "bg-primary-600 text-white rounded-tr-none"
                                    : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none"
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 shadow-sm p-3 rounded-2xl rounded-tl-none">
                                    <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-1 bg-slate-100 placeholder:text-slate-400 text-slate-900 text-sm rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white p-2.5 rounded-full transition-colors shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
