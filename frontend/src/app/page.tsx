"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, ShieldCheck, FileCheck, CheckCircle2, UserCheck, LayoutDashboard, BookOpen, User, Zap, FileText, CheckCircle, Trophy, Banknote, School, Heart, FlaskConical, Wrench, Plane, Landmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { user, language } = useStore();
  const router = useRouter();


  return (
    <div className="flex-1 w-full bg-slate-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[800px] h-[800px] bg-primary-100/50 rounded-full blur-3xl -top-64 -right-64 opacity-60"></div>
          <div className="absolute w-[600px] h-[600px] bg-accent-teal-100/40 rounded-full blur-3xl -bottom-32 -left-32 opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-24 md:pt-32 md:pb-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 font-bold text-xs mb-8 shadow-sm uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              {t("EmpoweringStudents", language)}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              {t("LandingTitle", language)} <span className="text-primary-600 block md:inline mt-2">{t("Eligibility", language)}</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              {t("LandingSubtitle", language)}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-primary-700 hover:bg-primary-950 text-white rounded-2xl text-lg font-black shadow-xl shadow-primary-500/30 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 uppercase tracking-widest text-sm">
                  {t("ExploreScholarships", language)}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-primary-700 hover:bg-primary-950 text-white rounded-2xl text-lg font-black shadow-xl shadow-primary-500/30 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 uppercase tracking-widest text-sm">
                  {t("GetStarted", language)}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <Link href="/about" className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl text-lg font-black shadow-sm transition-all text-center uppercase tracking-widest text-sm">
                {t("LearnMore", language)}
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100"><CheckCircle2 className="w-4 h-4 text-accent-teal-500" /> {t("TrustworthyProviders", language)}</div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100"><CheckCircle2 className="w-4 h-4 text-accent-teal-500" /> {t("AccurateFilter", language)}</div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100"><CheckCircle2 className="w-4 h-4 text-accent-teal-500" /> {t("FreeStudents", language)}</div>
            </div>
          </motion.div>
        </div>
      </section>



      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent-teal-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight"
            >
              {t("ScholarshipCategories", language)}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-600 max-w-2xl mx-auto font-medium"
            >
              {t("ScholarshipCategoriesSubtitle", language)}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: "MeritBased", icon: Trophy, color: "from-amber-400 to-amber-600", lightColor: "bg-amber-50" },
              { key: "NeedBased", icon: Banknote, color: "from-green-400 to-green-600", lightColor: "bg-green-50" },
              { key: "SchoolStudents", icon: School, color: "from-blue-400 to-blue-600", lightColor: "bg-blue-50" },
              { key: "CollegeUniversity", icon: GraduationCap, color: "from-purple-400 to-purple-600", lightColor: "bg-purple-50" },
              { key: "GirlsWomen", icon: Heart, color: "from-rose-400 to-rose-600", lightColor: "bg-rose-50" },
              { key: "ScienceResearch", icon: FlaskConical, color: "from-teal-400 to-teal-600", lightColor: "bg-teal-50" },
              { key: "TechnicalEngineering", icon: Wrench, color: "from-orange-400 to-orange-600", lightColor: "bg-orange-50" },
              { key: "StudyAbroad", icon: Plane, color: "from-cyan-400 to-cyan-600", lightColor: "bg-cyan-50" },
              { key: "GovSchemes", icon: Landmark, color: "from-slate-600 to-slate-800", lightColor: "bg-slate-100" },
            ].map((cat, idx) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="group relative bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] group-hover:bg-slate-100 transition-colors pointer-events-none -z-10"></div>
                
                <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg shadow-inner`}>
                  <cat.icon className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-4">
                  {t(cat.key, language)}
                </h3>
                <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <cat.icon className="w-32 h-32" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-20 border-t-8 border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-xl">
                <BookOpen className="text-white w-7 h-7" />
              </div>
              <span className="font-black text-2xl text-white tracking-tighter">ScholarDoc Hub</span>
            </div>
            <p className="text-sm leading-relaxed font-bold">
              Empowering students to discover and access educational scholarships. Your one-stop platform for finding funding you're eligible for.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Quick Links</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/dashboard" className="hover:text-primary-400 transition-colors">Find Scholarships</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary-400 transition-colors">How It Works</Link></li>
              <li><Link href="/login" className="hover:text-primary-400 transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Legal</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><button className="hover:text-primary-400 transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-primary-400 transition-colors">Terms of Service</button></li>
              <li><button className="hover:text-primary-400 transition-colors">Disclaimer</button></li>
              <li><button className="hover:text-primary-400 transition-colors">Accessibility Statement</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Gov Resources</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">National Scholarship Portal</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-10 border-t border-slate-900 text-[10px] text-center font-black uppercase tracking-widest opacity-40">
          &copy; {new Date().getFullYear()} {t("CopyrightNotice", language)}
        </div>
      </footer>
    </div>
  );
}
