"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { api } from "@/lib/api";
import { t, languageOptions } from "@/lib/i18n";
import { ExternalLink, Volume2, CheckCircle, Calendar, GraduationCap, Building2, User, StopCircle, ArrowLeft, BriefcaseMedical, Landmark, BadgeAlert, FileCheck2, Info, CheckSquare, ShieldAlert, Copy, Link as LinkIcon, X, MapPin, Navigation, History, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Guidance data for common documents
const docGuidance: Record<string, { steps: string[], centers: string[], mapQuery: string }> = {
    "Income Certificate": {
        steps: [
            "Visit the official State E-District portal OR go to your nearest CSC center.",
            "Submit Form No. 16/A and self-declaration of income.",
            "Attach Aadhaar Card, Ration Card, and Salary Slips (if applicable).",
            "Get verification done by the Village Revenue Officer (VRO) or Tahsildar.",
            "Certificate is usually issued within 7-15 working days."
        ],
        centers: ["Common Service Centres (CSC)", "Tahsildar Office", "E-Mitra (Rajasthan)", "MeeSeva (AP/Telangana)"],
        mapQuery: "Income Certificate application center"
    },
    "Caste Certificate": {
        steps: [
            "Apply online through the E-District portal of your state.",
            "Submit proof of caste (Family tree/Old caste certificates of relatives).",
            "Attach Residence proof (Voter ID/Aadhaar).",
            "Verification by Revenue Inspector is mandatory.",
            "Final certificate can be downloaded online once approved."
        ],
        centers: ["CSC Centers", "Revenue Department Office", "MeeSeva", "Jan Seva Kendra"],
        mapQuery: "Caste Certificate application center"
    },
    "Domicile Certificate": {
        steps: [
            "Proof of residence for the last 15 years in the state is required.",
            "Submit Address proof (Electricity Bill/Ration Card).",
            "Affidavit on a ₹10/₹100 stamp paper might be required in some states.",
            "Apply via CSC or the State's Resident Portal."
        ],
        centers: ["Tehsil Office", "CSC Centers", "E-Seva"],
        mapQuery: "Domicile Certificate office"
    },
    "Aadhaar Card": {
        steps: [
            "Book an appointment at an Aadhaar Enrollment Center.",
            "Carry valid Identity and Address proof.",
            "Provide biometric data (fingerprints and iris scan).",
            "Track status on UIDAI website after getting enrollment ID."
        ],
        centers: ["Aadhaar Enrollment Center", "Bank Branches", "Post Offices"],
        mapQuery: "Aadhaar Enrollment Center"
    },
    "Bank Passbook": {
        steps: [
            "Visit your nearest Nationalized Bank (SBI, PNB, etc.).",
            "Open a Savings Account (preferably Jan Dhan account for Zero balance).",
            "Ensure your Aadhaar is seeded/linked for DBT (Direct Benefit Transfer).",
            "Request a printed passbook with your Photo, IFSC code, and Account Number."
        ],
        centers: ["Public Sector Banks", "Regional Rural Banks", "Post Office Banks"],
        mapQuery: "Nationalized Bank near me"
    }
};

const defaultGuidance = {
    steps: [
        "Refer to the scholarship's official guidelines for this specific document.",
        "Ensure the document is self-attested if required.",
        "Keep both original and scanned digital copies ready."
    ],
    centers: ["CSC Centers", "District Collector Office", "Respective Sub-Divisional Office"],
    mapQuery: "Government Service Center"
};

export default function ScholarshipDetails() {
    const params = useParams();
    const router = useRouter();
    const { language, token } = useStore();
    const [scholarship, setScholarship] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchScholarship = async () => {
            try {
                const res = await api.get(`/scholarships/${params.id}`);
                setScholarship(res.data);
            } catch (err) {
                console.error("Failed to fetch scholarship:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchScholarship();

        // Optional: Get user location for more "connected" feel
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => console.log("Location access denied")
            );
        }

        return () => {
            window.speechSynthesis.cancel();
        };
    }, [params.id, token, router]);

    const toggleSpeech = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        if (!scholarship || !window.speechSynthesis) return;

        const langOpt = languageOptions.find(o => o.code === language);
        const speech = new SpeechSynthesisUtterance();

        speech.text = `
      ${t("AppName", language)}: ${scholarship.name}.
      ${t("Provider", language)}: ${scholarship.provider}.
      ${scholarship.description}.
      ${t("Eligibility", language)}: ${scholarship.eligibilityCriteria || "Not specified"}.
      ${t("Benefits", language)}: ${scholarship.benefits}.
    `;

        speech.lang = langOpt ? langOpt.ttsCode : "en-IN";
        speech.rate = 0.9;

        speech.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(speech);
        setIsSpeaking(true);
    };

    const toggleDocCheck = (idx: number) => {
        setCheckedDocs(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    const findGuidance = (docName: string) => {
        // Try to find a match in the guidance keys
        const key = Object.keys(docGuidance).find(k => docName.toLowerCase().includes(k.toLowerCase()));
        return key ? docGuidance[key] : defaultGuidance;
    };

    if (loading) {
        return (
            <div className="flex justify-center flex-col items-center py-40 gap-4">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <span className="text-slate-500 font-semibold animate-pulse tracking-wide">Retrieving Official Documentation...</span>
            </div>
        );
    }

    if (!scholarship) return <div className="p-20 text-center font-bold text-slate-500">Official Scholarship Records not found or unavailable.</div>;

    const currentDocInfo = selectedDoc ? findGuidance(selectedDoc) : null;

    return (
        <div className="w-full bg-slate-50 flex-1">
            {/* HEADER HERO */}
            <div className="bg-primary-950 text-white relative overflow-hidden border-b border-primary-900 shadow-sm z-0 pt-8 pb-32">
                <div className="absolute inset-0 opacity-10 pattern-grid"></div>
                <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-primary-800 rounded-full blur-3xl opacity-40"></div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-primary-300 hover:text-white mb-8 font-medium transition-colors text-sm uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> {t("Back", language)}
                    </button>

                    <div className="flex justify-between items-start gap-8 flex-col lg:flex-row">
                        <div className="max-w-4xl">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="bg-primary-800 text-primary-200 px-3 py-1 text-xs font-bold rounded flex items-center gap-2 border border-primary-700/50 uppercase tracking-widest">
                                    <Landmark className="w-3.5 h-3.5" /> {t("VerifiedPortal", language)}
                                </span>
                                {scholarship.minorityStatus && (
                                    <span className="bg-accent-teal-900 text-accent-teal-200 px-3 py-1 text-xs font-bold rounded border border-accent-teal-800/50 uppercase tracking-widest">
                                        Minority Specialized
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                                {scholarship.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-primary-200 font-medium">
                                <div className="flex items-center gap-2"><Building2 className="w-5 h-5 text-primary-400" /> {scholarship.provider}</div>
                                <div className="flex items-center gap-2 bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20"><Calendar className="w-4 h-4" /> {t("ClosingDate", language)}: {new Date(scholarship.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            </div>
                        </div>

                        <button
                            onClick={toggleSpeech}
                            className={`flex-shrink-0 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border font-bold text-sm shadow-xl transition-all ${isSpeaking ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20 shadow-red-500/10' : 'bg-primary-800 text-white border-primary-700 hover:bg-primary-700 shadow-primary-900'}`}
                            title="Listen to details via AI Voice"
                        >
                            {isSpeaking ? (
                                <><StopCircle className="w-5 h-5 animate-pulse" /> Stop Narration</>
                            ) : (
                                <><Volume2 className="w-5 h-5 text-accent-teal-400" /> {t("ReadAloud", language)}</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT CONTAINERS */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Primary Details Panel */}
                    <div className="flex-1 space-y-8">

                        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-md">
                            <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4 mb-6 uppercase tracking-widest text-sm">
                                <Info className="w-5 h-5 text-primary-600" /> {t("ProgramOverview", language)}
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line antialiased">
                                {scholarship.description}
                            </p>
                        </motion.section>

                        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-md">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4 mb-6 uppercase tracking-widest text-sm">
                                        <ShieldAlert className="w-5 h-5 text-amber-500" /> {t("KeyEligibility", language)}
                                    </h2>
                                    <ul className="space-y-3 text-slate-600 mb-6 text-sm">
                                        {scholarship.eligibilityCriteria?.split(/[.;]\s+/).map((crit: string, i: number) => (
                                            crit.trim().length > 0 && (
                                                <li key={i} className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                                    <span>{crit.trim().replace(/\.$/, "")}.</span>
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        {scholarship.incomeLimit && (
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Income Limit</span>
                                                <span className="text-sm font-bold text-primary-900">₹{scholarship.incomeLimit.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {scholarship.marksRequirement > 0 && (
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Min. Marks</span>
                                                <span className="text-sm font-bold text-primary-900">{scholarship.marksRequirement}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4 mb-6 uppercase tracking-widest text-sm">
                                        <User className="w-5 h-5 text-green-500" /> {t("BenefitPackage", language)}
                                    </h2>
                                    <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <BriefcaseMedical className="w-6 h-6 text-green-700" />
                                            </div>
                                            <span className="text-xs font-bold text-green-800 uppercase tracking-wider">{t("FinancialRewards", language)}</span>
                                        </div>
                                        <p className="text-green-900 font-medium leading-relaxed">{scholarship.benefits}</p>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <Info className="w-4 h-4 text-slate-400" />
                                        <p className="text-[10px] text-slate-500 font-medium leading-tight">
                                            Disbursement via Direct Benefit Transfer (DBT) to linked Aadhaar account.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-md">
                            <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4 mb-6 uppercase tracking-widest text-sm">
                                <FileCheck2 className="w-5 h-5 text-accent-teal-600" /> {t("DocumentChecklist", language)}
                            </h2>
                            <p className="text-sm font-medium text-slate-500 mb-6">Use this interactive checklist to prepare all verified documents prior to external application. Click "How to Apply" for centers near you.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
                                {scholarship.requiredDocuments.length > 0 ? (
                                    scholarship.requiredDocuments.map((doc: string, idx: number) => (
                                        <div
                                            key={idx}
                                            className={`flex flex-col p-4 rounded-xl border-2 transition-all group ${checkedDocs[idx] ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div
                                                    onClick={() => toggleDocCheck(idx)}
                                                    className={`w-6 h-6 rounded flex items-center justify-center shrink-0 border cursor-pointer transition-colors ${checkedDocs[idx] ? 'bg-green-500 border-green-600 text-white' : 'bg-transparent border-slate-300'}`}
                                                >
                                                    {checkedDocs[idx] && <CheckSquare className="w-4 h-4" />}
                                                </div>
                                                <span className={`font-semibold text-sm leading-tight flex-1 ${checkedDocs[idx] ? 'text-green-800 line-through opacity-70' : 'text-slate-700'}`}>{doc}</span>
                                            </div>

                                            <button
                                                onClick={() => setSelectedDoc(doc)}
                                                className={`mt-auto flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${checkedDocs[idx] ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                            >
                                                <HelpCircle className="w-3 h-3" /> How to Apply
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                        Official documentation requirements are pending from the nodal agency.
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    </div>

                    {/* Side Action Panel */}
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="w-full lg:w-80 shrink-0">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md sticky top-24">
                            <div className="flex items-center gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <BadgeAlert className="w-8 h-8 text-primary-600 shrink-0" />
                                <p className="text-xs text-slate-500 font-medium">This is a verified external program. Application must be completed via the official portal.</p>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">{t("FinalAction", language)}</h3>

                            <div className="space-y-4">
                                {/* External Link */}
                                <a
                                    href={scholarship.officialWebsite}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex flex-col items-center justify-center p-4 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-1 w-full text-center border-b-[4px] border-primary-900 active:border-b-0 active:translate-y-1"
                                >
                                    <span className="flex items-center gap-2 text-lg mb-1">
                                        <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" /> {t("ConnectApply", language)}
                                    </span>
                                    <span className="text-[10px] text-primary-200 uppercase tracking-widest font-semibold flex items-center">{t("RedirectLabel", language)}</span>
                                </a>

                                <Link href="/dashboard" className="premium-button-secondary w-full">
                                    {t("ReturnToMatches", language)}
                                </Link>
                            </div>

                            <p className="text-[11px] text-slate-400 text-center mt-6 uppercase font-semibold tracking-wider p-4 border-t border-slate-100">
                                ID: {scholarship._id?.substring(0, 10).toUpperCase()}...
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* DOCUMENT GUIDANCE MODAL */}
            <AnimatePresence>
                {selectedDoc && currentDocInfo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-950/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/20"
                        >
                            <div className="bg-primary-900 p-8 text-white relative">
                                <button
                                    onClick={() => setSelectedDoc(null)}
                                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="p-3 bg-white/10 rounded-2xl">
                                        <FileCheck2 className="w-8 h-8 text-accent-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black">{selectedDoc}</h3>
                                        <p className="text-primary-300 text-xs font-bold uppercase tracking-[0.2em] mt-1">Application Guidance</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="mb-10">
                                    <h4 className="flex items-center gap-2 text-primary-950 font-black uppercase text-xs tracking-widest mb-6 border-l-4 border-accent-gold-500 pl-3">
                                        <History className="w-4 h-4" /> Steps to Apply
                                    </h4>
                                    <div className="space-y-6">
                                        {currentDocInfo.steps.map((step, i) => (
                                            <div key={i} className="flex gap-4 group">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-xs font-black text-primary-700 border border-slate-200 group-hover:bg-primary-700 group-hover:text-white transition-colors">
                                                    {i + 1}
                                                </div>
                                                <p className="text-slate-600 text-sm font-medium leading-relaxed pt-1">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                                    <div>
                                        <h4 className="flex items-center gap-2 text-primary-950 font-black uppercase text-xs tracking-widest mb-4">
                                            <Landmark className="w-4 h-4 text-primary-600" /> Authorized Centers
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {currentDocInfo.centers.map((center, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200">
                                                    {center}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                        <h4 className="text-primary-950 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-red-500" /> Nearby Proximity search
                                        </h4>
                                        <p className="text-[11px] text-slate-500 font-bold mb-4">Find authorized centers near your current location for immediate application.</p>
                                        <a
                                            href={`https://www.google.com/maps/search/${encodeURIComponent(currentDocInfo.mapQuery)}${userLocation ? `+near+${userLocation.lat},${userLocation.lng}` : '+near+me'}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full py-3 bg-white hover:bg-primary-50 text-primary-700 border-2 border-primary-200 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                                        >
                                            <Navigation className="w-4 h-4" /> Launch Live Map Search
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                                <button
                                    onClick={() => setSelectedDoc(null)}
                                    className="px-8 py-3 bg-primary-950 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-colors"
                                >
                                    Got it, thanks
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
