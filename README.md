<div align="center">

# 🏅 TalentLens

### **Democratizing Sports Talent Discovery Across India with Edge AI**

An Olympic-grade computer vision platform that turns any smartphone into an AI-powered physical fitness testing lab. Real-time pose estimation validates athletic form, calculates national age/gender percentiles, and broadcasts verified talent credentials live to scout and coach dashboards.

[![React](https://img.shields.io/badge/Web_PWA-React_18_%2B_Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Kotlin](https://img.shields.io/badge/Native_Android-Kotlin_%2B_Jetpack_Compose-7F52FF?logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Tasks_Vision_0.10-007FFF?logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![CameraX](https://img.shields.io/badge/CameraX-1.3.4-34A853?logo=android&logoColor=white)](https://developer.android.com/training/camerax)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[**Live Web App**](http://localhost:5173) • [**Native Android (Kotlin)**](#-native-android-app-kotlin--jetpack-compose) • [**Architecture**](#-architecture--how-it-works) • [**Biomechanical Engine**](#-biomechanical--ai-engine) • [**Scout Command Center**](#-scout--coach-command-center)

---

</div>

## 📌 Dual Architecture: Web PWA & Native Android (Kotlin)

TalentLens is delivered in **two high-performance implementations**:

1. **📱 Native Android App (`android/`)**:
   - Written in **100% Kotlin** with **Jetpack Compose & Material 3**.
   - Integrates **CameraX** for GPU-accelerated frame streaming and **Google MediaPipe Tasks Vision Android SDK** for 30+ FPS edge AI inference.
   - Built-in **TextToSpeech (TTS)** AI Voice Coach and **ToneGenerator** audio synthesizer.
2. **🌐 Progressive Web App (Root `src/`)**:
   - Built with **React 18 + TypeScript + Vite + Tailwind CSS**.
   - Zero-installation instant access in any mobile browser (Chrome/Safari) with **PWA "Add to Home Screen"** and Web Audio/Speech synthesis.

---

## ⚡ Architecture & How It Works

```
                                  TALENTLENS DATA PIPELINE
                                  
 ┌───────────────────────────────────────────────────────────────────────────────────────┐
 │                                    ATHLETE CLIENT                                     │
 │   [CameraX / Webcam Feed]                                                             │
 │             │ (30+ FPS Video Stream)                                                  │
 │             ▼                                                                         │
 │   [Google MediaPipe Pose] ──────► 33 2D/3D Anatomical Landmarks                       │
 │             │                                                                         │
 │             ▼                                                                         │
 │   [Biomechanical FSM] ──────────► Joint Trigonometry: Elbow, Knee & Spine Alignment   │
 │             │                     State Machine: IDLE ➔ READY ➔ DOWN ➔ UP ➔ REP++    │
 │             ▼                                                                         │
 │   [Percentile Engine] ──────────► Continuous Spline Interpolation on National Norms   │
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
 │   • Multi-Dimensional Filters: Test Type, Sport, State (28 States), Min %ile          │
 │   • Head-to-Head Comparison Matrix with Multilateral Radar Visualizations             │
 │   • Scout Review Desk: Athlete Dossier Inspection, Coach Notes, Shortlist & CSV Export│
 └───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Native Android App (Kotlin + Jetpack Compose)

The complete native Android mobile application source code is available in the [`android/`](file:///Users/srinjoypramanick/MIro/android) directory:

### Android Project Structure:
```
android/
├── app/
│   ├── build.gradle.kts          # Dependencies: CameraX, MediaPipe, Compose, Coroutines
│   └── src/main/
│       ├── AndroidManifest.xml   # Camera permissions & hardware acceleration
│       └── java/com/talentlens/app/
│           ├── MainActivity.kt   # Navigation Compose & Root Bottom Bar Scaffold
│           ├── model/            # Kotlin Data Models (AthleteProfile, AssessmentResult, etc.)
│           ├── engine/
│           │   ├── GeometryUtils.kt        # Joint angle trigonometry & jump height physics
│           │   ├── ExerciseStateEngine.kt  # Deterministic FSM state machine
│           │   └── PercentileEngine.kt     # Indian national percentile interpolation
│           ├── ml/
│           │   └── PoseDetectorHelper.kt   # MediaPipe Tasks Vision PoseLandmarker
│           ├── audio/
│           │   └── VoiceCoachService.kt    # Android TextToSpeech & ToneGenerator
│           └── ui/
│               ├── theme/        # Sports-tech dark color palette
│               ├── components/   # Compose PoseSkeletonOverlay & CertificateView
│               └── screens/
│                   ├── HomeScreen.kt       # Dual-entry landing screen
│                   ├── WorkoutScreen.kt    # CameraX live preview + HUD
│                   ├── ResultScreen.kt     # Verified result & national %ile
│                   ├── ScoutFeedScreen.kt  # Real-time discovery feed
│                   └── BenchmarksScreen.kt # Interactive standards calculator
├── build.gradle.kts
└── settings.gradle.kts
```

### Running the Android App:
1. Open the `android/` directory in **Android Studio (Hedgehog / Iguana / Ladybug)**.
2. Ensure you have Android SDK 34 installed.
3. Connect an Android device (or launch an Emulator with Camera support).
4. Run `app` (`Shift + F10`).

---

## 🏋️‍♂️ Multi-Exercise Athletic Assessment Suite

| Exercise | Physical Quality | Biomechanical Requirement | Unit |
| :--- | :--- | :--- | :--- |
| **Standard Push-Ups** | Upper Body Muscular Endurance | Elbow flexion $\le 90^\circ$ depth, $> 155^\circ$ lockout, straight spine | Reps |
| **Deep Bodyweight Squats** | Lower Body Strength & Hip Mobility | Knee flexion $\le 90^\circ$ (parallel/deep), standing lockout $> 160^\circ$ | Reps |
| **Isometric Plank Hold** | Core Stability & Spine Alignment | Neutral spine alignment angle ($155^\circ - 185^\circ$) held to failure | Seconds |
| **Vertical Jump Power** | Explosive Leg Power & Rate of Force | Countermovement dip $\to$ takeoff $\to$ flight hang time ($h = \frac{g t^2}{8}$) | Centimeters |

---

## 🛠️ Quick Start (Web PWA)

### Prerequisites
- **Node.js**: v18.0 or higher
- **Browser**: Google Chrome (optimal WebGL & MediaPipe WASM performance)

```bash
git clone https://github.com/Codexia-afk/buildathon_proj.git
cd buildathon_proj
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 👥 Built With ❤️ For India's Athletes

Developed for the Buildathon to break geographical barriers and empower every athlete across India with equal access to national sports scouting.

<div align="center">

⭐ **Star this repository if you believe in democratizing grassroots sports talent discovery!**

</div>
