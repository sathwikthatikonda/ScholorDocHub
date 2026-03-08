"use client";

import { motion } from "framer-motion";
import { BookOpen, ShieldCheck, FileCheck, CheckCircle2, UserCheck, LayoutDashboard, Search, Award, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <section className="bg-white border-b border-slate-200 py-16 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute w-[400px] h-[400px] bg-primary-100/30 rounded-full blur-3xl -top-32 -right-32 opacity-60"></div>
                    <div className="absolute w-[400px] h-[400px] bg-accent-teal-100/20 rounded-full blur-3xl -bottom-32 -left-32 opacity-60"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            About <span className="text-primary-600">ScholarDoc Hub</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                            Empowering the next generation of scholars by simplifying the path to educational funding.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Our Vision</h2>
                                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                    At ScholarDoc Hub, we believe that financial constraints should never stand in the way of academic excellence. In an increasingly complex educational landscape, students often miss out on life-changing scholarships simply because they didn't know they existed or couldn't navigate the application process.
                                </p>
                                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                    We've built a centralized, intelligent infrastructure that transparently bridges the gap between deserving students and scholarship providers across India and beyond.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center text-primary-600 mb-4 font-bold">
                                        <Search className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-2 italic">Easy Discovery</h3>
                                    <p className="text-sm text-slate-500 font-bold italic">Find relevant scholarships in seconds using our advanced filters.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="bg-accent-teal-50 w-12 h-12 rounded-xl flex items-center justify-center text-accent-teal-600 mb-4 font-bold">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-2 italic">Verified Listings</h3>
                                    <p className="text-sm text-slate-500 font-bold italic">Every scholarship is vetted by our team to ensure authenticity.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary-900 rounded-[2.5rem] p-10 text-white relative flex flex-col justify-center items-center">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-gold-400 rounded-full blur-3xl opacity-20"></div>
                            <h2 className="text-3xl font-black mb-8 text-center italic">What We Offer</h2>
                            <div className="space-y-6 w-full">
                                <div className="flex gap-4">
                                    <div className="bg-primary-700/50 p-3 rounded-xl h-fit">
                                        <CheckCircle2 className="w-6 h-6 text-accent-teal-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black mb-1 italic">Real-time Deadlines</h4>
                                        <p className="text-primary-100 font-bold italic">Never miss an opportunity with our integrated countdown system.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-primary-700/50 p-3 rounded-xl h-fit">
                                        <CheckCircle2 className="w-6 h-6 text-accent-teal-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black mb-1 italic">Personalized Matches</h4>
                                        <p className="text-primary-100 font-bold italic">Our AI engine matches you with scholarships based on your unique profile.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-primary-700/50 p-3 rounded-xl h-fit">
                                        <CheckCircle2 className="w-6 h-6 text-accent-teal-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black mb-1 italic">Secure Document Vault</h4>
                                        <p className="text-primary-100 font-bold italic">Safely store and manage all application documents in one place.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Section */}
            <section className="py-20 bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-black text-slate-900 mb-12 tracking-tight italic">Why Choose ScholarDoc?</h2>
                    <div className="grid md:grid-cols-3 gap-10 text-center">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-primary-600 border border-slate-100 font-bold">
                                <Users className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 italic">User-Centric</h4>
                            <p className="text-slate-500 font-bold italic">Designed specifically for students, by education experts.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-primary-600 border border-slate-100 font-bold">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 italic">Data Security</h4>
                            <p className="text-slate-500 font-bold italic">Your information is protected by industry-leading encryption.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-primary-600 border border-slate-100 font-bold">
                                <Search className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 italic">Global Reach</h4>
                            <p className="text-slate-500 font-bold italic">Access local, state, national, and international scholarships.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-primary-50 p-12 rounded-[3rem] border border-primary-100">
                    <h2 className="text-3xl font-black text-slate-900 mb-6 italic tracking-tight">Ready to Find Your Future?</h2>
                    <p className="text-lg text-slate-600 mb-10 font-medium font-bold italic">Join thousands of students who have already started their journey with us.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register" className="premium-button-primary px-10 py-4 uppercase text-sm font-black italic tracking-widest">
                            Get Started Now
                        </Link>
                        <Link href="/dashboard" className="premium-button-secondary px-10 py-4 uppercase text-sm font-black italic tracking-widest">
                            Browse Scholarships
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
