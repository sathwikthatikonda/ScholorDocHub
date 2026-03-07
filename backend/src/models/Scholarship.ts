import mongoose from "mongoose";

const ScholarshipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    provider: { type: String, required: true },
    description: { type: String, required: true },
    benefits: { type: String, required: true },
    deadline: { type: Date, required: true },
    requiredDocuments: [{ type: String }],
    officialWebsite: { type: String, required: true },
    eligibilityCriteria: { type: String },
    educationLevel: [{ type: String }],
    category: [{ type: String }],
    incomeLimit: { type: Number },
    marksRequirement: { type: Number },
    state: { type: String }, // 'All' for all India
    gender: { type: String, default: "All" },
    minorityStatus: { type: Boolean, default: false },
    disabilityStatus: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Scholarship || mongoose.model("Scholarship", ScholarshipSchema);
