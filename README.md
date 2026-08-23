# 🏅 TalentLens: AI-Powered Sports Talent Assessment Protocol

> **"Discover talent, wherever it's hiding."**  
> An Olympic-grade edge AI computer vision platform democratizing sports scouting and physical fitness assessment across India.

---

## ⚡ Hackathon Pitch (For Submission Forms)
In India, millions of naturally gifted athletes in rural villages and tier-2/3 towns remain undiscovered simply because formal sports scouting trials happen only in large metro stadiums. **TalentLens** eliminates this barrier by transforming any basic smartphone or laptop camera into an AI-powered physical fitness testing lab. Utilizing client-side MediaPipe Pose estimation, TalentLens tracks 33 body landmarks at 30+ FPS in real time, validates strict biomechanical form (such as 90° elbow flexion and neutral spine plank integrity) to count clean push-up reps, mathematically benchmarks scores against national age and gender percentile curves aligned with SAI / Khelo India standards, and streams verified assessment credentials live to a real-time scout discovery dashboard—empowering coaches and sports federations to discover, evaluate, and shortlist grassroots talent anywhere in the nation.

---

## 🏗️ Architecture & Tech Stack

```
                                  TALENTLENS ARCHITECTURE
                                  
+-----------------------------------------------------------------------------------------+
|                                    ATHLETE CLIENT                                       |
|  [Webcam / Phone Cam]                                                                   |
|          │                                                                              |
|          ▼                                                                              |
|  [@mediapipe/tasks-vision] ───► 33 Body Keypoints (Shoulder, Elbow, Wrist, Hip, Ankle)  |
|          │                                                                              |
|          ▼                                                                              |
|  [Biomechanical FSM] ────────► Angle Calculation (Elbow <90° Depth, Trunk >155° Plank)  |
|          │                                                                              |
|          ▼                                                                              |
|  [Percentile Engine] ────────► Linear/Spline Interpolation on benchmarks.json (0-100%)  |
|          │                                                                              |
|          ▼                                                                              |
|  [Verified Card Generator] ──► Cryptographic Protocol Hash + PNG / Shareable Card       |
+--------------------------------------------┬--------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
|                                REALTIME DATA SYNCHRONIZATION                            |
|                                                                                         |
|   ┌────────────────────────────────┐          ┌─────────────────────────────────────┐  |
|   │   Cloud Mode: Firebase Live    │    OR    │    Local Demo: Reactive Event Mesh  │  |
|   │  • Firestore `onSnapshot`      │          │  • Multi-Tab BroadcastChannel       │  |
|   │  • collection('assessments')   │          │  • localStorage Reactive Bus        │  |
|   └────────────────────────────────┘          └─────────────────────────────────────┘  |
+--------------------------------------------┬--------------------------------------------+
                                             │ (Live WebSocket stream without refresh)
                                             ▼
+-----------------------------------------------------------------------------------------+
|                                  SCOUT & COACH DASHBOARD                                |
|  • Live Incoming Assessment Stream (Highlight animations on new arrival)                |
|  • Multi-Dimensional Filters: Sport, State (Haryana, Kerala, etc.), Age, Min %ile      |
|  • Recharts Growth Trendlines: Multi-attempt tracking over time                         |
|  • Scout Review Notes & Shortlisting Drawer (CSV Export)                                |
+-----------------------------------------------------------------------------------------+
```

### Core Technologies
- **Frontend Framework:** React 18 + TypeScript + Vite
- **Styling & Theme:** Tailwind CSS (Custom energetic sports-tech palette: Electric Blaze Orange `#FF4D00`, Cyber Cyan `#00F0FF`, Verified Emerald `#10B981`, Deep Onyx `#070A11`)
- **Pose Estimation:** MediaPipe Tasks Vision (`@mediapipe/tasks-vision`) running entirely in-browser with GPU WebGL/WASM acceleration
- **Realtime Database:** Firebase Firestore (with live `onSnapshot` listeners + automatic local multi-tab `BroadcastChannel` fallback)
- **Charts & Visualizations:** Recharts for national cohort distributions & historical progression analytics
- **Audio Synthesizer:** Web Audio API generating low-latency real-time athletic cues for depth lock and rep completion
- **Routing:** React Router v6
- **Animations:** Lucide React & Canvas Confetti

---

## 🚀 Key Features Implemented

