# 🧠 AMS Hackathon 2026 — Knowledge Base & Architecture Guide (`agent.md`)

> **Comprehensive project context, architecture, database schemas, evaluation logic, and deployment workflows for AMS HACKATHON 2026.**

---

## 📌 1. Project & Event Overview

* **Event Name**: AMS HACKATHON 2026
* **Institution**: Aalim Muhammed Salegh College of Engineering (AMSCE), Chennai, Tamil Nadu.
* **Organizers**: AMSCE Tech Club & Department of Information Technology / Computer Science.
* **Event Structure**: 24-Hour National Level Hackathon featuring 12 Innovation Domains, a ₹25,500+ Prize Pool, 4 Podium Winners, and 100% participation certificates.
* **Launch / Timeline**: September 15–16, 2026 (Live Ticking Countdown enabled).

---

## 🏗️ 2. Full-Stack Technology Stack

### Frontend (`client/`)
* **Framework**: React 19 + Vite 8
* **Styling**: TailwindCSS 4 + Vanilla CSS Design Systems + Custom Claymorphism & Executive Styling Tokens
* **Motion & Animation**: `framer-motion` (interactive micro-interactions, modal overlays, stepper haptics)
* **Icons**: `react-icons` (Feather Icons `fi`, Lucide, FontAwesome)
* **Export & Document Generation**:
  * `jspdf` & `html2canvas` (Real-time digital ID cards, pass generation, participation certificates)
  * `xlsx` / SheetJS (Excel workbook generation for admin and jury exports)
  * `dompurify` (XSS sanitization for all participant submissions)

### Backend (`server/` & `api/`)
* **Runtime**: Node.js (ES Modules `import/export`)
* **Web Framework**: Express.js
* **Database**: MongoDB Atlas with Mongoose ODM
* **Payment Processing**: Razorpay Node SDK (Order creation + HMAC-SHA256 signature verification)
* **Serverless Entry Point**: `api/index.js` (Express mounted on Vercel Serverless Functions with Mongoose connection pooling)

---

## 🗄️ 3. Database Schema Models (Mongoose)

1. **`Team`** (`server/models/Team.js`):
   * Unique `registrationId` (e.g. `HV26-XXXXX`), `teamName`, `track`, `college`, `teamSize` (3–6 members).
   * `leader` object (`name`, `email`, `phone`, `department`, `year`, `github`, `linkedin`).
   * `members` array of team members (`name`, `email`, `phone`, `department`, `role`).
   * `problemTitle`, `problemAbstract`, `submissionLinks` (GitHub repo, demo URL, presentation slides).
   * `paymentStatus` (`PENDING`, `PAID`, `FAILED`), `registrationStatus` (`CONFIRMED`, `WAITLIST`).

2. **`Registration`** (`server/models/Registration.js`):
   * Stores complete submission payload, verification tokens, and timestamp audit trail.

3. **`Payment`** (`server/models/Payment.js`):
   * `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`.
   * `amount` (in paise, calculated as ₹100 per member: 3=₹300, 4=₹400, 5=₹500, 6=₹600).
   * `status` (`created`, `captured`, `failed`).

4. **`Evaluation`** (`server/models/Evaluation.js`):
   * Multi-round scoring model (`registrationId`, `teamName`, `round` [1 to 4], `evaluatorId`, `evaluatorName`).
   * `scores` object:
     * `innovation` (0–10)
     * `technical` (0–10)
     * `prototype` (0–10)
     * `uiux` (0–10)
     * `presentation` (0–10)
   * `rawTotal` (0–50), `trackMultiplier` (e.g. `1.25x`), `weightedTotal` (`rawTotal * trackMultiplier`).
   * `remarks` (Jury feedback), `actionItemsForNextRound`, `previousActionItemsStatus` (`RESOLVED`, `PARTIAL`, `UNADDRESSED`, `N/A`).

5. **`Admin`** (`server/models/Admin.js`):
   * Admin credentials with `bcryptjs` hashing, JWT token authentication, and role permissions.

6. **`Coordinator`** (`server/models/Coordinator.js`):
   * Student and faculty coordinators with department tags and contact channels.

7. **`Announcement`** (`server/models/Announcement.js`):
   * Real-time bulletin items, SIH problem statements updates, and pinned alerts.

8. **`ContactMessage`** (`server/models/ContactMessage.js`):
   * Support inquiries, partnership proposals, and participant queries.

9. **`Certificate`** (`server/models/Certificate.js`):
   * Cryptographically verifiable digital certificates with unique verification UUIDs.

---

## 🎯 4. The 12 Innovation Domains (Tracks) & Multipliers

