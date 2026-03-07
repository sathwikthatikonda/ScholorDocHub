import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    state: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profile: {
        educationLevel: String,
        fieldOfStudy: String,
        gender: String,
        category: String,
        annualFamilyIncome: Number,
        marksPercentage: Number,
        stateOfResidence: String,
        minorityStatus: Boolean,
        disabilityStatus: Boolean,
        studyLocation: String
    },
    savedScholarships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scholarship" }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
