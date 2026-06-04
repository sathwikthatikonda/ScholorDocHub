# ScholorDocHub

A smart scholarship discovery and eligibility platform designed to assist students in finding relevant scholarships based on their academic profile, demographics, and financial background. This platform aims to streamline the scholarship application process by providing personalized recommendations and a robust application tracking system.

## 🚀 Features

*   **Academic-based Scholarship Matching**: Intelligent algorithms match scholarships to students based on their educational qualifications and field of study.
*   **Demographic Eligibility Filtering**: Filters scholarships based on gender, community, nationality, and state/region.
*   **Financial Need Analysis**: Considers family income, financial need, and existing scholarships to recommend suitable options.
*   **Multi-step Scholarship Application Form**: Guides users through a structured application process.
*   **Personalized Scholarship Recommendations**: Provides tailored suggestions to users.
*   **Responsive and Modern UI**: Ensures a seamless experience across various devices.
*   **Review & Verification Workflow**: Facilitates the review and verification of scholarship applications.
*   **AI-Powered Assistant**: An integrated AI assistant (Swayam) for conversational help and guidance.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: Next.js (React.js)
*   **Styling**: Tailwind CSS
*   **Language**: TypeScript
*   **State Management**: Zustand
*   **Animation**: Framer Motion

### Backend
*   **Framework**: Node.js with Express.js
*   **Language**: TypeScript
*   **Authentication**: JWT Authentication, integrated with Supabase Auth
*   **Data Scraping**: Puppeteer, Cheerio
*   **Scheduling**: Node-Cron
*   **AI Integration**: Google Generative AI (Gemini)

### Database
*   **Database**: Supabase (PostgreSQL)

## 🏛️ Architecture

The ScholorDocHub application follows a client-server architecture with a clear separation of concerns between the frontend, backend, and external services. The core components are:

*   **Frontend**: Built with Next.js, it provides the user interface and interacts with the backend API and Supabase for authentication.
*   **Backend**: An Express.js server that handles API requests, manages data scraping, schedules tasks, and integrates with AI services.
*   **Database**: Supabase, leveraging PostgreSQL, stores scholarship data, user profiles, and metadata.
*   **External Services**: Includes Supabase for authentication, Google Gemini AI for intelligent assistance, and various scholarship portals as data sources.

## 🔄 Workflow

### Data Ingestion (Scraping)

1.  A scheduled job (daily at 2:00 AM IST) or a manual trigger initiates the scholarship scraping pipeline on the backend.
2.  The scraper, built with Puppeteer and Cheerio, visits various scholarship portals (e.g., NSP, UGC, AICTE, state portals).
3.  It extracts scholarship details, normalizes the data, and deduplicates records.
4.  The processed scholarship data is then upserted into the `scholarships` table in Supabase.

### User Journey

1.  **Registration/Login**: Users register or log in via the frontend, which communicates with the backend's authentication routes. Supabase handles user authentication, and user metadata (name, mobile, state, role, initial profile) is stored.
2.  **Profile Creation/Update**: After logging in, users complete a questionnaire providing academic, demographic, and financial information. This data is stored in their user profile metadata in Supabase.
3.  **Scholarship Discovery**: On the dashboard, authenticated users receive personalized scholarship recommendations based on their profile data. They can browse recommended, discovered, or applied scholarships.
4.  **Scholarship Details & Application**: Users can view detailed information about each scholarship, including eligibility criteria, required documents, and application steps. The platform also allows users to save scholarships and mark them as applied, with this state stored in their Supabase user metadata.
5.  **AI Assistant (Swayam)**: Users can interact with the AI-powered voice assistant for help and guidance, which communicates with the backend's AI routes, leveraging Google Gemini AI.

### API Interactions

*   **Authentication API**: Handles user registration and login, returning JWT tokens for authenticated sessions.
*   **User API**: Manages user profiles, including updating questionnaire data, saving scholarships, and tracking applied scholarships.
*   **Scholarship API**: Provides endpoints to fetch scholarship listings, filter them based on various criteria, and retrieve individual scholarship details.
*   **AI API**: Facilitates communication with the AI assistant for natural language processing and responses.

## ⚙️ Setup and Installation

### Prerequisites
*   Node.js (v18 or higher)
*   Supabase Account
*   Google Gemini API Key

