"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, X, Languages, Loader2, Volume2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const languagesList = [
    { code: "en-IN", synthCode: "en-IN", name: "English (India)" },
    { code: "hi-IN", synthCode: "hi-IN", name: "Hindi" },
    { code: "te-IN", synthCode: "te-IN", name: "Telugu" },
    { code: "ta-IN", synthCode: "ta-IN", name: "Tamil" },
    { code: "mr-IN", synthCode: "mr-IN", name: "Marathi" },
    { code: "bn-IN", synthCode: "bn-IN", name: "Bengali" },
    { code: "gu-IN", synthCode: "gu-IN", name: "Gujarati" },
    { code: "kn-IN", synthCode: "kn-IN", name: "Kannada" },
    { code: "ml-IN", synthCode: "ml-IN", name: "Malayalam" },
    { code: "en-US", synthCode: "en-US", name: "English (US)" },
    { code: "es-ES", synthCode: "es-ES", name: "Spanish" },
    { code: "fr-FR", synthCode: "fr-FR", name: "French" },
];

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [reply, setReply] = useState("");
    const [language, setLanguage] = useState("hi-IN"); // Defaulting to Hindi to showcase multi-language capability
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = true;

                recognitionRef.current.onresult = async (event: any) => {
                    let currentTranscript = "";
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                    setTranscript(currentTranscript);

                    // Only send if it's the final result
                    if (event.results[event.results.length - 1].isFinal) {
                        setIsListening(false);
                        await handleSendToAI(currentTranscript);
                    }
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                    setReply("Sorry, I didn't catch that. Please click the mic and try again.");
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }
    }, [language]);

    const toggleListen = () => {
        if (!recognitionRef.current) {
            alert("Speech Recognition API is not supported in this browser. Please use Chrome, Edge, or Safari.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setTranscript("");
            setReply("");
            recognitionRef.current.lang = language;
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleSendToAI = async (text: string) => {
        if (!text.trim()) return;
        setIsProcessing(true);
        setReply("Thinking...");

        // Stop any ongoing speech
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        try {
            const selectedLangName = languagesList.find((l) => l.code === language)?.name || "English";
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const response = await fetch(`${backendUrl}/api/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text, lang: selectedLangName }),
            });
            const data = await response.json();
            setReply(data.reply);
            speakText(data.reply, language);
        } catch (error) {
            console.error("Failed to send to AI", error);
            setReply("Could not connect to the AI engine. Please ensure the backend server is running.");
        } finally {
            setIsProcessing(false);
        }
    };

    const speakText = (text: string, langCode: string) => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = langCode;

            // Try to find a voice that matches the language
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.lang.includes(langCode) || v.lang.includes(langCode.split('-')[0]));
            if (voice) {
                utterance.voice = voice;
            }

            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="mb-4 w-[340px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md pb-6 relative">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                                    <Mic className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Swayam Assistant</h3>
                                    <p className="text-xs text-blue-100 font-medium">Multilingual Voice Assistant</p>
                                </div>
                            </div>
                            <div className="flex gap-2 relative z-10">
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                                    title="Change Language"
                                >
                                    <Languages className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        stopSpeaking();
                                        if (isListening && recognitionRef.current) recognitionRef.current.stop();
                                    }}
                                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Decorative wave */}
                            <div className="absolute -bottom-2 left-0 right-0 h-4 bg-white rounded-tl-[100%] rounded-tr-[100%]"></div>
                        </div>

                        {/* Language Settings Panel */}
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-slate-50 border-b border-slate-100 px-4 py-3"
                                >
                                    <label className="text-xs font-semibold text-slate-500 mb-1 block uppercase tracking-wider">
                                        Speaking & Listening Language
                                    </label>
                                    <select
                                        value={language}
                                        onChange={(e) => {
                                            setLanguage(e.target.value);
                                            setShowSettings(false);
                                        }}
                                        className="w-full text-sm bg-white p-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700 shadow-sm"
                                    >
                                        {languagesList.map((l) => (
                                            <option key={l.code} value={l.code}>
                                                {l.name}
                                            </option>
                                        ))}
                                    </select>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Conversation Area */}
                        <div className="p-5 flex-1 min-h-[180px] flex flex-col justify-end bg-slate-50/50">
                            {transcript || reply ? (
                                <div className="space-y-4 flex flex-col">
                                    {transcript && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-blue-100 mt-2 text-blue-900 px-4 py-3 rounded-2xl rounded-tr-sm text-sm self-end max-w-[85%] shadow-sm border border-blue-200/50"
                                        >
                                            {transcript}
                                        </motion.div>
                                    )}
                                    {reply && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white text-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm text-sm self-start shadow-sm border border-slate-200 max-w-[90%] relative group"
                                        >
                                            {reply}
                                            <button
                                                onClick={() => speakText(reply, language)}
                                                className="absolute -right-2 -bottom-2 bg-indigo-100 text-indigo-600 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Replay Audio"
                                            >
                                                <Volume2 className="w-3.5 h-3.5" />
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-slate-400 py-6 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                        <Mic className="w-8 h-8 text-blue-200" />
                                    </div>
                                    <p className="text-sm font-medium">Ask Swayam anything in your native language!</p>
                                    <p className="text-xs mt-1 text-slate-400">Click the microphone to start.</p>
                                </div>
                            )}

                            {isProcessing && (
                                <div className="flex gap-1.5 justify-start mt-4 px-2">
                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0, duration: 0.6 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.2, duration: 0.6 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.4, duration: 0.6 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                </div>
                            )}
                        </div>

                        {/* Mic Action Bar */}
                        <div className="p-4 bg-white border-t border-slate-100 flex justify-center pb-5 pt-3">
                            <button
                                onClick={toggleListen}
                                disabled={isProcessing}
                                className={`relative group flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${isListening
                                    ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200"
                                    : isProcessing
                                        ? "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-blue-200"
                                    }`}
                            >
                                {/* Ping animation when listening */}
                                {isListening && (
                                    <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></span>
                                )}

                                {isProcessing ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <Mic className={`w-7 h-7 relative z-10 ${isListening ? 'animate-pulse' : ''}`} />
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300 transition-shadow relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <Mic className="w-7 h-7 relative z-10" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 border-2 border-white"></span>
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