| # | Innovation Domain | Multiplier | Focus Areas |
|---|---|---|---|
| 01 | **AI & Machine Learning** | `1.20x` | Deep learning, NLP, computer vision, autonomous AI agents, multi-modal synthesis. |
| 02 | **Cyber Security** | `1.20x` | Zero-trust architecture, threat intelligence, cryptographic safeguards, malware analysis. |
| 03 | **Healthcare** | `1.10x` | Smart diagnostics, telemedicine, medical IoT, remote patient telemetry. |
| 04 | **Agriculture** | `1.10x` | Precision farming, crop health analytics, automated irrigation, farm-to-table supply chains. |
| 05 | **Smart Education** | `1.00x` | Adaptive AI tutors, gamified STEM, multilingual learning, VR/AR lab simulators. |
| 06 | **Smart Mobility** | `1.10x` | EV telemetry, smart traffic management, autonomous logistics, transit routing. |
| 07 | **Smart Automation** | `1.10x` | Industrial robotics, smart home IoT hubs, micro-controller firmware, SCADA dashboards. |
| 08 | **FinTech** | `1.15x` | Micro-finance, fraud detection neural networks, decentralized finance, smart billing. |
| 09 | **Sustainability** | `1.05x` | Carbon footprint tracking, renewable energy grid optimization, smart waste networks. |
| 10 | **Disaster Management** | `1.10x` | Early warning systems, emergency mesh communication, flood/fire mapping. |
| 11 | **Quantum Computing** | `1.25x` | Quantum algorithms, Qiskit/Cirq circuit simulators, post-quantum crypto, VQE/QKD. |
| 12 | **Open Innovation** | `1.00x` | Unconventional cross-domain software and hardware solutions. |

---

## ⚖️ 5. Jury Evaluator Console & Multi-Round Scoring Flow

1. **Authentication**:
   * Unified single Jury Passcode access (`AMS2026`, `JURY2026`).
   * No individual evaluator names required; records signed as official jury panel.

2. **Evaluation Rounds**:
   * **Round 1**: Ideation & Problem-Solution Fit
   * **Round 2**: System Architecture & Database Design
   * **Round 3**: Functional Working Prototype & Edge Cases
   * **Round 4**: Grand Pitch, Defense & Viability

3. **Rubric Criteria (0 to 10 Points Each)**:
   1. `01. Innovation & Originality` (Concept & Vision)
   2. `02. Architecture & Complexity` (Engineering Depth)
   3. `03. Working Prototype & Execution` (Implementation)
   4. `04. Design Craft & Usability` (Experience & Polish)
   5. `05. Pitch & Defense` (Communication & Q&A)

4. **Normalization Formula**:
   $$\text{Final Round Score} = \left(\sum_{i=1}^5 \text{Criterion}_i\right) \times \text{Track Multiplier}$$

5. **Leaderboard & 4-Place Podium Winners**:
   * 🏆 **1st Place (Grand Champion)**
   * 🥈 **2nd Place (1st Runner Up)**
   * 🥉 **3rd Place (2nd Runner Up)**
   * 🎖️ **4th Place (Podium Finalist)**

---

## 🌿 6. Git Branch & Pull Request Structure

* **Upstream Repository**: `sharafahh/AMS-HACKATHON-2026`
* **Fork Repository (`origin`)**: `mdhasim-1406/AMS-HACKATHON-2026`
* **Branch Strategy**:
  1. **`feature/remove-space-tech-track`** (Connected to **PR #5**):
     * Strictly contains **1 single clean commit** (`73baa5d`): *`feat: Replace Space Technology track with Quantum Computing (12 innovation domains)`*.
     * Modifies `Tracks.jsx`, `About.jsx`, `Stats.jsx`, `StepProjectDetails.jsx`, `AdminDashboard.jsx`, `announcementController.js`, `README.md`.
  2. **`feature/evaluator-console`**:
     * Working branch containing full Evaluator console, executive light-theme claymorphism, 4-podium leaderboard, keyboard shortcuts, mobile bottom action bar, and real-time MongoDB Atlas syncing.

---

## 🚀 7. Serverless & Deployment Constraints

* **Vercel Serverless Compatibility**:
  * In `api/index.js`, routes are mounted on both `/api/...` and standard prefixes (e.g. `/evaluator`, `/api/evaluator`).
  * Mongoose connection uses serverless connection pooling with short timeout (`2500ms`) to avoid blocking lambda cold starts.
  * File storage in serverless environments uses `/tmp` to avoid `EROFS: read-only file system` errors.
* **Client Build**:
  * Vite configuration builds with Rolldown runtime into `dist/`.
  * Chunk splitting configured for PDF/Excel export modules to ensure fast sub-500ms builds.
