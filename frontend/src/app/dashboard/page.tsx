"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/i18n";
import { Calendar, Building2, ExternalLink, Bookmark, Search, GraduationCap, MapPin, ChevronRight, LayoutDashboard, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
    const { user, token, language } = useStore();
    const router = useRouter();
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchScholarships = async () => {
            try {
                const profile = user?.profile;
                let query = "";
                if (profile) {
                    const params = new URLSearchParams();
                    if (profile.educationLevel) params.append("educationLevel", profile.educationLevel);
                    if (profile.category) params.append("category", profile.category);
                    if (profile.annualFamilyIncome) params.append("incomeLimit", profile.annualFamilyIncome);
                    if (profile.stateOfResidence) params.append("state", profile.stateOfResidence);
                    if (profile.marksPercentage) params.append("marksPercentage", profile.marksPercentage);
                    query = `?${params.toString()}`;
                }

                const res = await api.get(`/scholarships${query}`);
                setScholarships(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarships();
    }, [token, user, router]);


    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-120px)] w-full max-w-[1400px] mx-auto">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0 p-6 md:border-r border-slate-200 sticky top-20 h-fit hidden md:block">
                <div className="mb-8">
                    <h3 className="font-bold text-slate-900 text-lg mb-1 uppercase tracking-tight">{user?.name}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary-50 text-primary-700 uppercase tracking-widest border border-primary-200">{t("VerifiedKYC", language)}</span>
                </div>
                <nav className="space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 bg-primary-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-primary-500/20 text-sm">
                        <Search className="w-5 h-5" /> {t("Recommended", language)}
                    </Link>
                    <Link href="#saved" className="flex items-center gap-3 text-slate-600 hover:bg-slate-100 px-4 py-3 rounded-xl font-bold transition-all text-sm">
                        <Bookmark className="w-5 h-5" /> {t("SavedApplications", language)}
                    </Link>
                    <Link href="/questionnaire" className="flex items-center gap-3 text-slate-600 hover:bg-slate-100 px-4 py-3 rounded-xl font-bold transition-all text-sm">
                        <Settings className="w-5 h-5" /> {t("UpdateProfile", language)}
                    </Link>
                </nav>

                <div className="mt-12 p-4 bg-primary-50 border border-primary-100 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-20 rounded-bl-full pointer-events-none"></div>
                    <h4 className="font-bold text-primary-800 text-xs mb-2 relative z-10 uppercase tracking-widest">{t("StatusTracker", language)}</h4>
                    <p className="text-[10px] text-primary-600 mb-4 relative z-10 leading-normal font-medium">{t("TrackerDesc", language)}</p>
                    <div className="w-full h-2 bg-primary-200 rounded-full relative z-10 overflow-hidden shadow-inner">
                        <div className="w-1/3 h-full bg-accent-teal-500 rounded-full"></div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 p-6 lg:p-10 w-full min-w-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t("Directory", language)}</h1>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">{t("DirectoryDesc", language)}</p>
                    </div>

                    <Link href="/questionnaire" className="md:hidden premium-button-secondary w-full justify-center">
                        {t("UpdateProfile", language)}
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center flex-col items-center py-24 gap-6">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
                        <span className="text-slate-500 font-bold animate-pulse text-sm uppercase tracking-widest">{t("MatchingEngine", language)}</span>
                    </div>
                ) : scholarships.length === 0 ? (
                    <div className="glass-panel p-16 text-center rounded-3xl flex flex-col items-center bg-white shadow-2xl max-w-2xl mx-auto my-10 border-slate-100">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3">{t("NoMatchesTitle", language)}</h3>
                        <p className="text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                            {t("NoMatchesDesc", language)}
                        </p>
                        <Link href="/questionnaire" className="premium-button-primary mt-10 px-8">
                            {t("ReturnProfile", language)}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
                        <AnimatePresence>
                            {scholarships.map((sch, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={sch._id}
                                    onClick={() => router.push(`/scholarships/${sch._id}`)}
                                    className="premium-card flex flex-col group cursor-pointer relative overflow-hidden"
                                >
                                    {/* Banner border on top */}
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-accent-teal-400"></div>

                                    <div className="p-6 md:p-8 flex-1 flex flex-col pt-8">
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                                                {sch.name}
                                            </h3>
                                            <div className="shrink-0 p-2 bg-slate-50 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity bg-primary-50 group-hover:text-primary-600">
                                                <ExternalLink className="w-5 h-5 -rotate-45" />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm font-semibold text-slate-600 mb-5 pb-5 border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-primary-500 shrink-0" />
                                                <span className="truncate max-w-[150px]">{sch.provider}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-accent-gold-500 shrink-0" />
                                                <span>{sch.educationLevel?.join(", ") || "All"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span>{sch.state || "All India"}</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                            {sch.description}
                                        </p>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-4 pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">{t("Deadline", language)}</span>
                                                <div className="flex items-center gap-2 text-accent-gold-600 text-sm font-bold bg-amber-50 px-3 py-1.5 rounded-md border border-amber-100">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(sch.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </div>
                                            <button className="text-primary-600 group-hover:bg-primary-600 group-hover:text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center bg-primary-50 border border-transparent shadow-sm">
                                                {t("ViewRequirements", language)} <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
