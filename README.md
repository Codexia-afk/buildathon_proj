<div align="center">

# 🏅 TalentLens

### **Democratizing Sports Talent Discovery Across India with Edge AI**

An Olympic-grade computer vision platform that turns any smartphone into an AI-powered physical fitness testing lab. Real-time pose estimation validates athletic form, calculates national age/gender percentiles, compares metrics head-to-head with world-class Olympic champions, and broadcasts verified talent credentials live to scout and coach dashboards.

[![React](https://img.shields.io/badge/Web_PWA-React_18_%2B_Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![iOS](https://img.shields.io/badge/Native_iOS-SwiftUI_%2B_Xcode-007AFF?logo=apple&logoColor=white)](https://developer.apple.com/xcode/)
[![Kotlin](https://img.shields.io/badge/Native_Android-Kotlin_%2B_Jetpack_Compose-7F52FF?logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![Apple Vision](https://img.shields.io/badge/Apple_Vision-HumanBodyPose-FF2D55?logo=apple&logoColor=white)](https://developer.apple.com/documentation/vision)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Tasks_Vision_0.10-007FFF?logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![CameraX](https://img.shields.io/badge/CameraX-1.3.4-34A853?logo=android&logoColor=white)](https://developer.android.com/training/camerax)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[**Live Web App**](http://localhost:5173) • [**Tri-Platform Architecture**](#-tri-platform-architecture) • [**Physics & Biomechanics**](#-multi-exercise-athletic-assessment-suite) • [**Sport Gym Batteries**](#-sport-specific-gym-practice-batteries) • [**Pro Athlete Dataset**](#-world-class-pro-athlete-dataset--comparison-engine) • [**Scout Command Center**](#-scout--coach-command-center) • [**Quick Start**](#-quick-start--installation)

---

</div>

## 🌟 Key Capabilities at a Glance

- 🎯 **Edge AI Biomechanical Engine**: 33 anatomical skeletal landmarks tracked at 30+ FPS locally on-device. Zero video frames uploaded to servers.
- 📱 **Tri-Platform Native Parity**: First-class support across **iOS (SwiftUI + Apple Vision)**, **Android (Kotlin + MediaPipe)**, and **Web PWA (React 18 + Vite)**.
- 📊 **SAI & Khelo India Percentile Engine**: Continuous spline interpolation comparing scores across Indian national age/gender cohorts (0 to 99.9th percentile).
- ⭐ **11 Olympic & Pro Champions Dataset**: Compare power, endurance, and form directly against legends like **Neeraj Chopra**, **Jasprit Bumrah**, **Virat Kohli**, **PV Sindhu**, **Mary Kom**, and **Usain Bolt**.
- 🏋️‍♂️ **10 Sport-Specific Gym Batteries**: Curated gym drills, kinetic chain rationales, and elite targets for Cricket, Wrestling, Football, Kabaddi, Badminton, Boxing, Athletics, Weightlifting, Hockey, and Multi-Sport.
- 🔍 **Live Scout & Coach Command Center**: Real-time reactive stream of athlete assessments, multi-dimensional filters, radar charts, athlete dossier inspector, shortlisting, coach review notes, and CSV export.
- 🎙️ **Real-Time Voice Coaching & Haptics**: Voice cues (`AVSpeechSynthesizer`, Android TTS, Web Speech API) providing form correction and rep counts during workouts.
- 📜 **Tamper-Evident Digital Certificates**: Generates verifiable digital credentials with unique SHA-based verification hashes (e.g., `TL-98-HAR-5921`) and shareable athlete cards.

---

## 📌 Tri-Platform Architecture

TalentLens is architected from the ground up for seamless cross-platform performance:

```
                               ┌─────────────────────────────────────────────────────────┐
                               │                    TALENTLENS CLIENTS                   │
                               └──────┬───────────────────┬───────────────────┬──────────┘
                                      │                   │                   │
                                      ▼                   ▼                   ▼
                           ┌─────────────────────┐┌──────────────────┐┌──────────────────┐
                           │   🍎 Native iOS     ││ 🤖 Native Android││  🌐 Web PWA      │
                           │ • Swift & SwiftUI   ││ • Kotlin Compose ││ • React 18 + TS  │
                           │ • Apple Vision API  ││ • MediaPipe Tasks││ • Vite + Tailwind│
                           │ • AVFoundation      ││ • CameraX Stream ││ • MediaPipe Web  │
                           │ • Neural Engine NPU ││ • GPU Accel      ││ • Web Speech/PWA │
                           └──────────┬──────────┘└─────────┬────────┘└─────────┬────────┘
                                      │                     │                   │
                                      └─────────────────────┼───────────────────┘
                                                            ▼
                                ┌───────────────────────────────────────────────────────┐
                                │             BIOMECHANICAL INFERENCE ENGINE            │
                                │ • 33-Point Skeletal Landmark Tracking @ 30+ FPS       │
                                │ • Trigonometric Joint Angle & Form Validation         │
                                │ • Deterministic Finite State Machine (FSM)            │
                                │ • Vertical Jump Kinematics & Hang-Time Physics        │
                                └───────────────────────────┬───────────────────────────┘
                                                            │
                                                            ▼
                                ┌───────────────────────────────────────────────────────┐
                                │              ANALYTICS & COMPARISON CORE              │
                                │ • SAI / Khelo India Spline Percentile Interpolation   │
                                │ • 11 Pro Champion Head-to-Head Comparison Matrix      │
                                │ • Tamper-Evident SHA Protocol Hash Generation         │
                                └───────────────────────────┬───────────────────────────┘
                                                            │
                                                            ▼
                                ┌───────────────────────────────────────────────────────┐
                                │               REAL-TIME PERSISTENCE MESH              │
                                │   Local Reactive Mesh (BroadcastChannel + Storage)    │
                                │   Cloud Streaming (Google Cloud Firebase Firestore)   │
                                └───────────────────────────┬───────────────────────────┘
                                                            │
                                                            ▼
                                ┌───────────────────────────────────────────────────────┐
                                │               SCOUT & COACH COMMAND CENTER            │
                                │ • Live Real-Time Assessment Discovery Feed            │
                                │ • Multi-Dimensional Filters (Sport, State, %ile)      │
                                │ • Head-to-Head Radar Matrix & Historical Dossiers     │
                                │ • Scout Shortlist Desk, Notes & CSV Talent Export     │
                                └───────────────────────────────────────────────────────┘
```

### Platform Details:

1. **🍎 Native iOS App (`ios/`)**:
   - Written in **100% Swift & SwiftUI** for iOS 16+.
   - Integrates **Apple Vision Framework (`VNDetectHumanBodyPoseRequest`)** and **AVFoundation** for 30+ FPS edge AI inference on the Apple Neural Engine.
   - Built-in **AVSpeechSynthesizer** AI Voice Coach, audio haptics, digital certificate generation, Pro Athlete Comparison sheet & native iOS `ShareLink`.
   - Ready to open and run directly in **Xcode** (`ios/TalentLens.xcodeproj`).
   - Includes **AI Simulation Mode** (`CPU` toggle) to test live movement in the iOS Simulator without hardware cameras.

2. **📱 Native Android App (`android/`)**:
   - Written in **100% Kotlin** with **Jetpack Compose & Material 3**.
   - Integrates **CameraX** for GPU-accelerated frame streaming and **Google MediaPipe Tasks Vision Android SDK** for 30+ FPS edge AI inference.
   - Built-in **TextToSpeech (TTS)** AI Voice Coach and **ToneGenerator** audio synthesizer.
   - Ready to open and run in **Android Studio** (`android/`).

3. **🌐 Progressive Web App (Root `src/`)**:
   - Built with **React 18 + TypeScript + Vite + Tailwind CSS**.
   - Zero-installation instant access in any mobile browser (Chrome/Safari) with **PWA "Add to Home Screen"** and Web Audio/Speech synthesis.
   - Works fully offline with local reactive persistence and optional Firebase cloud sync.

---

## 🏋️‍♂️ Multi-Exercise Athletic Assessment Suite

TalentLens provides Olympic-grade computer vision testing across 4 foundational athletic dimensions:

| Exercise | Physical Quality | Biomechanical Form Requirement | Unit | Physics / Biomechanics Model |
| :--- | :--- | :--- | :--- | :--- |
| **Standard Push-Ups** | Upper Body Muscular Endurance | Elbow flexion $\le 90^\circ$ depth, $> 155^\circ$ lockout, straight spine ($155^\circ - 185^\circ$) | Reps | 3-point joint angle: $\theta = \arccos\left(\frac{\mathbf{u}\cdot\mathbf{v}}{\|\mathbf{u}\|\|\mathbf{v}\|}\right)$ |
| **Deep Bodyweight Squats** | Lower Body Strength & Hip Mobility | Knee flexion $\le 90^\circ$ (parallel/deep), standing lockout $> 160^\circ$ | Reps | Hip crease below knee level tracking |
| **Isometric Plank Hold** | Core Stability & Spine Alignment | Neutral spine alignment angle ($155^\circ - 185^\circ$) held to failure | Seconds | Torso straightness deviation penalty engine |
| **Vertical Jump Power** | Explosive Leg Power & Rate of Force | Countermovement dip $\to$ takeoff $\to$ flight hang time | Centimeters | Hang-time kinematics: $h = \frac{g t^2}{8} \times 100$ |

### 📐 Biomechanical Formulas & Physics Engine:

1. **Joint Angle Trigonometry**:
   Given three consecutive anatomical landmarks $A(x_a, y_a)$, $B(x_b, y_b)$ (the vertex), and $C(x_c, y_c)$:
   $$\mathbf{u} = A - B, \quad \mathbf{v} = C - B$$
   $$\theta = \arccos\left(\frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}\right) \times \left(\frac{180^\circ}{\pi}\right)$$

2. **Vertical Jump Height from Hang Time**:
   Calculated from time airborne between foot takeoff and touchdown ($t$ in seconds) using gravitational acceleration ($g = 9.80665 \text{ m/s}^2$):
   $$h = \frac{1}{2} g \left(\frac{t}{2}\right)^2 = \frac{g t^2}{8} \times 100 \text{ cm}, \quad v_0 = \sqrt{2gh}$$

3. **Continuous Spline Percentile Interpolation**:
   Interpolates exact athlete scores against age- and gender-specific Indian national benchmarks published by the Sports Authority of India (SAI):
   $$\text{Percentile}(s) = P_1 + (s - S_1) \times \frac{P_2 - P_1}{S_2 - S_1}$$

---

## 🏏 Sport-Specific Gym Practice Batteries

TalentLens maps tailored exercise drills, sport biomechanical rationales, and target gym benchmarks for **10 Olympic & Indian Sports disciplines**:

| Sport | Primary Quality Focus | Curated Gym Drills & Role Rationales | Elite Gym Target |
| :--- | :--- | :--- | :--- |
| **🏏 Cricket** | Rotational Core Stability & Stride Force | **Vertical Jump** (Fast bowling takeoff & batting stride), **Plank Hold** (Lumbar spine protection), **Squats** (Wicket stance), **Push-ups** (Throwing arm) | Jump $>55\text{ cm}$<br>Plank $>150\text{ s}$ |
| **🤼 Wrestling** | Isometric Core Bracing & Leg Shot Drive | **Plank Hold** (Gut-wrench roll defense & mat bridge), **Squats** (Deep single/double leg attack shots), **Push-ups** (Underhook hand-fighting) | Plank $>180\text{ s}$<br>Squats $>55\text{ reps}$ |
| **⚽ Football** | Aerial Hang-Time & Rapid Deceleration | **Vertical Jump** (Aerial header duels & set pieces), **Squats** (Knee ligament resilience during cutting), **Plank Hold** (Shoulder shielding) | Jump $>60\text{ cm}$<br>Squats $>50\text{ reps}$ |
| **🤾 Kabaddi** | Lateral Spring & Cantilever Core Defense | **Squats** (Tackle dives & bonus-line lunges), **Vertical Jump** (Chain tackle frog/lion jump evasions), **Plank Hold** (Midline drag resistance) | Jump $>62\text{ cm}$<br>Squats $>55\text{ reps}$ |
| **🏸 Badminton** | Peak Apex Reach & Court Lunge Recovery | **Vertical Jump** (Rear-court jump smash contact height), **Squats** (Front-court lunge recovery), **Plank Hold** (Torso rotation stabilization) | Jump $>62\text{ cm}$<br>Squats $>48\text{ reps}$ |
| **🥊 Boxing** | Cadence Punch Speed & Shock Absorption | **Push-ups** (Combination punch cadence $>45\text{ RPM}$), **Squats** (Kinetic chain leg power to fist), **Plank Hold** (Body punch protection) | Push-ups $>55\text{ reps}$<br>Plank $>170\text{ s}$ |
| **🏃 Athletics** | Ground Reaction Force & Sprint Stride | **Vertical Jump** (Ground reaction takeoff velocity $F = m \cdot a$), **Squats** (Starting block drive phase), **Plank Hold** (Upright sprint posture) | Jump $>65\text{ cm}$<br>Squats $>55\text{ reps}$ |
| **🏋️ Weightlifting** | Olympic ATG Depth & Spine Rigidity | **Squats** (Ass-to-grass sub-$80^\circ$ knee depth for clean catch), **Plank Hold** (Intra-abdominal pressure under heavy loads), **Vertical Jump** (Second pull) | Squats $>60\text{ reps (ATG)}$<br>Plank $>200\text{ s}$ |
| **🏑 Hockey** | Low-Crouch Stamina & Drag-Flick Torque | **Squats** (Prolonged semi-crouched stick play), **Plank Hold** (Drag-flick rotational torque transfer), **Vertical Jump** (Turf breakaway sprint) | Squats $>50\text{ reps}$<br>Plank $>140\text{ s}$ |
| **🏅 Multi-Sport** | Full-Spectrum Biomechanical Balance | Balanced Tri-Power protocol across Push, Squat, Plank, and Vertical Jump. | Full-Spectrum Base |

---

## ⭐ World-Class Pro Athlete Dataset & Comparison Engine

TalentLens includes an empirical baseline dataset of **11 World-Class & Olympic Champions** across all sports disciplines. When athletes complete their gym workout or fitness assessment, they can compare their metrics **head-to-head with top-class pro champions**:

| Champion | Sport | Titles & Achievements | Physical Archetype & Benchmark Standard | Signature Drill |
| :--- | :--- | :--- | :--- | :--- |
| **🥇 Neeraj Chopra** | Athletics | Tokyo Olympic Gold & World Champion | *Maximal Ground Reaction Force & Kinetic Torque*<br>• Jump: **76 cm** • Squats: **70** • Plank: **260s** | Vertical Jump |
| **🏏 Jasprit Bumrah** | Cricket | World #1 Fast Bowler & T20 Champion | *Hyper-Elastic Stride Plant & Anti-Rotational Core*<br>• Jump: **68 cm** • Plank: **240s** • Squats: **65** | Vertical Jump |
| **⚡ Virat Kohli** | Cricket | Player of the Decade & Fitness Icon | *High-Cadence Deceleration & Relentless Core Stamina*<br>• Squats: **68** • Plank: **260s** • Push-ups: **58** | Squats |
| **⚽ Sunil Chhetri** | Football | 4th Highest International Goalscorer | *Aerial Apex Hang-Time & 90-Min Deceleration Engine*<br>• Jump: **74 cm** • Squats: **68** • Plank: **210s** | Vertical Jump |
| **🤼 Bajrang Punia** | Wrestling | Olympic Bronze & 4x World Medalist | *Isometric Core Fortress & Mat Takedown Engine*<br>• Plank: **300s** • Squats: **75** • Push-ups: **70** | Plank Hold |
| **🏸 PV Sindhu** | Badminton | 2x Olympic Medalist & World Champion | *Rear-Court Smash Apex & Extreme Lunge Recovery*<br>• Jump: **70 cm** • Squats: **62** • Plank: **200s** | Vertical Jump |
| **🥊 Mary Kom** | Boxing | 6x World Amateur Boxing Champion | *High-Cadence Punch Drive & Torso Body-Armor*<br>• Push-ups: **68** • Plank: **250s** • Squats: **65** | Push-Ups |
| **🤾 Pardeep Narwal** | Kabaddi | Pro Kabaddi All-Time Raid Record Holder | *Explosive Lateral Spring & Cantilever Core*<br>• Squats: **72** • Jump: **70 cm** • Plank: **240s** | Squats |
| **🏋️ Mirabai Chanu** | Weightlifting | Olympic Silver & World Champion | *Olympic ATG Deep Hip Mobility & Maximum Spine Rigidity*<br>• Squats: **80 (ATG)** • Plank: **320s** • Jump: **66 cm** | Squats |
| **🏑 Manpreet Singh** | Hockey | Olympic Captain & Tokyo Bronze | *Low-Crouch Drag-Flick Torque & Turf Breakaway*<br>• Squats: **66** • Plank: **220s** • Jump: **62 cm** | Squats |
| **⚡ Usain Bolt** | Multi-Sport | 8x Olympic Gold & 100m World Record | *Peak Ground Reaction Velocity & Elastic Stride Power*<br>• Jump: **82 cm** • Squats: **72** • Plank: **280s** | Vertical Jump |

### 📊 Head-to-Head Comparison Features:
- **Pro Match Dial**: Computes the exact percentage match ($\%$) of the champion's score (e.g., *84% of Jasprit Bumrah's Fast Bowling Jump Power*).
- **Milestone Gap Analysis**: Calculates the exact gym gains needed to reach Olympic level (e.g., *"+9 cm jump height needed to match Neeraj Chopra's benchmark"*).
- **Champion Coaching Quotes**: Real training advice from the champions explaining how they master that physical quality.
- **Champion Switcher**: Switch and compare against any champion in the 11-athlete dataset seamlessly.

---

## 🔍 Scout & Coach Command Center

The Scout Dashboard provides national selectors, sports academies, and grassroots coaches with an end-to-end scouting pipeline:

- **Live Assessment Feed**: Real-time event stream displaying new verified athlete submissions as they complete assessments across India.
- **Multi-Dimensional Filters**: Filter by Test Type, Sport, State (all 28 states & UTs), Age Brackets, and Minimum National Percentile (Top 5%, Top 15%, Top 30%).
- **Head-to-Head Comparison Matrix**: Select any two athletes to render a side-by-side biomechanical breakdown with radar visualizations.
- **Athlete Dossier Inspector**: View athlete profiles, historical progression curves, form scores, and verified video telemetry.
- **Scout Shortlist & Notes**: Add private scout assessment notes and bookmark promising talent directly to the Scout Shortlist Drawer.
- **CSV Data Export**: One-click export of verified athlete rosters and scores for official SAI / federation reporting.

---

## 📂 Repository Structure

```
MIro/
├── public/                     # Static assets & PWA manifest
├── src/                        # Web PWA Source Code (React + Vite + TypeScript)
│   ├── components/
│   │   ├── athlete/            # Camera workout, HUD, skeleton canvas, certificates, pro modal
│   │   ├── benchmark/          # Interactive national percentile & SAI standard explorer
│   │   ├── common/             # Navigation, modals, buttons, badges, footer
│   │   ├── landing/            # Hero section, feature showcase, mission banner
│   │   └── scout/              # Live discovery feed, athlete table, comparison matrix, shortlist
│   ├── data/
│   │   ├── benchmarks.json     # SAI & Khelo India age/gender percentile distribution tables
│   │   └── seedAthletes.ts     # Baseline athlete dataset, sport batteries, pro athlete roster
│   ├── hooks/
│   │   ├── useExerciseEngine.ts # Finite state machine & biomechanics processor
│   │   ├── usePoseDetection.ts  # MediaPipe Tasks Vision edge worker hook
│   │   └── usePushUpCounter.ts  # Real-time counter hook
│   ├── services/
│   │   ├── audioService.ts      # Web Audio sound cues & Web Speech voice coaching
│   │   ├── dataService.ts       # Reactive local mesh (BroadcastChannel) & Firestore sync
│   │   ├── firebase.ts          # Firebase configuration loader
│   │   └── percentileEngine.ts  # Mathematical continuous spline percentile calculator
│   ├── types/                  # TypeScript interface declarations
│   ├── App.tsx                 # Root application component & routing
│   └── main.tsx                # React DOM root mounting
├── ios/                        # Native iOS Application (SwiftUI + Xcode)
│   ├── TalentLens.xcodeproj/   # Xcode project configuration
│   └── TalentLens/             # Swift sources (Vision Pose Detection, AVSpeech, Audio, Views)
├── android/                    # Native Android Application (Kotlin + Jetpack Compose)
│   ├── app/                    # Compose UI, CameraX, MediaPipe Android SDK, TTS
│   ├── build.gradle.kts
│   └── settings.gradle.kts
├── package.json                # Web dependencies & scripts
├── tailwind.config.js          # Tailwind CSS styling configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## 🚀 Quick Start & Installation

### 🌐 1. Web Progressive Web App (PWA)

#### Prerequisites:
- **Node.js**: `v18.0` or higher
- **Browser**: Google Chrome / Safari / Edge (with camera permissions allowed)

```bash
# Clone repository
git clone https://github.com/Codexia-afk/buildathon_proj.git
cd buildathon_proj

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

#### Optional Firebase Cloud Sync:
Create a `.env` file in the root directory (based on `.env.example`):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
*(Note: If Firebase credentials are not provided, TalentLens runs seamlessly in zero-config reactive multi-tab local mesh mode!)*

---

### 🍎 2. Native iOS App (SwiftUI + Xcode)

#### Prerequisites:
- **macOS**: Sonoma 14+ or Sequoia 15+
- **Xcode**: 15.0+ or 16.0+
- **iOS Target**: iOS 16.0+

```bash
# Open Xcode project
open ios/TalentLens.xcodeproj
```

1. Select your target simulator (e.g., **iPhone 16 Pro**) or a connected physical iPhone.
2. Press **`Cmd + R`** to build and run.
3. *Tip for Simulator*: Tap the **`CPU` (AI Simulation)** button on the Workout screen to simulate athletic movements and test the pose estimation engine without a physical camera!

---

### 🤖 3. Native Android App (Kotlin + Jetpack Compose)

#### Prerequisites:
- **Android Studio**: Hedgehog, Iguana, or Ladybug
- **Android SDK**: API Level 34 (Android 14)
- **Minimum SDK**: API Level 26 (Android 8.0)

1. Open the `android/` directory in **Android Studio**.
2. Allow Gradle sync to complete.
3. Connect an Android device with USB debugging enabled (or start an Android Emulator).
4. Run `app` (**`Shift + F10`**).

---

## 🔒 Privacy & Edge AI Architecture

TalentLens is built with an absolute commitment to athlete privacy:

- **100% On-Device Inference**: Raw camera video frames are processed in-memory directly on the device GPU/NPU (Apple Vision on iOS, MediaPipe on Android & Web).
- **Zero Video Uploads**: Video recordings are **never** transmitted to remote servers or cloud storage.
- **Anonymous Telemetry**: Only numeric biomechanical metrics (angles, rep counts, form scores, and national percentiles) and cryptographic hashes are broadcast to the scout mesh.
- **Equal Access**: Operates seamlessly in low-connectivity rural stadiums, local gyms, and remote schools across India.

---

## 👥 Built With ❤️ For India's Athletes

TalentLens was engineered for the Buildathon to break geographic barriers and empower every athlete across India with equal access to national sports scouting.

<div align="center">

⭐ **Star this repository if you believe in democratizing grassroots sports talent discovery!**

</div>

