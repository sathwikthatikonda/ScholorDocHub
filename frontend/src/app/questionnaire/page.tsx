"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/i18n";
import { Save, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Questionnaire() {
    const { user, setUser, token, language } = useStore();
    const router = useRouter();

    const [profile, setProfile] = useState({
        educationLevel: "",
        fieldOfStudy: "",
        gender: "",
        category: "",
        annualFamilyIncome: "",
        marksPercentage: "",
        stateOfResidence: "",
        minorityStatus: false,
        disabilityStatus: false,
        studyLocation: "India"
    });

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const totalSteps = 4;

    useEffect(() => {
        if (!token) {
            router.push("/login");
        } else if (user?.profile) {
            setProfile({
                ...profile,
                ...user.profile,
            });
        }
    }, [token, user, router]);

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.put("/users/profile", { profile });
            setUser(res.data);
            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to sync profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < totalSteps) setStep(step + 1);
        else handleSubmit();
    };

    const OptionCard = ({ label, value, current, field }: { label: string, value: string, current: string, field: string }) => {
        const isSelected = current === value;
        return (
            <div
                onClick={() => setProfile({ ...profile, [field]: value })}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${isSelected ? 'border-primary-600 bg-primary-50 text-primary-900 shadow-md shadow-primary-500/10 scale-100 ring-2 ring-primary-200' : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-slate-50 text-slate-700'}`}
            >
                <span className="font-semibold">{label}</span>
                {isSelected && <CheckCircle2 className="text-primary-600 w-5 h-5 animate-in zoom-in" />}
            </div>
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-4">
            {/* Progress Bar Container */}
            <div className="mb-12">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-6 text-center tracking-tight">
                    {t("EligibilityProfile", language)}
                </h2>

                <div className="flex justify-between items-center relative mb-4">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 -mt-0.5"></div>
                    <div className="absolute top-1/2 left-0 h-1 bg-primary-600 -z-10 -mt-0.5 transition-all duration-500 ease-in-out" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>

                    {[1, 2, 3, 4].map(num => (
                        <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 text-sm transition-all duration-300 ${step >= num ? 'bg-primary-600 border-primary-100 text-white shadow-lg shadow-primary-500/30' : 'bg-white border-slate-200 text-slate-400'}`}>
                            {num}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 px-2 mt-4">
                    <span>{t("Academics", language)}</span>
                    <span>{t("Demographics", language)}</span>
                    <span>{t("Financials", language)}</span>
                    <span>{t("Review", language)}</span>
                </div>
            </div>

            <div className="glass-panel p-8 md:p-12 shadow-2xl border border-slate-200 overflow-hidden relative min-h-[420px] rounded-3xl">
                <AnimatePresence mode="wait">
                    <motion.form
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={nextStep}
                        className="flex flex-col h-full"
                    >
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
                                <span className="flex-1 font-medium">{error}</span>
                            </div>
                        )}
                        <div className="flex-1">
                            {step === 1 && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">{t("EducationLevel", language)} <span className="text-red-500">*</span></h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-bold text-sm">
                                            <OptionCard label="10th Pass" value="10th" current={profile.educationLevel} field="educationLevel" />
                                            <OptionCard label="12th Pass" value="12th" current={profile.educationLevel} field="educationLevel" />
                                            <OptionCard label="Diploma" value="Diploma" current={profile.educationLevel} field="educationLevel" />
                                            <OptionCard label="Undergraduate" value="Undergraduate" current={profile.educationLevel} field="educationLevel" />
                                            <OptionCard label="Postgraduate" value="Postgraduate" current={profile.educationLevel} field="educationLevel" />
                                            <OptionCard label="Other" value="PhD" current={profile.educationLevel} field="educationLevel" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                                        <div>
                                            <label className="premium-label">{t("CurrentField", language)}</label>
                                            <input type="text" className="premium-input placeholder:text-slate-400 font-bold" placeholder="e.g. B.Tech Computer Science" value={profile.fieldOfStudy} onChange={(e) => setProfile({ ...profile, fieldOfStudy: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="premium-label">{t("MarksPercentage", language)} <span className="text-red-500">*</span></label>
                                            <input required min="35" max="100" type="number" className="premium-input placeholder:text-slate-400 font-bold text-lg" placeholder="e.g. 85" value={profile.marksPercentage} onChange={(e) => setProfile({ ...profile, marksPercentage: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">{t("SocialCategory", language)} <span className="text-red-500">*</span></h3>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-bold text-sm">
                                            <OptionCard label="General" value="General" current={profile.category} field="category" />
                                            <OptionCard label="OBC" value="OBC" current={profile.category} field="category" />
                                            <OptionCard label="SC" value="SC" current={profile.category} field="category" />
                                            <OptionCard label="ST" value="ST" current={profile.category} field="category" />
                                            <OptionCard label="EWS" value="EWS" current={profile.category} field="category" />
                                        </div>
                                    </div>
                                    <div className="pt-8 border-t border-slate-100">
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">{t("Gender", language)} <span className="text-red-500">*</span></h3>
                                        <div className="grid grid-cols-3 gap-4 max-w-xl font-bold text-sm">
                                            <OptionCard label="Male" value="Male" current={profile.gender} field="gender" />
                                            <OptionCard label="Female" value="Female" current={profile.gender} field="gender" />
                                            <OptionCard label="Other" value="Other" current={profile.gender} field="gender" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                                        <label className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${profile.minorityStatus ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-200/50' : 'border-slate-200 bg-white hover:border-primary-300'}`}>
                                            <input type="checkbox" className="w-6 h-6 rounded text-primary-600 focus:ring-primary-500" checked={profile.minorityStatus} onChange={(e) => setProfile({ ...profile, minorityStatus: e.target.checked })} />
                                            <div>
                                                <span className="font-bold block text-slate-800 text-sm">{t("MinorityCommunity", language)}</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{t("MinorityDesc", language)}</span>
                                            </div>
                                        </label>
                                        <label className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${profile.disabilityStatus ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-200/50' : 'border-slate-200 bg-white hover:border-primary-300'}`}>
                                            <input type="checkbox" className="w-6 h-6 rounded text-primary-600 focus:ring-primary-500" checked={profile.disabilityStatus} onChange={(e) => setProfile({ ...profile, disabilityStatus: e.target.checked })} />
                                            <div>
                                                <span className="font-bold block text-slate-800 text-sm">{t("PersonsDisabilities", language)}</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{t("DisabilityDesc", language)}</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8 max-w-2xl mx-auto">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2">{t("FinancialVerification", language)}</h3>


                                        <label className="premium-label text-base font-bold">{t("AnnualIncome", language)} <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-4 font-black text-primary-500">₹</span>
                                            <input required min="0" type="number" className="premium-input text-2xl font-black pl-10 h-16 rounded-2xl" placeholder="e.g. 250000" value={profile.annualFamilyIncome} onChange={(e) => setProfile({ ...profile, annualFamilyIncome: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100">
                                        <label className="premium-label text-base font-bold">{t("StateResidence", language)} <span className="text-red-500">*</span></label>
                                        <select
                                            required
                                            value={profile.stateOfResidence}
                                            onChange={(e) => setProfile({ ...profile, stateOfResidence: e.target.value })}
                                            className="premium-input text-lg font-bold cursor-pointer rounded-2xl h-14"
                                        >
                                            <option value="" disabled>Select Domicile State</option>
                                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                            <option value="Assam">Assam</option>
                                            <option value="Bihar">Bihar</option>
                                            <option value="Chhattisgarh">Chhattisgarh</option>
                                            <option value="Goa">Goa</option>
                                            <option value="Gujarat">Gujarat</option>
                                            <option value="Haryana">Haryana</option>
                                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                                            <option value="Jharkhand">Jharkhand</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Kerala">Kerala</option>
                                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Manipur">Manipur</option>
                                            <option value="Meghalaya">Meghalaya</option>
                                            <option value="Mizoram">Mizoram</option>
                                            <option value="Nagaland">Nagaland</option>
                                            <option value="Odisha">Odisha</option>
                                            <option value="Punjab">Punjab</option>
                                            <option value="Rajasthan">Rajasthan</option>
                                            <option value="Sikkim">Sikkim</option>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            <option value="Telangana">Telangana</option>
                                            <option value="Tripura">Tripura</option>
                                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                                            <option value="Uttarakhand">Uttarakhand</option>
                                            <option value="West Bengal">West Bengal</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100">
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">{t("StudyLocation", language)} <span className="text-red-500">*</span></h3>
                                        <div className="grid grid-cols-2 gap-4 font-bold text-sm">
                                            <OptionCard label={t("WithinIndia", language)} value="India" current={profile.studyLocation} field="studyLocation" />
                                            <OptionCard label={t("StudyingAbroad", language)} value="Abroad" current={profile.studyLocation} field="studyLocation" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-8 text-center pt-8">
                                    <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100">
                                        <CheckCircle2 className="w-14 h-14 text-green-500" />
                                    </div>
                                    <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">{t("ReadyVerification", language)}</h3>

                                </div>
                            )}
                        </div>

                        {/* Navigation Footer */}
                        <div className={`mt-12 flex items-center border-t border-slate-200 pt-8 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
                            {step > 1 && (
                                <button type="button" onClick={() => setStep(step - 1)} className="premium-button-secondary border-slate-300 font-bold px-8">
                                    <ArrowLeft className="w-5 h-5 mr-3" /> {t("Back", language)}
                                </button>
                            )}

                            <button
                                type="submit"
                                disabled={loading || (step === 1 && (!profile.educationLevel || !profile.marksPercentage)) ||
                                    (step === 2 && (!profile.category || !profile.gender)) ||
                                    (step === 3 && (!profile.annualFamilyIncome || !profile.stateOfResidence))}
                                className={`premium-button-primary font-black ${loading ? 'opacity-80' : ''} ${step === totalSteps ? 'bg-green-600 hover:bg-green-700 shadow-xl shadow-green-500/20 px-12 py-4 text-xl' : 'bg-primary-700 hover:bg-primary-950 px-10 py-4'} disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs transition-all`}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        Syncing...
                                    </div>
                                ) : step === totalSteps ? (
                                    <>
                                        <Save className="w-6 h-6 mr-3" /> {t("SyncProfile", language)}
                                    </>
                                ) : (
                                    <>
                                        {t("NextStep", language)} <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.form>
                </AnimatePresence>
            </div>
        </div>
    );
}
