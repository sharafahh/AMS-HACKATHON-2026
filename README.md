# AMS HACKATHON 2026 - Internal Level 24-Hour Hackathon Platform

> **24 Hours. Infinite Possibilities.**
> Organized by **AALIM MUHAMMED SALEGH COLLEGE OF ENGINEERING**, Avadi-IAF, Chennai, Tamil Nadu.

---

## 📌 Project Overview

**AMS HACKATHON 2026** is an enterprise-grade, dark futuristic web application built for the college's flagship internal 24-hour hackathon. Inspired by Smart India Hackathon problem statements, the platform encompasses a complete participant registration workflow, Razorpay payment gateway integration, self-service participant tracking portal, certificate verification record generator with QR verification, and an administrative control panel with real-time analytics and CSV report exporting.

---

## 🎨 Tech Stack & Architecture

### Frontend (Client)
- **Core Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (Glassmorphism, custom cyber theme `#050816`, cyan/purple glow utilities)
- **Animations**: Framer Motion (page transitions, particle glow, viewport scroll counters)
- **Form Management**: `react-hook-form` (multi-step stepper form, field validation, dynamic array inputs)
- **Icons**: React Icons (`fi`, `hi2`, `tb`)
- **QR Code Engine**: `qrcode.react`
- **Routing**: `react-router-dom` v7 with `React.lazy` code-splitting and `Suspense` loading fallbacks

### Backend (Server)
- **Runtime**: Node.js & Express 4
- **Database**: MongoDB & Mongoose 8
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs` password hashing
- **Payment Gateway**: Razorpay Node SDK with HMAC SHA256 signature verification
- **Notifications**: `nodemailer` email dispatch utility

---

## ⚙️ Key Features

1. **Futuristic Landing Page**:
   - Sticky glassmorphic navbar with active section scroll spy (`#hero`, `#about`, `#stats`, `#tracks`, `#prizes`, `#timeline`, `#facilities`, `#faq`, `#contact`).
   - Campus Image showcase inside a glowing 3D-effect frame.
   - Live Ticking Countdown Timer to September 15, 2026 launch.
   - Animated Counters for 24 Hours, 12 Tracks, ₹25,500 Prize Pool, 4 Podium Winners, and 100% Certificates.
   - 12 Track Cards with interactive spec modals.
   - Category-filtered & searchable FAQ accordion.
   - Styled dark-theme Google Maps frame & contact form.

2. **Multi-Step Registration Module (`react-hook-form`)**:
   - **Step 1**: Team & Leader Details (Team Name, Leader Info, College, Department, Year, Referral Code).
   - **Step 2**: Member Details (Dynamic Member 1 to Member N inputs based on chosen team size 3 to 6).
   - **Step 3**: Track & Problem Statement (Track selector, Problem Title, Abstract).
   - **Step 4**: Registration Summary & Mandatory Fee Calculation (₹1 per member: 3=₹3, 4=₹4, 5=₹5, 6=₹6).

3. **Razorpay Payment Gateway & HMAC SHA256 Verification**:
   - Creates Razorpay order IDs via Express backend.
   - Launches native Razorpay checkout window.
   - Verifies `razorpay_signature` using HMAC SHA256.
   - **Zero DB Persistence Rule**: Teams are **NEVER** saved to the database unless payment signature verification succeeds.

4. **Participant Self-Service Portal (`/portal`)**:
   - Search by **Registration ID** (`HV26-XXXXX`) or **Leader Email**.
   - Displays Registration status, Payment status, Team member list, Track specs, Receipt download, and Certificate status.

5. **Certificate Engine & Verification (`/certificates` & `/verify`)**:
   - Official Gold-bordered Physical Certificate Verification view with **Certificate ID**, **QR Code**, and **Verification URL**.
   - Public Certificate Verification page (`/verify/:id`) showing 🟢 **VERIFIED & AUTHENTIC** status badge.

6. **Admin Dashboard (`/admin/dashboard`)**:
   - JWT Login (`/admin/login` - Demo credentials: `admin` / `amshackathon2026`).
   - Live analytics overview: Total Teams, Total Participants, Total Revenue (₹), Verified Ratios.
   - Registrations table with search, filters, team inspect modal, and **Export Excel / CSV**.
   - Track distribution manager, Announcement poster/deleter, Certificate generator/revoker.

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local service or MongoDB Atlas URI)

### 1. Backend Setup (`server/`)
```bash
cd server
npm install
```

Create `.env` inside `server/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
NODE_ENV=development
```

Start backend server:
```bash
npm start
# Server starts on http://localhost:5000
```

### 2. Frontend Setup (`client/`)
```bash
cd client
npm install
```

Start development server:
```bash
npm run dev
# App starts on http://localhost:5175
```

### 3. Production Build
To create an optimized production build for deployment:
```bash
cd client
npm run build
```

---

## 🛣️ Route Map

| Path | Description | Access |
| :--- | :--- | :--- |
| `/` | Landing Page | Public |
| `/register` | Multi-Step Team Registration | Public |
| `/portal` | Participant Self-Service Portal | Public |
| `/certificates` | Certificate Search & Download | Public |
| `/verify/:id` | Public QR Code Certificate Verification | Public |
| `/success` | Registration & Payment Confirmation | Public |
| `/admin/login` | Organizer JWT Login | Public |
| `/admin/dashboard` | Admin Analytics & Controls | Admin (JWT Protected) |

---

## 🛡️ License & Branding

Organized by **AALIM MUHAMMED SALEGH COLLEGE OF ENGINEERING**.
Designed & Developed by **Team AMS HACKATHON 2026**. All rights reserved © 2026.
