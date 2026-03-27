"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, User, FileText, CheckCircle, GraduationCap, LayoutDashboard, Globe, Search } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-primary-100 selection:text-primary-900">
      {/* Hero Section */}
      <section className="bg-[#0b1120] pt-32 pb-64 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[120px] -top-96 -right-20"></div>
          <div className="absolute w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] -bottom-32 -left-32"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 font-bold text-[10px] uppercase tracking-widest mb-8">
              <Globe className="w-3.5 h-3.5" />
              National Scholarship Discovery Infrastructure
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
              ScholarDoc <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Hub</span>
            </h1>
            <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
              Democratizing education by bridging the gap between <span className="text-white">ambition</span> and <span className="text-white">funding</span> through smart discovery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Platform Structure & Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div whileHover={{ y: -10 }} className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-slate-100">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20 text-white">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Unified Portal</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              A single window to explore thousands of scholarships from Central Ministries, State Governments, and Private Corporate Foundations.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} transition={{ delay: 0.1 }} className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-slate-100">
            <div className="w-16 h-16 bg-accent-teal-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-teal-500/20 text-white">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Smart Matching</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Our intelligent engine eliminates eligibility confusion by matching your profile parameters with specific scholarship guidelines instantly.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} transition={{ delay: 0.2 }} className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-slate-100">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-500/20 text-white">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Verified Trust</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Every scholarship listed is verified for authenticity, ensuring you only spend time on legitimate funding opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Flow - The Journey */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-[11px] font-black text-primary-600 tracking-[0.4em] uppercase mb-4">The Implementation Flow</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">How it Works, Step-by-Step</h3>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white border-2 border-primary-100 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:border-primary-500 transition-colors">
                  <User className="w-9 h-9 text-primary-600" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-black text-sm">1</div>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">Create Profile</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Input your verified academic and social profile data into our secure engine.</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white border-2 border-primary-100 rounded-full flex items-center justify-center mb-8 shadow-lg">
                  <Search className="w-9 h-9 text-accent-teal-500" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-teal-500 text-white rounded-full flex items-center justify-center font-black text-sm">2</div>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">Intelligent Scan</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Our engine scans 500+ active scholarships to find your perfect eligibility matches.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white border-2 border-primary-100 rounded-full flex items-center justify-center mb-8 shadow-lg">
                  <FileText className="w-9 h-9 text-accent-gold-500" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-gold-500 text-white rounded-full flex items-center justify-center font-black text-sm">3</div>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">Review Details</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Analyze benefits, deadlines, and document requirements in a transparent dashboard.</p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white border-2 border-primary-100 rounded-full flex items-center justify-center mb-8 shadow-lg">
                  <CheckCircle className="w-9 h-9 text-emerald-500" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black text-sm">4</div>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">Direct Application</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Proceed to the official provider portals with full confidence and verified paperwork.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full -mr-64 -mt-64 blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <GraduationCap className="w-16 h-16 mx-auto mb-8 opacity-50" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">Ready to secure your educational future?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-5 bg-white text-primary-700 rounded-2xl text-lg font-black shadow-xl hover:-translate-y-1 transition-all uppercase tracking-widest text-sm">
              Explore Scholarships
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
