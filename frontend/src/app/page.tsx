"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, ShieldCheck, FileCheck, CheckCircle2, UserCheck, LayoutDashboard, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { user, language } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

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
              <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-primary-700 hover:bg-primary-950 text-white rounded-2xl text-lg font-black shadow-xl shadow-primary-500/30 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 uppercase tracking-widest text-sm">
                {t("GetStarted", language)}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl text-lg font-black shadow-sm transition-all text-center uppercase tracking-widest text-sm">
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


      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary-600 text-xs font-black tracking-[0.3em] uppercase mb-4">{t("ProcessTitle", language)}</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{t("HowItWorksTitle", language)}</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative max-w-6xl mx-auto px-4">
            <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-primary-100 via-primary-400 to-primary-100 z-0"></div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative z-10 text-center hover:shadow-primary-500/10 transition-all hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-primary-50 text-primary-700 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-primary-100 rotate-3 group-hover:rotate-0 transition-transform">
                <UserCheck className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4">{t("Step1Title", language)}</h4>
              <p className="text-slate-500 leading-relaxed font-bold text-sm">{t("Step1Desc", language)}</p>
            </div>

            <div className="bg-primary-900 p-10 rounded-[2.5rem] shadow-2xl relative z-10 text-center hover:shadow-primary-500/30 transition-all hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-primary-700 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl -rotate-3 group-hover:rotate-0 transition-transform">
                <LayoutDashboard className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-white mb-4">{t("Step2Title", language)}</h4>
              <p className="text-primary-200 leading-relaxed font-bold text-sm">{t("Step2Desc", language)}</p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative z-10 text-center hover:shadow-primary-500/10 transition-all hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-accent-teal-50 text-accent-teal-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-accent-teal-100 rotate-3 group-hover:rotate-0 transition-transform">
                <FileCheck className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4">{t("Step3Title", language)}</h4>
              <p className="text-slate-500 leading-relaxed font-bold text-sm">{t("Step3Desc", language)}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-20 border-t-8 border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-xl">
                <BookOpen className="text-white w-7 h-7" />
              </div>
              <span className="font-black text-2xl text-white tracking-tighter">ScholarDoc Hub</span>
            </div>
            <p className="text-sm leading-relaxed font-bold">{t("FooterDesc", language)}</p>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">About Us</h4>
            <div className="space-y-6 text-sm font-medium leading-relaxed max-w-3xl">
              <p>
                <strong>ScholarDoc Hub</strong> is a revolutionary National Scholarship Discovery Portal designed to bridge the gap between deserving students and life-changing educational funding. Our smart infrastructure aggregates scholarship opportunities from across various state, federal, and private providers into a single, comprehensive timeline.
              </p>
              <p className="opacity-80">
                Whether you are a high school senior, an undergraduate looking to fund your next semester, or a graduate student pursuing research grants, ScholarDoc Hub streamlines your journey from discovery to success through our secure database, smart eligibility engine, and interactive dashboard.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full">
                  <BookOpen className="w-4 h-4 text-primary-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Comprehensive Database</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-accent-teal-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Secure & Verified</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full">
                  <FileCheck className="w-4 h-4 text-accent-gold-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Smart Engine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-10 border-t border-slate-900 text-[10px] text-center font-black uppercase tracking-widest opacity-40">
          &copy; {new Date().getFullYear()} {t("CopyrightNotice", language)}
        </div>
      </footer>
    </div>
  );
}