### 1. 🎯 In-Browser Computer Vision Push-Up Counter
- Tracks 33 anatomical landmarks live from any standard webcam feed.
- Calculates dynamic 3-point joint angles in 2D space:
  - **Elbow Flexion Angle**: $\angle(\text{Shoulder}, \text{Elbow}, \text{Wrist})$. Target depth $\le 90^\circ$, full lockout $\ge 155^\circ$.
  - **Trunk Alignment Angle**: $\angle(\text{Shoulder}, \text{Hip}, \text{Ankle})$. Flags hip sag or excessive pike ($< 145^\circ$ or $> 200^\circ$).
- Real-time skeleton canvas overlay with neon joint badges and dynamic angle degrees.
- Built-in **AI Push-Up Simulation Demo Runner** for headless environments or devices without webcam permissions.

### 2. 📊 Continuous Mathematical Percentile Engine (`benchmarks.json`)
- Multi-bracket empirical dataset covering Male and Female athletes across 5 age divisions (10-13, 14-17, 18-22, 23-30, 30+).
- Continuous linear interpolation between 10th, 25th, 50th (median), 75th, 90th (elite), 95th (state), and 99th (national) percentiles.
- Dynamic athletic talent tier categorization:
  - 🏆 *National Elite Prospect (Top 5%)*
  - 🥇 *State Level Contender (Top 15%)*
  - 🥈 *District High Performer (Top 30%)*
  - 🥉 *Active Club Athlete (Top 50%)*
  - 👟 *Developing Talent (Base Tier)*

### 3. 📜 Verified Assessment Card
- Generates official verified digital credential with a protocol hash (e.g. `TL-98-HAR-V1K4S`).
- Visualizes athlete score vs. national cohort percentiles via interactive Recharts bar graphs.
- Direct "Push to Live Scout Network" broadcast action.

### 4. 🛰️ Scout & Coach Realtime Discovery Dashboard
- **Live Stream**: Powered by Firestore `onSnapshot` listener—new assessments appear live with pulsing highlights without manual page refresh.
- **Multi-Filter Engine**: Filter by Sport (Athletics, Football, Kabaddi, Wrestling, Boxing, Cricket, Hockey, etc.), State (28 Indian states), Age, and Min Percentile.
- **Athlete Detail Inspection**: Historical trend lines (Recharts) showing performance progression across tests.
- **Scout Review Notes & Shortlisting**: Save notes, bookmark prospects, and export shortlists to CSV.
- **Live Simulator Button**: One-click button to simulate an incoming live assessment from another state in real time for effortless hackathon judging!

---

## 🛠️ Quickstart & Local Setup

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 2. Installation
```bash
# Clone or navigate to the project directory
cd MIro

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Firebase Configuration (Optional)

TalentLens is built with **Dual-Mode Persistence**:
- **Out of the box**, it automatically runs on an instant reactive multi-tab event mesh (using browser `BroadcastChannel` and `localStorage`). You can open two tabs side-by-side (Athlete in Tab 1, Scout in Tab 2) and see instant real-time synchronization without any setup!
- To connect your own live **Google Cloud Firebase** project:
  1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/).
  2. Enable **Firestore Database** (in test mode).
  3. Create a `.env` file in the root directory (based on `.env.example`):
     ```env
     VITE_FIREBASE_API_KEY=AIzaSyYourActualApiKeyHere
     VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
     ```
  4. Restart Vite (`npm run dev`). The status badge in the navbar will switch to **"Firestore Live 🟢"**.

---

## 🗺️ Product Roadmap (V2 Beyond Hackathon)

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Multi-Test Battery** | Vertical jump height, 30m sprint laser timer, agility shuttle runs | 📅 Planned |
| **Anti-Cheat Vision** | Multi-angle video tamper detection and depth sensor checks | 📅 Planned |
| **Multilingual Voice Coach** | Real-time audio coaching in Hindi, Tamil, Telugu, Marathi, Bengali | 📅 Planned |
| **Offline Mesh / SMS Sync** | Offline assessment caching with SMS/USSD sync for remote areas | 📅 Planned |
| **Federation Portal** | Direct integration with SAI (Sports Authority of India) Khelo India ID | 📅 Planned |

---

## 🏆 Summary
TalentLens brings high-performance sports science directly into the hands of every aspiring Indian athlete—democratizing access, eliminating geographic bias, and discovering the champions of tomorrow.
