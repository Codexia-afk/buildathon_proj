<div align="center">

# 🏅 TalentLens

### **Democratizing Sports Talent Discovery Across India with Edge AI**

An Olympic-grade computer vision platform that turns any smartphone or laptop camera into an AI-powered physical fitness testing lab. Real-time pose estimation validates athletic form, calculates national age/gender percentiles, and broadcasts verified talent credentials live to scout and coach dashboards.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Tasks_Vision-007FFF?logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[**Explore Live Demo**](http://localhost:5173) • [**Quick Start**](#-quick-start) • [**Architecture**](#-architecture--how-it-works) • [**Biomechanical Engine**](#-biomechanical--ai-engine) • [**Scout Command Center**](#-scout--coach-command-center)

---

</div>

## 📌 The Problem: India's Grassroots Talent Gap

In a nation of **1.4 billion people**, millions of naturally gifted athletes in rural villages, tribal belts, and tier-2/3 towns go unnoticed. 

- **Scouting is Geographically Centralized**: Formal selection trials and SAI/Khelo India camps take place primarily in metro stadiums.
- **High Economic & Logistical Barriers**: Promising young athletes cannot afford travel, lodging, or private academy fees to attend trials.
- **Unstandardized Physical Testing**: Traditional local trials rely on manual stopwatches and eyeball counts, leading to human error, bias, and lack of verifiable data.

> **TalentLens bridges this gap**: Any aspiring athlete with a basic phone camera can perform a standardized test in their village ground or living room, receive an instant verified national percentile score, and appear live on the radar of national scouts.

---

## ⚡ Architecture & How It Works

```
                                  TALENTLENS DATA PIPELINE
                                  
 ┌───────────────────────────────────────────────────────────────────────────────────────┐
 │                                    ATHLETE CLIENT                                     │
 │                                                                                       │
 │   [Webcam / Mobile Camera]                                                            │
 │             │ (30+ FPS Video Stream)                                                  │
 │             ▼                                                                         │
 │   [@mediapipe/tasks-vision] ────► 33 2D/3D Anatomical Landmarks (Shoulder, Elbow,     │
 │             │                     Wrist, Hip, Knee, Ankle)                            │
 │             ▼                                                                         │
 │   [Biomechanical FSM] ──────────► Joint Trigonometry: Elbow Flexion & Spine Alignment │
 │             │                     State Machine: IDLE ➔ READY ➔ DOWN ➔ UP ➔ REP++    │
 │             ▼                                                                         │
 │   [Percentile Engine] ──────────► Continuous Spline Interpolation on benchmarks.json  │
 │             │                     National Cohort Ranking (0 – 99.9th Percentile)     │
 │             ▼                                                                         │
 │   [Verified Result Card] ───────► Unique Protocol Hash (e.g. TL-98-HAR-V1K4S)         │
 └──────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
 ┌───────────────────────────────────────────────────────────────────────────────────────┐
 │                              REAL-TIME PERSISTENCE MESH                               │
 │                                                                                       │
 │   ┌─────────────────────────────────────────┐  ┌───────────────────────────────────┐  │
 │   │        Local Reactive Mesh (Zero-Config)│  │   Cloud Mode: Google Firebase     │  │
 │   │ • Multi-Tab `BroadcastChannel` API      │OR│ • Cloud Firestore `onSnapshot`    │  │
 │   │ • Cross-Window `StorageEvent` Stream    │  │ • Multi-Device Realtime Sync      │  │
 │   └─────────────────────────────────────────┘  └───────────────────────────────────┘  │
 └──────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ (Sub-100ms Live Broadcast)
                                            ▼
 ┌───────────────────────────────────────────────────────────────────────────────────────┐
 │                                SCOUT & COACH DASHBOARD                                │
 │                                                                                       │
 │   • Live Assessment Feed with Real-Time Pulse Indicators                              │
 │   • Multi-Dimensional Filters: Sport, State (28 States), Age Cohort, Min %ile         │
 │   • Growth Trend Analytics: Longitudinal Attempt History (Recharts)                   │
 │   • Scout Review Desk: Athlete Dossier Inspection, Coach Notes, Shortlist & CSV Export│
 └───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

### 1. 🧠 In-Browser Computer Vision & Biomechanical FSM
- **100% Client-Side Inference**: Runs Google MediaPipe Pose via WebGL and WebAssembly acceleration directly in the user's browser—zero video upload latency, maximum privacy.
- **Biomechanical Angle Trigonometry**:
  - **Elbow Flexion Angle**: $\angle(\text{Shoulder}, \text{Elbow}, \text{Wrist})$ ensures strict $\le 90^\circ$ depth at the bottom and $\ge 155^\circ$ full extension at lockout.
  - **Plank & Spine Alignment**: $\angle(\text{Shoulder}, \text{Hip}, \text{Ankle})$ monitors body posture, instantly flagging hip sagging ($< 145^\circ$) or excessive piking ($> 200^\circ$).
- **Deterministic State Machine**: Tracks transitions across `calibrating` $\to$ `ready` $\to$ `going_down` $\to$ `bottom_reached` $\to$ `going_up` $\to$ `ready`, preventing cheated half-reps or bouncing.
- **Web Audio Sound Synthesizer**: Low-latency athletic audio cues for target depth lock, rep completion, and posture correction alerts.
- **AI Simulator Mode**: Built-in virtual athlete simulation for headless environments or demo presentations without camera permissions.

### 2. 📊 Mathematical Percentile & Talent Tier Engine
- **National Empirical Norms (`benchmarks.json`)**: Benchmarks calibrated across 5 distinct age divisions (10–13, 14–17, 18–22, 23–30, 30+) for Male and Female categories.
- **Piecewise Linear Interpolation**: Converts discrete rep counts into continuous national percentile ratings ($P_{10}$ to $P_{99.9}$).
- **Dynamic Talent Tiering**:
  - 🏆 **National Elite Prospect** (Top 5% · $P \ge 95$)
  - 🥇 **State Level Contender** (Top 15% · $P \ge 85$)
  - 🥈 **District High Performer** (Top 30% · $P \ge 70$)
  - 🥉 **Active Club Athlete** (Top 50% · $P \ge 45$)
  - 👟 **Developing Talent** (Base Tier · $P < 45$)

### 3. 📜 Official Verified Digital Credential
- **Protocol Verification Hash**: Generates a tamper-evident credential identifier (e.g. `TL-98-HAR-V1K4S`).
- **Comprehensive Biomechanical Breakdown**: Visualizes average depth angle, spine alignment, rep cadence (RPM), form score, and completed vs. incomplete rep ratio.
- **Instant Scout Network Broadcast**: Athletes push verified records to the national scouting network with one click.

### 4. 🛰️ Scout & Coach Discovery Command Center
- **Live Stream Without Refresh**: Incoming submissions appear instantly with animated pulse alerts.
- **Multi-Vector Search & Filters**: Filter prospects by sport (Athletics, Football, Kabaddi, Wrestling, Boxing, Cricket, Hockey, etc.), Indian state/district, age range, and minimum percentile threshold.
- **Athlete Historical Progression**: Interactive Recharts trend charts track growth trajectory across multiple test attempts.
- **Scout Dossier & Shortlisting**: Add custom scout notes, toggle shortlisted prospects, and export verified scouting candidate lists to CSV.

---

## 🧮 Mathematical & Biomechanical Formulation

### 1. 3-Point Joint Angle Formula
For three 2D keypoints $A(x_1, y_1)$ [Shoulder], $B(x_2, y_2)$ [Elbow/Joint Vertex], and $C(x_3, y_3)$ [Wrist]:

$$\vec{u} = A - B = (x_1 - x_2, y_1 - y_2), \quad \vec{v} = C - B = (x_3 - x_2, y_3 - y_2)$$

$$\theta = \arccos\left(\frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}\right) \times \frac{180^\circ}{\pi}$$

### 2. Piecewise Percentile Interpolation
Given an athlete's rep count $R$ falling between empirical benchmark anchor points $(R_i, P_i)$ and $(R_{i+1}, P_{i+1})$:

$$P(R) = P_i + \left(\frac{R - R_i}{R_{i+1} - R_i}\right) \cdot (P_{i+1} - P_i)$$

---

## 🛠️ Quick Start

### Prerequisites
- **Node.js**: v18.0 or higher
- **Browser**: Google Chrome recommended (optimal WebGL & MediaPipe WASM performance)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Codexia-afk/buildathon_proj.git
cd buildathon_proj
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## ⚡ 60-Second Multi-Tab Live Sync Demo (For Judges)

Experience the real-time talent scouting loop on a single machine:

1. **Tab 1 (Scout Dashboard)**: Open [http://localhost:5173/scout](http://localhost:5173/scout) in one window.
2. **Tab 2 (Athlete Assessment)**: Open [http://localhost:5173/assess](http://localhost:5173/assess) in a side-by-side window.
3. Fill in the athlete profile (e.g. *Vikas Kumar*, 17 yrs, *Haryana*, *Wrestling*).
4. Start the workout or click **"Run AI Simulator Demo"** to run a simulated set of push-ups.
5. Click **"Complete & View Official Credential"** and then **"Push to Live Scout Network"**.
6. **Watch Tab 1 instantly highlight and display the new verified athlete in real time** without any manual page reload!

---

## 🔑 Firebase Cloud Integration (Optional)

TalentLens features **Dual-Mode Persistence**:
- **Out of the box**: Operates on an in-memory & browser `BroadcastChannel` reactive event bus—no credentials required.
- **Production Cloud Mode**: To sync across distinct physical devices via Google Cloud Firestore:

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com/) and enable **Firestore Database**.
2. Copy `.env.example` to `.env` and fill in your keys:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
3. Restart Vite (`npm run dev`). The navbar indicator will switch to **"Firestore Live 🟢"**.

---

## 📂 Project Structure

```
buildathon_proj/
├── src/
│   ├── components/
│   │   ├── athlete/             # Webcam workout, HUD, skeleton canvas, verified card
│   │   │   ├── CameraWorkout.tsx
│   │   │   ├── LiveFormHUD.tsx
│   │   │   ├── PoseSkeletonCanvas.tsx
│   │   │   ├── ProfileSetupModal.tsx
│   │   │   └── VerifiedResultCard.tsx
│   │   ├── benchmark/           # National percentile cohort explorer & graphs
│   │   │   └── PercentileExplorer.tsx
│   │   ├── common/              # Navbar, Footer, Modal, Badge, Button components
│   │   ├── landing/             # Hero, Feature Grid, Mission Statement banner
│   │   └── scout/               # Scout discovery dashboard, filters, trendlines, drawer
│   │       ├── AthleteDetailModal.tsx
│   │       ├── AthleteTable.tsx
│   │       ├── FilterBar.tsx
│   │       ├── PerformanceChart.tsx
│   │       ├── ScoutDashboard.tsx
│   │       └── ShortlistDrawer.tsx
│   ├── data/
│   │   ├── benchmarks.json      # Empirical age/gender percentile dataset
│   │   └── seedAthletes.ts      # Seed athlete database for immediate testing
│   ├── hooks/
│   │   ├── usePoseDetection.ts  # MediaPipe Tasks Vision pose inference hook
│   │   └── usePushUpCounter.ts  # Biomechanical finite state machine & rep counter
│   ├── services/
│   │   ├── audioService.ts      # Web Audio API sound effect synthesizer
│   │   ├── dataService.ts       # Unified reactive storage & Firestore synchronization
│   │   ├── firebase.ts          # Firebase SDK initialization
│   │   └── percentileEngine.ts  # Mathematical percentile calculation engine
│   ├── utils/
│   │   └── geometry.ts          # Vector math & 2D joint angle trigonometric utilities
│   ├── types/
│   │   └── index.ts             # TypeScript domain schemas and interfaces
│   ├── App.tsx                  # Root application router
│   ├── main.tsx                 # React DOM entry point
│   └── index.css                # Tailwind CSS custom themes & animations
├── .env.example                 # Environment variable template
├── package.json                 # Project dependencies & scripts
├── tailwind.config.js           # Custom sports-tech color theme palette
└── tsconfig.json                # TypeScript compiler configuration
```

---

## 🗺️ Product Roadmap

- [x] **V1 MVP (Built & Functional)**:
  - Client-side MediaPipe pose tracking & rep counter state machine
  - Biomechanical posture alignment (spine/plank & elbow angle monitoring)
  - Mathematical percentile engine using empirical age/gender norms
  - Real-time scout dashboard with multi-criteria filters & longitudinal trendlines
  - Dual-mode data layer (reactive local event mesh + Firebase Firestore sync)
- [ ] **V2 Planned Extensions**:
  - **Multi-Discipline Test Battery**: Vertical jump power (flight time estimation), 30m sprint laser timer, agility shuttle runs.
  - **Anti-Cheat Vision Shield**: Depth camera validation, 3D trajectory consistency checks, and multi-angle verification.
  - **Multilingual Voice Coach**: Real-time audio coaching in Hindi, Tamil, Telugu, Marathi, Punjabi, and Bengali.
  - **SAI / Khelo India Portal Integration**: Automated export to national sports federation databases with Khelo India Athlete ID syncing.
  - **Offline USSD / SMS Sync**: SMS-based assessment verification for remote regions with zero internet connectivity.

---

## 👥 Built With ❤️ For India's Athletes

Developed for the Buildathon to break geographical barriers and empower every athlete across India with equal access to national sports scouting.

<div align="center">

⭐ **Star this repository if you believe in democratizing grassroots sports talent discovery!**

</div>
