"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { Plus, Trash2 } from "lucide-react";

export default function AdminPanel() {
    const { user, token } = useStore();
    const router = useRouter();
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        provider: "",
        description: "",
        benefits: "",
        deadline: "",
        officialWebsite: "",
        eligibilityCriteria: "",
        incomeLimit: "",
        marksRequirement: "",
        requiredDocuments: "Aadhaar card, income certificate, caste certificate, marksheets, bonafide certificate, bank passbook, passport photo"
    });

    const fetchScholarships = async () => {
        try {
            const res = await api.get("/scholarships");
            setScholarships(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token || user?.role !== "admin") {
            router.push("/");
            return;
        }
        fetchScholarships();
    }, [token, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                incomeLimit: Number(formData.incomeLimit),
                marksRequirement: Number(formData.marksRequirement),
                requiredDocuments: formData.requiredDocuments.split(",").map(d => d.trim()),
                educationLevel: ["All"],
                category: ["All"]
            };

            await api.post("/scholarships", payload);
            setFormData({
                name: "",
                provider: "",
                description: "",
                benefits: "",
                deadline: "",
                officialWebsite: "",
                eligibilityCriteria: "",
                incomeLimit: "",
                marksRequirement: "",
                requiredDocuments: "Aadhaar card, income certificate, caste certificate, marksheets, bonafide certificate, bank passbook, passport photo"
            });
            fetchScholarships();
        } catch (error) {
            console.error("Failed to add", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/scholarships/${id}`);
            fetchScholarships();
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    if (!user || user.role !== "admin") return null;

    return (
        <div className="py-8 grid lg:grid-cols-2 gap-8">
            {/* ADD FORM */}
            <div className="glass-panel p-8 rounded-2xl h-fit">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-6">
                    Add Scholarship
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-slate-300 text-sm mb-1 block">Name</label>
                            <input required type="text" className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-slate-300 text-sm mb-1 block">Provider</label>
                            <input required type="text" className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white" value={formData.provider} onChange={e => setFormData({ ...formData, provider: e.target.value })} />
                        </div>
                        <div className="col-span-2">
                            <label className="text-slate-300 text-sm mb-1 block">Short Description</label>
                            <textarea required className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                        </div>
                        <div className="col-span-2">
                            <label className="text-slate-300 text-sm mb-1 block">Eligibility Criteria</label>
                            <textarea className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white" rows={2} value={formData.eligibilityCriteria} onChange={e => setFormData({ ...formData, eligibilityCriteria: e.target.value })}></textarea>
                        </div>
                        <div>
                            <label className="text-slate-300 text-sm mb-1 block">Benefits</label>
                            <input required type="text" className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white" value={formData.benefits} onChange={e => setFormData({ ...formData, benefits: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-slate-300 text-sm mb-1 block">Deadline</label>
                            <input required type="date" className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-slate-300 text-sm mb-1 block">Income Limit (Max)</label>
                            <input type="number" className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white" value={formData.incomeLimit} onChange={e => setFormData({ ...formData, incomeLimit: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-slate-300 text-sm mb-1 block">Marks Required (%)</label>
                            <input type="number" className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white" value={formData.marksRequirement} onChange={e => setFormData({ ...formData, marksRequirement: e.target.value })} />
                        </div>
                        <div className="col-span-2">
                            <label className="text-slate-300 text-sm mb-1 block">Official Website Link</label>
                            <input required type="url" className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white" value={formData.officialWebsite} onChange={e => setFormData({ ...formData, officialWebsite: e.target.value })} />
                        </div>
                        <div className="col-span-2">
                            <label className="text-slate-300 text-sm mb-1 block">Required Documents (Comma separated)</label>
                            <textarea className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white" rows={2} value={formData.requiredDocuments} onChange={e => setFormData({ ...formData, requiredDocuments: e.target.value })}></textarea>
                        </div>
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-medium py-3 rounded-lg shadow-lg shadow-amber-500/20 transition-all mt-4">
                        <Plus className="w-5 h-5" /> Add Scholarship
                    </button>
                </form>
            </div>

            {/* LIST */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col h-[800px]">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                    Manage Scholarships
                </h2>
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {scholarships.map(s => (
                            <div key={s._id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50 flex justify-between items-start gap-4 hover:border-indigo-500/50 transition-colors">
                                <div>
                                    <h4 className="font-semibold text-white">{s.name}</h4>
                                    <p className="text-sm text-slate-400">{s.provider}</p>
                                    <span className="text-xs text-amber-400 block mt-1">Deadline: {new Date(s.deadline).toLocaleDateString()}</span>
                                </div>
                                <button onClick={() => handleDelete(s._id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {scholarships.length === 0 && <p className="text-slate-400 text-center py-10">No scholarships found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
