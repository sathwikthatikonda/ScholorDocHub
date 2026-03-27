"use client";

import { User, Zap, FileText, CheckCircle } from "lucide-react";
import React from "react";

export default function HowItWorksPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 min-h-screen">
      <section className="w-full">
        {/* Top Dark Background Section */}
        <div className="bg-slate-900 py-24 px-4 sm:px-6 lg:px-8 text-center text-white pb-32">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">How ScholarDoc Hub Works</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discovering government benefits shouldn't be a mystery. Here's how our portal simplifies the process for you.
          </p>
        </div>

        {/* Bottom Light Section with Overlapping Cards */}
        <div className="bg-white px-4 sm:px-6 lg:px-8 pb-24 -mt-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-start min-h-[350px]">
              <div className="w-14 h-14 bg-blue-500 text-white rounded-[1rem] flex items-center justify-center mb-8 shadow-md">
                <User className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">STEP 1</h4>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Create Your Profile</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">
                Fill in your basic details like age, location, income, and occupation. Our system uses this to find relevant matches.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-start min-h-[350px]">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-[1rem] flex items-center justify-center mb-8 shadow-md">
                <Zap className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">STEP 2</h4>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Intelligent Analysis</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">
                Our system analyzes 500+ schemes across Central and State departments to identify programs you are eligible for.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-start min-h-[350px]">
              <div className="w-14 h-14 bg-purple-500 text-white rounded-[1rem] flex items-center justify-center mb-8 shadow-md">
                <FileText className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">STEP 3</h4>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Review Requirements</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">
                See benefits, eligibility criteria, and mandatory documents for each scheme in simple, easy to understand details.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-start min-h-[350px]">
              <div className="w-14 h-14 bg-green-500 text-white rounded-[1rem] flex items-center justify-center mb-8 shadow-md">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">STEP 4</h4>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Apply Securely</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">
                Redirect to the official government portal with all the information you need to complete your application successfully.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
