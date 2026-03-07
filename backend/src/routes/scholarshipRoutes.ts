import express, { Response } from "express";
import { protect, admin, AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

// All scholarships hardcoded — no DB needed, no RLS issues, instant response
const ALL_SCHOLARSHIPS: any[] = [
    {
        _id: "sc-001", id: "sc-001",
        name: "Pre-Matric Scholarship Scheme for Minorities",
        provider: "Ministry of Minority Affairs, Govt of India",
        eligibilityCriteria: "Students belonging to minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) studying in classes 1 to 10. Minimum 50% marks in previous final examination.",
        educationLevel: ["10th", "Under 10th"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 100000,
        marksRequirement: 50,
        state: "All India",
        description: "Encourages parents from minority communities to send their school going children to school, lightens their financial burden and sustains efforts to complete school education.",
        benefits: "Admission fee, Tuition fee, and Maintenance allowance (₹1,000 to ₹6,000 per annum depending on class and hosteler status).",
        deadline: "2026-11-15",
        requiredDocuments: ["Aadhaar Card", "Income Certificate", "Community/Minority Certificate", "Previous Year Marksheet", "Bank Passbook"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: true,
        disabilityStatus: false
    },
    {
        _id: "sc-002", id: "sc-002",
        name: "Post-Matric Scholarship Scheme for Minorities",
        provider: "Ministry of Minority Affairs, Govt of India",
        eligibilityCriteria: "Students from minority communities studying in Class 11, 12, UG, PG, M.Phil, Ph.D. Minimum 50% marks in previous examination.",
        educationLevel: ["12th", "Diploma", "Undergraduate", "Postgraduate", "PhD"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 200000,
        marksRequirement: 50,
        state: "All India",
        description: "Objective is to award scholarships to meritorious students belonging to economically weaker sections of minority community so as to provide them better opportunities for higher education.",
        benefits: "Admission + Tuition fee up to ₹10,000 per annum. Maintenance allowance up to ₹10,000 per annum.",
        deadline: "2026-11-30",
        requiredDocuments: ["Aadhaar Card", "Income Certificate", "Minority Declaration", "Previous Marksheet", "Fee Receipt", "Bank Passbook"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: true,
        disabilityStatus: false
    },
    {
        _id: "sc-003", id: "sc-003",
        name: "Merit Cum Means Scholarship for Professional and Technical Courses",
        provider: "Ministry of Minority Affairs",
        eligibilityCriteria: "For minority students pursuing professional or technical courses at UG/PG levels. Must have secured minimum 50% marks in previous exam.",
        educationLevel: ["Undergraduate", "Postgraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 250000,
        marksRequirement: 50,
        state: "All India",
        description: "Assistance to poor and meritorious students belonging to minority communities to enable them to pursue professional and technical courses.",
        benefits: "Full course fee up to ₹20,000 per annum. Maintenance allowance up to ₹10,000 per annum.",
        deadline: "2026-10-31",
        requiredDocuments: ["Aadhaar Card", "Income Certificate", "Minority Certificate", "Previous Marksheet", "College Fee Receipt"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: true,
        disabilityStatus: false
    },
    {
        _id: "sc-004", id: "sc-004",
        name: "Pre-Matric Scholarship for Students with Disabilities",
        provider: "Department of Empowerment of Persons with Disabilities",
        eligibilityCriteria: "Students with 40% or more disability studying in Classes 9 and 10.",
        educationLevel: ["10th", "Under 10th"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 250000,
        marksRequirement: 0,
        state: "All India",
        description: "To support students with disabilities to study further in order to prepare themselves to earn their livelihood.",
        benefits: "Maintenance allowance ₹500 (Day Scholar) / ₹800 (Hosteler) per month. Book grant ₹1000 per annum. Disability allowances.",
        deadline: "2026-11-15",
        requiredDocuments: ["Disability Certificate", "Aadhaar Card", "Income Certificate", "Previous Marksheet"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: false,
        disabilityStatus: true
    },
    {
        _id: "sc-005", id: "sc-005",
        name: "Post-Matric Scholarship for Students with Disabilities",
        provider: "Department of Empowerment of Persons with Disabilities",
        eligibilityCriteria: "Students with 40% or more disability studying from Class 11 to PG Degree/Diploma.",
        educationLevel: ["12th", "Diploma", "Undergraduate", "Postgraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 250000,
        marksRequirement: 0,
        state: "All India",
        description: "Financial assistance to students with disabilities for studying in recognized institutions post Class 10.",
        benefits: "Maintenance allowance up to ₹1600/month. Book grant up to ₹1500/year. Reimbursement of compulsory non-refundable fees.",
        deadline: "2026-11-30",
        requiredDocuments: ["Disability Certificate", "Aadhaar Card", "Income Certificate", "Admission Proof"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: false,
        disabilityStatus: true
    },
    {
        _id: "sc-006", id: "sc-006",
        name: "National Fellowship & Scholarship for Higher Education of ST Students",
        provider: "Ministry of Tribal Affairs",
        eligibilityCriteria: "ST students pursuing M.Phil/Ph.D or UG/PG courses in Top Class Institutes.",
        educationLevel: ["Undergraduate", "Postgraduate", "PhD"],
        category: ["ST"],
        incomeLimit: 600000,
        marksRequirement: 50,
        state: "All India",
        description: "To encourage ST students to pursue higher education and research.",
        benefits: "Fellowship: ₹31,000/month (JRF), ₹35,000/month (SRF). Full tuition fee, living expenses, books, computer.",
        deadline: "2026-12-31",
        requiredDocuments: ["ST Certificate", "Income Certificate", "Institute Admission Proof", "Aadhaar Card"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-007", id: "sc-007",
        name: "Central Sector Scheme of Scholarships for College and University Students",
        provider: "Department of Higher Education",
        eligibilityCriteria: "Students above 80th percentile in Class 12 board exams. Must pursue regular UG/PG courses.",
        educationLevel: ["Undergraduate", "Postgraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 450000,
        marksRequirement: 80,
        state: "All India",
        description: "Financial assistance to meritorious students from low-income families to meet day-to-day expenses while pursuing higher studies.",
        benefits: "₹12,000 per annum at UG level (3 years). ₹20,000 per annum at PG level.",
        deadline: "2026-10-31",
        requiredDocuments: ["Class 12 Marksheet", "Income Certificate", "Aadhaar Card", "Bank Passbook"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-008", id: "sc-008",
        name: "AICTE Pragati Scholarship for Girls",
        provider: "All India Council for Technical Education (AICTE)",
        eligibilityCriteria: "Girl students admitted to first year of Degree/Diploma course in an AICTE approved institution. Maximum two girls per family.",
        educationLevel: ["Diploma", "Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 800000,
        marksRequirement: 0,
        state: "All India",
        description: "Scheme aiming at providing assistance for Advancement of Girls pursuing Technical Education.",
        benefits: "₹50,000 per annum for every year of study (up to 4 years for degree, 3 years for diploma).",
        deadline: "2026-11-30",
        requiredDocuments: ["Aadhaar Card", "Income Certificate", "Admission Letter", "Previous Marksheet"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-009", id: "sc-009",
        name: "AICTE Saksham Scholarship for Specially Abled Students",
        provider: "All India Council for Technical Education (AICTE)",
        eligibilityCriteria: "Specially abled students with disability of at least 40%. First year of Degree/Diploma in AICTE approved institution.",
        educationLevel: ["Diploma", "Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 800000,
        marksRequirement: 0,
        state: "All India",
        description: "Scheme to encourage and support specially abled children to pursue Technical Education.",
        benefits: "₹50,000 per annum for every year of study.",
        deadline: "2026-11-30",
        requiredDocuments: ["Disability Certificate", "Aadhaar Card", "Income Certificate", "Admission Proof"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: false,
        disabilityStatus: true
    },
    {
        _id: "sc-010", id: "sc-010",
        name: "Post-Matric Scholarship for SC Students",
        provider: "Ministry of Social Justice and Empowerment",
        eligibilityCriteria: "SC students studying in post-matriculation or post-secondary stages.",
        educationLevel: ["12th", "Diploma", "Undergraduate", "Postgraduate", "PhD"],
        category: ["SC"],
        incomeLimit: 250000,
        marksRequirement: 0,
        state: "All India",
        description: "Financial assistance to SC students at post-matriculation or post-secondary stage to enable them to complete their education.",
        benefits: "Maintenance allowance ₹230 to ₹1200/month. Reimbursement of compulsory fees. Book grant.",
        deadline: "2026-11-30",
        requiredDocuments: ["SC Certificate", "Income Certificate", "Aadhaar", "Fee Receipts"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-011", id: "sc-011",
        name: "Top Class Education Scheme for SC Students",
        provider: "Ministry of Social Justice and Empowerment",
        eligibilityCriteria: "SC students admitted to notified institutions (IITs, IIMs, NITs, etc.).",
        educationLevel: ["Undergraduate", "Postgraduate"],
        category: ["SC"],
        incomeLimit: 800000,
        marksRequirement: 0,
        state: "All India",
        description: "Recognize and promote quality education amongst students belonging to SCs by providing full financial support.",
        benefits: "Full tuition fee. Living expenses ₹3000/month. Books ₹5000/year. Computer ₹45,000 (one time).",
        deadline: "2026-11-30",
        requiredDocuments: ["SC Certificate", "Income Certificate", "Admission Proof to Notified Institution"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-012", id: "sc-012",
        name: "Post-Matric Scholarship for OBC Students",
        provider: "Ministry of Social Justice and Empowerment",
        eligibilityCriteria: "OBC students studying at post-matriculation or post-secondary stage.",
        educationLevel: ["12th", "Diploma", "Undergraduate", "Postgraduate", "PhD"],
        category: ["OBC"],
        incomeLimit: 250000,
        marksRequirement: 0,
        state: "All India",
        description: "Financial assistance to OBC students pursuing post-matric education.",
        benefits: "Maintenance allowance ₹160 to ₹750/month. Reimbursement of compulsory non-refundable fees.",
        deadline: "2026-11-30",
        requiredDocuments: ["OBC Certificate", "Income Certificate", "Aadhaar", "Fee Receipts"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-013", id: "sc-013",
        name: "Dr. Ambedkar Post-Matric Scholarship for EBC Students",
        provider: "Ministry of Social Justice and Empowerment",
        eligibilityCriteria: "Students belonging to Economically Backward Classes (EBC) general category pursuing post-matric courses.",
        educationLevel: ["12th", "Diploma", "Undergraduate", "Postgraduate", "PhD"],
        category: ["General", "EWS"],
        incomeLimit: 250000,
        marksRequirement: 0,
        state: "All India",
        description: "Financial assistance to EBC general category students pursuing post-matriculation courses.",
        benefits: "Maintenance allowance ₹160 to ₹750/month. Reimbursement of compulsory non-refundable fees.",
        deadline: "2026-11-30",
        requiredDocuments: ["Income Certificate", "Aadhaar Card", "Fee Receipts", "Previous Marksheet"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-014", id: "sc-014",
        name: "Mukhyamantri Medhavi Vidyarthi Yojana",
        provider: "Government of Madhya Pradesh",
        eligibilityCriteria: "MP domicile. Secured 70%+ (MP Board) or 85%+ (CBSE/ICSE) in 12th. Admitted to preferred UG courses.",
        educationLevel: ["Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 600000,
        marksRequirement: 70,
        state: "Madhya Pradesh",
        description: "Financially assists talented students from MP pursuing higher education in prestigious institutes.",
        benefits: "100% tuition fee waiver/reimbursement.",
        deadline: "2026-12-31",
        requiredDocuments: ["MP Domicile Certificate", "12th Marksheet", "Income Certificate", "Aadhaar Card", "Admission Letter"],
        officialWebsite: "http://scholarshipportal.mp.nic.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-015", id: "sc-015",
        name: "MahaDBT Post Matric Scholarship",
        provider: "Government of Maharashtra",
        eligibilityCriteria: "Maharashtra domicile. EBC, SC, ST, OBC, VJNT, SBC categories pursuing authorized courses.",
        educationLevel: ["12th", "Diploma", "Undergraduate", "Postgraduate", "PhD"],
        category: ["General", "EWS", "OBC", "SC", "ST"],
        incomeLimit: 800000,
        marksRequirement: 0,
        state: "Maharashtra",
        description: "Umbrella portal for all post-matric scholarships administered by Maharashtra government.",
        benefits: "Tuition fee reimbursement 50%–100%. Exam fee reimbursement. Maintenance allowance.",
        deadline: "2026-12-31",
        requiredDocuments: ["Maharashtra Domicile Certificate", "Income Certificate", "Caste Certificate", "Previous Year Marksheet", "Fee Receipt"],
        officialWebsite: "https://mahadbt.maharashtra.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-016", id: "sc-016",
        name: "Swami Vivekananda Merit Cum Means Scholarship",
        provider: "Government of West Bengal",
        eligibilityCriteria: "West Bengal domicile. Minimum 60% marks for Class 11/12 or UG. Minimum 53% for PG.",
        educationLevel: ["12th", "Undergraduate", "Postgraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 250000,
        marksRequirement: 60,
        state: "West Bengal",
        description: "Assisting meritorious students of West Bengal from economically backward families to pursue higher studies.",
        benefits: "₹1,000 to ₹5,000 per month depending on the course level.",
        deadline: "2026-11-30",
        requiredDocuments: ["WB Domicile", "Income Certificate", "Marksheet of Qualifying Exam", "Bank Passbook"],
        officialWebsite: "https://svmcm.wbhed.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-017", id: "sc-017",
        name: "Dr. YSR Vidyadheevena Scheme",
        provider: "Government of Andhra Pradesh",
        eligibilityCriteria: "AP domicile. Pursuing Polytechnic, ITI, Degree, PG/Ph.D courses. SC, ST, BC, EBC, Minorities, Kapu, and Differently Abled students.",
        educationLevel: ["Diploma", "Undergraduate", "Postgraduate", "PhD"],
        category: ["General", "OBC", "SC", "ST", "EWS"],
        incomeLimit: 250000,
        marksRequirement: 0,
        state: "Andhra Pradesh",
        description: "Provides full fee reimbursement to students belonging to poor families giving them access to higher education.",
        benefits: "Full Fee Reimbursement (Tuition fee, special fee, other fees). Credited directly to mother's account.",
        deadline: "2026-12-31",
        requiredDocuments: ["AP Domicile/Aadhaar", "Income Certificate/Ration Card", "Caste Certificate", "Admission details"],
        officialWebsite: "https://jnanabhumi.ap.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-018", id: "sc-018",
        name: "Vidyadhan Scholarship Program",
        provider: "Sarojini Damodaran Foundation",
        eligibilityCriteria: "Students completing 10th grade. Minimum 90% or 9 CGPA in 10th. Available in selected states.",
        educationLevel: ["12th"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 200000,
        marksRequirement: 90,
        state: "All India",
        description: "Private foundation scholarship supporting meritorious students from economically challenged families for college education.",
        benefits: "₹10,000 to ₹60,000 per year depending on the state and course.",
        deadline: "2026-07-31",
        requiredDocuments: ["10th Marksheet", "Income Certificate", "Photograph"],
        officialWebsite: "https://www.vidyadhan.org/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-019", id: "sc-019",
        name: "Reliance Foundation Undergraduate Scholarships",
        provider: "Reliance Foundation",
        eligibilityCriteria: "Resident Indian in first year of UG degree in any stream. Aptitude test required.",
        educationLevel: ["Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 1500000,
        marksRequirement: 60,
        state: "All India",
        description: "Supporting undergraduate students to unlock their potential and pursue higher education.",
        benefits: "Up to ₹2,000,000 over the duration of the degree. Includes alumni network access.",
        deadline: "2026-10-15",
        requiredDocuments: ["12th Marksheet", "Income Proof", "Aptitude Test Score"],
        officialWebsite: "https://scholarships.reliancefoundation.org/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-020", id: "sc-020",
        name: "HDFC Badhte Kadam Scholarship",
        provider: "HDFC Bank",
        eligibilityCriteria: "Students from Class 11 to PG who have faced recent crisis (orphan/loss of parent/loss of livelihood). Minimum 60% in previous year.",
        educationLevel: ["12th", "Diploma", "Undergraduate", "Postgraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 600000,
        marksRequirement: 60,
        state: "All India",
        description: "Helping students continue their education despite facing a recent life crisis or having a low family income.",
        benefits: "Financial aid from ₹18,000 to ₹100,000 depending on the course of study.",
        deadline: "2026-09-30",
        requiredDocuments: ["Marksheet", "Income Proof", "Proof of Crisis"],
        officialWebsite: "https://www.hdfcbank.com/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-021", id: "sc-021",
        name: "Keep India Smiling Foundational Scholarship",
        provider: "Colgate-Palmolive (India) Limited",
        eligibilityCriteria: "Students in Class 11, Diploma, or Graduation. Minimum 60% in board exams.",
        educationLevel: ["12th", "Diploma", "Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 500000,
        marksRequirement: 60,
        state: "All India",
        description: "Foundational support to deserving and meritorious individuals who lack resources to pursue their dreams.",
        benefits: "Scholarship up to ₹30,000 per year for up to 4 years.",
        deadline: "2026-03-31",
        requiredDocuments: ["Previous Marksheet", "Income Certificate", "Admission Proof"],
        officialWebsite: "https://www.colgate.com/en-in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-022", id: "sc-022",
        name: "Kishore Vaigyanik Protsahan Yojana (KVPY)",
        provider: "Department of Science and Technology",
        eligibilityCriteria: "Students in XI, XII, or 1st year UG in Basic Sciences. Aptitude Test + Interview required.",
        educationLevel: ["12th", "Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 0,
        marksRequirement: 60,
        state: "All India",
        description: "National Program of Fellowship in Basic Sciences to encourage students to take up research careers in Science.",
        benefits: "Monthly fellowship ₹5000–₹7000. Annual contingency grant ₹20,000–₹28,000.",
        deadline: "2026-09-06",
        requiredDocuments: ["Marksheets", "Caste Certificate (if applicable)", "Passport Size Photo"],
        officialWebsite: "http://kvpy.iisc.ernet.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-023", id: "sc-023",
        name: "Prime Minister's Research Fellowship (PMRF)",
        provider: "Ministry of Education",
        eligibilityCriteria: "Students with B.Tech/M.Tech/BS/MS from IITs, IISc, NITs, IISERs with CGPA 8.0+. Lateral entry from IITs/IISc in 3rd or 4th year.",
        educationLevel: ["PhD"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 0,
        marksRequirement: 80,
        state: "All India",
        description: "To attract the best talent in the country to doctoral programs of IITs and IISc for cutting edge research.",
        benefits: "Monthly stipend ₹70,000–₹80,000 (increasing over 5 years). Research grant ₹2,00,000/year.",
        deadline: "2026-12-31",
        requiredDocuments: ["Qualifying Degree Certificate", "CGPA Transcript", "Research Proposal"],
        officialWebsite: "https://www.pmrf.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-024", id: "sc-024",
        name: "Ishan Uday Scholarship for North-Eastern Region",
        provider: "University Grants Commission (UGC)",
        eligibilityCriteria: "Domicile of North Eastern states. Pursuing general UG courses from a recognized University. Minimum 60% marks in 12th.",
        educationLevel: ["Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 450000,
        marksRequirement: 60,
        state: "All India",
        description: "Promoting higher education in the North Eastern Region of India.",
        benefits: "₹5,400 per month for general UG courses. ₹7,800 per month for technical/professional courses.",
        deadline: "2026-10-31",
        requiredDocuments: ["Domicile Certificate of NE State", "12th Marksheet", "Income Certificate", "Aadhaar"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-025", id: "sc-025",
        name: "National Means cum Merit Scholarship (NMMS)",
        provider: "Department of School Education & Literacy",
        eligibilityCriteria: "Students of Class IX whose parental income is not more than ₹3.5 lakh. Must have passed Class VIII with minimum 55% marks.",
        educationLevel: ["10th", "Under 10th"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 350000,
        marksRequirement: 55,
        state: "All India",
        description: "To support meritorious students of economically weaker sections to check the dropout rate at Class VIII and encourage them to continue their education.",
        benefits: "₹12,000 per annum (₹1,000 per month) for Class IX through XII.",
        deadline: "2026-10-15",
        requiredDocuments: ["Class VIII Marksheet", "Income Certificate", "Aadhaar Card", "Bank Account Details"],
        officialWebsite: "https://scholarships.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-026", id: "sc-026",
        name: "Delhi State Merit Scholarship",
        provider: "Delhi Government",
        eligibilityCriteria: "Resident of Delhi studying in state university. Minimum 60% marks and income below ₹6 lakh.",
        educationLevel: ["Undergraduate", "Postgraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 600000,
        marksRequirement: 60,
        state: "Delhi",
        description: "Assists meritorious students from moderate backgrounds in Delhi pursue higher studies.",
        benefits: "Full fee waiver for income <₹2.5 Lakhs. 50% fee waiver for ₹2.5–₹6 Lakhs.",
        deadline: "2026-12-31",
        requiredDocuments: ["Delhi Domicile", "Income Certificate", "University Admission Proof"],
        officialWebsite: "https://edistrict.delhigovt.nic.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-027", id: "sc-027",
        name: "Karnataka Rajyotsava Scholarship",
        provider: "Government of Karnataka",
        eligibilityCriteria: "SC/ST students domiciled in Karnataka. Pursuing any post-matric course including ITI, Diploma, Graduate and Post-Graduate programs.",
        educationLevel: ["Diploma", "Undergraduate", "Postgraduate"],
        category: ["SC", "ST"],
        incomeLimit: 250000,
        marksRequirement: 0,
        state: "Karnataka",
        description: "Financial assistance for SC/ST students from Karnataka to pursue higher education.",
        benefits: "Tuition fee reimbursement, maintenance allowance, book grants.",
        deadline: "2026-11-30",
        requiredDocuments: ["Caste Certificate", "Income Certificate", "Karnataka Domicile", "Aadhaar", "Bank Account Details"],
        officialWebsite: "https://ssp.postmatric.karnataka.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-028", id: "sc-028",
        name: "Telangana State Overseas Scholarship",
        provider: "Government of Telangana",
        eligibilityCriteria: "SC/ST/BC/EBC domicile students of Telangana aspiring to pursue PG (Masters/PhD) in top-ranked foreign universities. Must have minimum 60% marks.",
        educationLevel: ["Postgraduate", "PhD"],
        category: ["SC", "ST", "OBC", "EWS"],
        incomeLimit: 500000,
        marksRequirement: 60,
        state: "Telangana",
        description: "To enable meritorious students from backward communities to study at world-renowned foreign universities.",
        benefits: "Tuition fee up to $15,000/year. Living allowance USD 15,000/year. Airfare. Health insurance.",
        deadline: "2026-09-30",
        requiredDocuments: ["Domicile Certificate", "Caste Certificate", "GRE/GMAT Score", "Admission Letter from Foreign University", "Income Certificate"],
        officialWebsite: "https://telanganasociety.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-029", id: "sc-029",
        name: "Tata Scholarship for Cornell University",
        provider: "Tata Education and Development Trust",
        eligibilityCriteria: "Indian citizen applying to Cornell University undergraduate programs. Must demonstrate exceptional financial need.",
        educationLevel: ["Undergraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 800000,
        marksRequirement: 85,
        state: "All India",
        description: "Full financial support for exceptional Indian students to pursue undergraduate education at Cornell University in the USA.",
        benefits: "Covers full demonstrated financial need including tuition, room, board, and personal expenses.",
        deadline: "2026-01-02",
        requiredDocuments: ["12th Marksheet", "Income Documents", "Cornell Application", "Essays"],
        officialWebsite: "https://www.cornelladmissions.org/",
        minorityStatus: false,
        disabilityStatus: false
    },
    {
        _id: "sc-030", id: "sc-030",
        name: "Inspire Scholarship for Higher Education (SHE)",
        provider: "Department of Science and Technology",
        eligibilityCriteria: "Students who scored in top 1% in Class XII and pursue Natural/Basic Sciences at UG/PG level.",
        educationLevel: ["Undergraduate", "Postgraduate"],
        category: ["General", "OBC", "SC", "ST"],
        incomeLimit: 0,
        marksRequirement: 90,
        state: "All India",
        description: "To attract talented youth to study Basic and Natural Sciences at the undergraduate level and motivate them to take up research careers.",
        benefits: "₹80,000 per annum + summer attachment fee ₹20,000 per annum. Total ₹1,00,000 per year.",
        deadline: "2026-11-30",
        requiredDocuments: ["Class XII Marksheet (showing top 1% ranking)", "Admission Proof", "Bank Details"],
        officialWebsite: "https://online-inspire.gov.in/",
        minorityStatus: false,
        disabilityStatus: false
    }
];

// GET /api/scholarships - Filter and return matching scholarships
router.get("/", async (req: express.Request, res: express.Response) => {
    try {
        const { educationLevel, category, incomeLimit, state, marksPercentage } = req.query;

        let filtered = [...ALL_SCHOLARSHIPS];

        if (educationLevel) {
            filtered = filtered.filter(s =>
                s.educationLevel.includes(educationLevel as string) ||
                s.educationLevel.includes("All")
            );
        }

        if (category) {
            filtered = filtered.filter(s =>
                s.category.includes(category as string) ||
                s.category.includes("All") ||
                s.category.includes("General")
            );
        }

        if (state) {
            filtered = filtered.filter(s =>
                s.state === (state as string) ||
                s.state === "All India"
            );
        }

        if (incomeLimit) {
            const income = Number(incomeLimit);
            filtered = filtered.filter(s => s.incomeLimit === 0 || s.incomeLimit >= income);
        }

        if (marksPercentage) {
            const marks = Number(marksPercentage);
            filtered = filtered.filter(s => s.marksRequirement === 0 || s.marksRequirement <= marks);
        }

        res.json(filtered);
    } catch (error) {
        console.error("Get scholarships error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/scholarships/:id - Get single scholarship
router.get("/:id", async (req: express.Request, res: express.Response) => {
    try {
        const scholarship = ALL_SCHOLARSHIPS.find(s => s._id === req.params.id || s.id === req.params.id);
        if (!scholarship) return res.status(404).json({ message: "Scholarship not found" });
        res.json(scholarship);
    } catch (error) {
        console.error("Get scholarship error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/scholarships - Create (admin only) - not needed for now as data is hardcoded
router.post("/", protect, admin, async (req: AuthRequest, res: Response) => {
    res.status(501).json({ message: "Scholarship creation via API is not supported in this version" });
});

export default router;
