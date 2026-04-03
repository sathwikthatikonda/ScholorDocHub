"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { api } from "@/lib/api";
import { t, languageOptions } from "@/lib/i18n";
import { ExternalLink, Volume2, CheckCircle, Calendar, GraduationCap, Building2, User, StopCircle, ArrowLeft, BriefcaseMedical, Landmark, BadgeAlert, FileCheck2, Info, CheckSquare, ShieldAlert, Copy, Link as LinkIcon, X, MapPin, Navigation, History, HelpCircle, Bookmark, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Guidance data for common documents
const docGuidance: Record<string, { steps: string[], centers: string[], mapQuery: string }> = {
    "Income Proof": {
        steps: [
            "Salaried: Upload salary slips / bank statement / Form 16",
            "Self-employed: Upload ITR or CA certificate",
            "No proof:",
            "  1. Apply for income certificate (online or local office)",
            "  2. Submit ID + address proof",
            "  3. Download certificate"
        ],
        centers: ["CSC Centers", "Tahsildar Office", "E-Mitra (Rajasthan)", "MeeSeva (AP/Telangana)"],
        mapQuery: "Income Certificate application center"
    },
    "Aptitude Test Score": {
        steps: [
            "Already have score: Download scorecard -> Upload",
            "Don't have score:",
            "  1. Register for approved test",
            "  2. Take test",
            "  3. Download result",
            "  4. Upload scorecard"
        ],
        centers: ["NTA Test Centers", "Authorized Test Portals", "School/College Board"],
        mapQuery: "Aptitude test center"
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
    "OBC Non-Creamy Layer Certificate": {
        steps: [
            "Apply online through E-District portal.",
            "Submit caste certificate (OBC) and income proof.",
            "Upload supporting documents.",
            "Verification by Revenue Officer.",
            "Download certificate after approval."
        ],
        centers: ["CSC Centers", "Revenue Department Office", "MeeSeva", "Jan Seva Kendra"],
        mapQuery: "OBC Certificate center"
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
    },
    "Passport Size Photographs": {
        steps: [
            "Visit a photo studio or authorized center.",
            "Request passport-size photos as per required dimensions.",
            "Get printed copies (and soft copy if needed)."
        ],
        centers: ["Local Photo Studios", "CSC Centers (in some areas)"],
        mapQuery: "Photo studio near me"
    },
    "Latest Marksheet / Transcripts": {
        steps: [
            "Request from school/college or download from board/university portal.",
            "Verify details and obtain official stamp (if required).",
            "Collect physical or digital copy."
        ],
        centers: ["School / College Office", "University/Board Office"],
        mapQuery: "Education board office"
    },
    "Previous Year Marksheet": {
        steps: [
            "Obtain from school/college or download online.",
            "Verify and keep a copy ready."
        ],
        centers: ["School / College Office", "Board/University Office"],
        mapQuery: "School office"
    },
    "Minority Community Certificate": {
        steps: [
            "Apply online through the E-District portal of your state.",
            "Fill in personal and community details in the application form.",
            "Upload proof of minority status (religion certificate / self-declaration / supporting documents).",
            "Attach identity and residence proof (Aadhaar, Voter ID, etc.).",
            "Submit the application for verification by the Revenue Authority.",
            "Verification by local officials may be conducted if required.",
            "Final certificate can be downloaded online once approved."
        ],
        centers: ["CSC Centers", "Revenue Department Office", "MeeSeva", "Jan Seva Kendra"],
        mapQuery: "Minority Certificate center"
    },
    "Labour ID Card / Certificate": {
        steps: [
            "Apply online through the Labour Department / Building & Other Construction Workers (BOCW) portal of your state.",
            "Register as a worker by filling in personal and employment details.",
            "Upload required documents (Aadhaar, age proof, bank details, employer/work proof).",
            "Submit proof of working days (if required, e.g., 90 days certificate).",
            "Pay the registration fee (if applicable).",
            "Application is verified by the Labour Department अधिकारी.",
            "Labour ID Card / Certificate is issued and can be downloaded after approval."
        ],
        centers: ["CSC Centers", "Labour Department Office", "MeeSeva", "Jan Seva Kendra"],
        mapQuery: "Labour Department Office"
    },
    "Transfer Certificate (TC)": {
        steps: [
            "Submit a request/application to your current school or college.",
            "Fill the TC request form with required details.",
            "Clear all dues (fees, library books, etc.).",
            "Provide identity details and admission information.",
            "Institution verifies records and approves the request.",
            "Collect the Transfer Certificate from the institution office or download (if available online)."
        ],
        centers: ["School Office", "College / University Office"],
        mapQuery: "School office"
    },
    "Class 8 Marksheet": {
        steps: [
            "Request the marksheet from your school.",
            "If available, download from the school/education board portal.",
            "Verify all details (name, class, marks, etc.).",
            "Get it signed/stamped by the school authority if required.",
            "Collect the original or keep a verified copy for submission."
        ],
        centers: ["School Office", "Education Board Office (if applicable)"],
        mapQuery: "School office"
    },
    "Signature": {
        steps: [
            "Sign clearly on a blank white paper using a black or blue pen.",
            "Ensure the signature matches your official records.",
            "Scan or take a clear photo of the signature.",
            "Crop the image neatly (no background distractions).",
            "Upload in the required format (JPG/PNG) and size as specified."
        ],
        centers: ["Self (can be done at home)", "CSC Centers (for scanning/upload help)", "Local Cyber Café"],
        mapQuery: "Cyber cafe"
    },
    "Marksheet": {
        steps: [
            "Obtain the marksheet from your school/college.",
            "If available, download it from the official board/university portal.",
            "Verify all details (name, subjects, marks).",
            "Get it attested/signed by the institution if required.",
            "Keep a scanned copy ready for upload."
        ],
        centers: ["School / College Office", "University / Board Office", "CSC Centers (for print/scan support)"],
        mapQuery: "Education board office"
    },
    "Service Certificate": {
        steps: [
            "Request a service certificate from your employer/organization.",
            "Submit a formal application or request (if required).",
            "Provide employee details (designation, duration, ID, etc.).",
            "Employer verifies records and prepares the certificate.",
            "Get the certificate signed and stamped by the authorized अधिकारी.",
            "Collect the original or a scanned copy for submission."
        ],
        centers: ["Employer Office / Organization", "Government Department Office (for govt employees)"],
        mapQuery: ""
    },
    "Bonafide Certificate": {
        steps: [
            "Submit a request/application to your school/college/institution.",
            "Fill the bonafide request form with required details.",
            "Provide ID/admission details.",
            "Institution verifies your enrollment status.",
            "Certificate is issued with signature and seal.",
            "Collect the bonafide certificate from the office."
        ],
        centers: ["School Office", "College / University Office"],
        mapQuery: "School office"
    },
    "Marksheet of Qualifying Exam": {
        steps: [
            "Obtain the marksheet from your school/college/university.",
            "If available, download from the official board/university portal.",
            "Verify all details (name, subjects, marks, result status).",
            "Get it attested/signed if required.",
            "Keep a scanned copy ready for upload."
        ],
        centers: ["School / College Office", "University / Board Office", "CSC Centers (for scanning/printing support)"],
        mapQuery: "University office"
    },
    "Covid-19 Death Certificate of Parents (if applicable)": {
        steps: [
            "Visit official portal: Go to your state/municipal birth & death registration website.",
            "Register / Login: Create an account or log in with your credentials.",
            "Search for record: Enter details like Parent's name, Date of death, and Place of death.",
            "Apply for certificate: Select the correct record and request a certified copy.",
            "Upload supporting documents (if required): ID proof and Relationship proof (birth certificate, Aadhaar, etc.).",
            "Pay fees: Make online payment (if applicable).",
            "Download certificate: Once approved, download or receive it via email."
        ],
        centers: ["State Birth/Death Portal", "Municipal Corporation Office", "CSC Centers"],
        mapQuery: "Birth and Death registration office"
    },
    "Orphan Certificate": {
        steps: [
            "Visit local authority office/portal: Typically issued by Tehsildar / Revenue Office or District Magistrate office.",
            "Fill application form: Either online or offline.",
            "Attach required documents: Parents' death certificates, Aadhaar card, Residence proof, and Affidavit (if required).",
            "Submit application: Submit online or at the office.",
            "Verification process: अधिकारी (officials) may conduct background verification.",
            "Approval & issuance: Certificate will be issued after verification."
        ],
        centers: ["Tehsildar Office", "Revenue Office", "District Magistrate Office", "CSC Centers"],
        mapQuery: "Tehsildar Office"
    },
    "Admission Proof": {
        steps: [
            "Contact your institution: Go to your school/college admin office or portal.",
            "Request admission proof document: This may be an Admission letter, Bonafide certificate, or Fee receipt.",
            "Provide student details: Name, Roll number / Application ID.",
            "Download or collect document: Download from portal OR Collect signed copy from office."
        ],
        centers: ["School Office", "College Admin Office", "University Registrar"],
        mapQuery: "School or College Office"
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
    const [scholarship, setScholarship] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [applying, setApplying] = useState(false);
    const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

    const { user, setUser, language, token } = useStore();

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchScholarship = async () => {
            try {
                const res = await api.get(`/scholarships/${params.id}`);
                setScholarship(res.data);

                // Check if already applied
                if (user?.appliedScholarships?.includes(String(params.id))) {
                    setIsApplied(true);
                }
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
    }, [params.id, token, router, user?.appliedScholarships]);

    const [showSuccess, setShowSuccess] = useState(false);

    const handleApply = async () => {
        if (applying) return;
        setApplying(true);
        try {
            if (isApplied) {
                const res = await api.delete(`/users/apply-scholarship/${params.id}`);
                setUser({ ...user, appliedScholarships: res.data.appliedScholarships });
                setIsApplied(false);
            } else {
                const res = await api.post(`/users/apply-scholarship/${params.id}`);
                setUser({ ...user, appliedScholarships: res.data.appliedScholarships });
                setIsApplied(true);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Failed to mark scholarship as applied:", err);
        } finally {
            setApplying(false);
        }
    };

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
                                                onClick={() => !checkedDocs[idx] && setSelectedDoc(doc)}
                                                disabled={checkedDocs[idx]}
                                                className={`mt-auto flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${checkedDocs[idx] ? 'bg-green-100 text-green-700 opacity-50 cursor-not-allowed' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer'}`}
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
                                        <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" /> {scholarship.officialWebsite?.includes('scholarships.gov.in') ? "Apply on NSP" : t("ConnectApply", language)}
                                    </span>
                                    <span className="text-[10px] text-primary-200 uppercase tracking-widest font-semibold flex items-center">{t("RedirectLabel", language)}</span>
                                </a>

                                <AnimatePresence>
                                    {showSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-green-600 text-white text-[11px] font-bold py-2 px-4 rounded-lg text-center shadow-lg"
                                        >
                                            {isApplied ? "Updated Applied Applications..." : "Adding to Saved Applications..."}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all border-2 ${isApplied
                                        ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                        : "bg-white border-primary-100 text-primary-700 hover:border-primary-300 hover:bg-primary-50"
                                        }`}
                                >
                                    {applying ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <CheckCircle className={`w-5 h-5 ${isApplied ? 'fill-green-600 border-none' : ''}`} />
                                    )}
                                    {isApplied ? "Marked as Applied" : "Mark as Applied"}
                                </button>

                                <Link href="/dashboard" className="premium-button-secondary w-full text-center">
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
                                        <p className="text-primary-300 text-xs font-bold uppercase tracking-[0.2em] mt-1">
                                            {(selectedDoc?.toLowerCase().includes("income") || selectedDoc?.toLowerCase().includes("aptitude")) ? "Quick Steps" : "Application Guidance"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="mb-10">
                                    <h4 className="flex items-center gap-2 text-primary-950 font-black uppercase text-xs tracking-widest mb-6 border-l-4 border-accent-gold-500 pl-3">
                                        <History className="w-4 h-4" /> 
                                        {(selectedDoc?.toLowerCase().includes("income") || selectedDoc?.toLowerCase().includes("aptitude")) ? "Quick Steps to Apply" : "Steps to Apply"}
                                    </h4>
                                    <div className="space-y-4">
                                        {currentDocInfo.steps.map((step, i) => {
                                            const isNested = step.startsWith("  ");
                                            const hasBullet = step.includes(": ") && !isNested;
                                            
                                            return (
                                                <div key={i} className={`flex gap-4 group ${isNested ? "ml-12" : ""}`}>
                                                    {!isNested ? (
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-xs font-black text-primary-700 border border-slate-200 group-hover:bg-primary-700 group-hover:text-white transition-colors">
                                                            {i + 1}
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                        </div>
                                                    )}
                                                    <p className={`text-slate-600 text-sm font-medium leading-relaxed pt-1 ${hasBullet ? "font-bold" : ""}`}>
                                                        {step.trim()}
                                                    </p>
                                                </div>
                                            );
                                        })}
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

                                    {!(selectedDoc?.toLowerCase().includes("marksheet") || 
                                       selectedDoc?.toLowerCase().includes("transcript") || 
                                       selectedDoc?.toLowerCase().includes("aptitude") || 
                                       selectedDoc === "Bonafide Certificate" || 
                                       selectedDoc === "Service Certificate" || 
                                       selectedDoc === "Signature" || 
                                       selectedDoc?.includes("Admission Proof") || 
                                       selectedDoc?.includes("Transfer Certificate")) && (
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
                                    )}
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
