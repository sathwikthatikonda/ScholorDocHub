"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, MessageSquare, Volume2, StopCircle, Sparkles, Send } from "lucide-react";
import { useStore } from "@/store/useStore";
import { t, languageOptions } from "@/lib/i18n";

export default function VoiceAssistant() {
    const { language } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const speakText = (text: string) => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        if (!window.speechSynthesis) return;

        const langOpt = languageOptions.find(o => o.code === language);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langOpt ? langOpt.ttsCode : "en-IN";
        utterance.rate = 1.0;
        utterance.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    if (!mounted) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary-950 p-6 text-white relative">
                            <div className="absolute top-0 right-0 p-4">
                                <button onClick={() => setIsOpen(false)} className="text-primary-300 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary-800 rounded-xl">
                                    <Sparkles className="w-5 h-5 text-accent-gold-400" />
                                </div>
                                <h3 className="font-bold text-lg">{t("AIAssistant", language)}</h3>
                            </div>
                            <p className="text-primary-300 text-xs font-medium uppercase tracking-widest">Always Online</p>
                        </div>

                        {/* Body */}
                        <div className="p-6 bg-slate-50 space-y-4 min-h-[200px] flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-2 relative">
                                <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-20"></div>
                                <Mic className="w-8 h-8 text-primary-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-1">{t("AskMe", language)}</h4>
                                <p className="text-slate-500 text-sm">I can read scholarships for you or guide you through the portal.</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2 gap-2">
                            <button
                                onClick={() => speakText("Welcome to ScholarDoc Hub. I am your multilingual voice assistant.")}
                                className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-primary-50 text-primary-700 rounded-xl text-xs font-bold transition-all border border-slate-100"
                            >
                                <Volume2 className="w-4 h-4" /> Intro
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-100"
                            >
                                <MessageSquare className="w-4 h-4" /> Tutorial
                            </button>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-50 flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Type a question..."
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                            />
                            <button className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all relative z-50 ${isOpen ? 'bg-white text-primary-900 border border-slate-200' : 'bg-primary-950 text-white hover:bg-primary-900'}`}
            >
                {isOpen ? <X className="w-8 h-8" /> : (
                    <>
                        <Mic className="w-8 h-8" />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-gold-500 rounded-full border-2 border-primary-950 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-primary-950" />
                        </div>
                    </>
                )}
            </motion.button>
        </div>
    );
}
