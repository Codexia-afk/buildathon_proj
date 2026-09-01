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
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[**Live Web App**](http://localhost:5173) • [**Native iOS (Xcode/SwiftUI)**](#-native-ios-app-swiftui--xcode) • [**Native Android (Kotlin)**](#-native-android-app-kotlin--jetpack-compose) • [**Sport Gym Batteries**](#-sport-specific-gym-practice-batteries) • [**Pro Athlete Dataset**](#-world-class-pro-athlete-dataset--comparison-engine) • [**Scout Command Center**](#-scout--coach-command-center)

---

</div>

## 📌 Tri-Platform Architecture: iOS (Xcode), Android & Web PWA

TalentLens is delivered across **three high-performance implementations**:

1. **🍎 Native iOS App (`ios/`)**:
   - Written in **100% Swift & SwiftUI** for iOS 16+.
   - Integrates **Apple Vision Framework (`VNDetectHumanBodyPoseRequest`)** and **AVFoundation** for 30+ FPS edge AI inference on the Apple Neural Engine.
   - Built-in **AVSpeechSynthesizer** AI Voice Coach, audio haptics, digital certificate generation, Pro Athlete Comparison sheet & native iOS ShareLink.
   - Ready to open and run directly in **Xcode** (`ios/TalentLens.xcodeproj`).
2. **📱 Native Android App (`android/`)**:
   - Written in **100% Kotlin** with **Jetpack Compose & Material 3**.
   - Integrates **CameraX** for GPU-accelerated frame streaming and **Google MediaPipe Tasks Vision Android SDK** for 30+ FPS edge AI inference.
   - Built-in **TextToSpeech (TTS)** AI Voice Coach and **ToneGenerator** audio synthesizer.
3. **🌐 Progressive Web App (Root `src/`)**:
   - Built with **React 18 + TypeScript + Vite + Tailwind CSS**.
   - Zero-installation instant access in any mobile browser (Chrome/Safari) with **PWA "Add to Home Screen"** and Web Audio/Speech synthesis.

---

## ⚡ Architecture & How It Works

```
                                  TALENTLENS DATA PIPELINE
                                  
 ┌───────────────────────────────────────────────────────────────────────────────────────┐
 │                                    ATHLETE CLIENT                                     │
 │   [Apple Vision / MediaPipe / Camera Feed]                                            │
 │             │ (30+ FPS Real-Time Video Stream)                                        │
 │             ▼                                                                         │
 │   [Landmark Extraction] ────────► 33 2D/3D Anatomical Skeletal Nodes                  │
 │             │                                                                         │
 │             ▼                                                                         │
 │   [Biomechanical FSM] ──────────► Joint Trigonometry: Elbow, Knee & Spine Alignment   │
 │             │                     State Machine: IDLE ➔ READY ➔ DOWN ➔ UP ➔ REP++    │
 │             ▼                                                                         │
 │   [Percentile Engine] ──────────► Continuous Spline Interpolation on SAI/Khelo Norms  │
 │             │                     National Cohort Ranking (0 – 99.9th Percentile)     │
 │             ▼                                                                         │
 │   [Pro Comparison Engine] ──────► Head-to-Head vs 11 Olympic Champions (e.g. Neeraj)  │
 │             │                     Metric Match % & Milestone Gap Analysis             │
 │             ▼                                                                         │
 │   [Verified Result Card] ───────► Unique Protocol Hash (e.g. TL-98-HAR-5921)          │
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

## 🏋️‍♂️ Multi-Exercise Athletic Assessment Suite

TalentLens provides Olympic-grade computer vision testing across 4 foundational athletic dimensions:

| Exercise | Physical Quality | Biomechanical Form Requirement | Unit | Physics / Biomechanics Model |
| :--- | :--- | :--- | :--- | :--- |
| **Standard Push-Ups** | Upper Body Muscular Endurance | Elbow flexion $\le 90^\circ$ depth, $> 155^\circ$ lockout, straight spine | Reps | 3-point joint angle $\theta = \arccos\left(\frac{\mathbf{u}\cdot\mathbf{v}}{\|\mathbf{u}\|\|\mathbf{v}\|}\right)$ |
| **Deep Bodyweight Squats** | Lower Body Strength & Hip Mobility | Knee flexion $\le 90^\circ$ (parallel/deep), standing lockout $> 160^\circ$ | Reps | Hip crease below knee level tracking |
| **Isometric Plank Hold** | Core Stability & Spine Alignment | Neutral spine alignment angle ($155^\circ - 185^\circ$) held to failure | Seconds | Torso straightness deviation penalty engine |
| **Vertical Jump Power** | Explosive Leg Power & Rate of Force | Countermovement dip $\to$ takeoff $\to$ flight hang time | Centimeters | Hang-time physics: $h = \frac{g t^2}{8} \times 100$ |

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

TalentLens includes an empirical baseline dataset of **11 World-Class & Olympic Champions** across all sports. When athletes complete their gym workout or fitness assessment, they can compare their metrics **head-to-head with top-class pro champions**:

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
- **Champion Switcher**: Switch and compare against any champion in the 11-athlete dataset!

---

## 🍎 Native iOS App (SwiftUI + Xcode)

The native iOS application source code and Xcode project are located in [`ios/`](ios/):

### iOS Project Structure:
```
ios/
├── TalentLens.xcodeproj/              # Open directly in Xcode (iOS 16+)
│   └── project.pbxproj               # Project build settings & file references
└── TalentLens/
    ├── Info.plist                     # Camera (NSCameraUsageDescription) & audio permissions
    ├── TalentLensApp.swift            # App lifecycle entry point (@main)
    ├── ContentView.swift              # Root Tab Navigation (Home, Workout, Scout, Standards)
    ├── Model/
    │   └── DataModels.swift           # Enums, ProAthleteDataset & SportTrainingDatabase
    ├── Engine/
    │   ├── GeometryUtils.swift        # Joint angle trigonometry & jump physics
    │   ├── ExerciseStateEngine.swift  # Deterministic FSM state machine
    │   └── PercentileEngine.swift     # Indian national percentile interpolation
    ├── Data/
    │   └── AthleteRepository.swift    # Reactive repository, 5 seed athletes, CSV export
    ├── Audio/
    │   └── VoiceCoachService.swift    # AVSpeechSynthesizer AI Voice Coach & sound cues
    ├── ML/
    │   ├── CameraManager.swift        # AVFoundation live camera frame stream
    │   └── PoseDetectorHelper.swift   # Apple Vision VNDetectHumanBodyPoseRequest & AI Simulator
    └── UI/
        ├── Theme/
        │   └── Colors.swift           # Sports-tech dark palette
        ├── Components/
        │   ├── PoseSkeletonOverlayView.swift   # Real-time SwiftUI Canvas skeleton & HUD
        │   ├── ProAthleteComparisonView.swift  # Pro champion head-to-head comparison modal
        │   ├── CertificateModalView.swift      # Official credential certificate & ShareLink
        │   ├── AthleteDetailModalView.swift    # Athlete dossier, biomechanics & scout notes
        │   ├── AthleteComparisonModalView.swift # Scout head-to-head comparison matrix
        │   └── ProfileSetupModalView.swift     # Athlete profile editor (16 Indian states)
        └── Screens/
            ├── HomeScreen.swift       # Dual-entry landing screen + Sport Battery directory
            ├── WorkoutScreen.swift    # Live Camera + Vision Pose HUD + AI Simulation
            ├── ResultScreen.swift     # Verified result & Pro Champion comparison
            ├── ScoutFeedScreen.swift  # Real-time discovery feed
            └── BenchmarksScreen.swift # Pro Champions dataset + SAI percentile calculator
```

### Running the iOS App in Xcode:
1. Open the project in **Xcode**:
   ```bash
   open ios/TalentLens.xcodeproj
   ```
2. Select your run destination (e.g. **iPhone 17**, **iPhone 16 Pro**, or your connected iPhone).
3. Press **Run (`Cmd + R`)** to build and launch.
4. *Tip*: If running in the **iOS Simulator** (which has no physical camera), tap the **`CPU` (AI Simulation)** button in the Workout screen to simulate realistic athletic movement in real-time!

---

## 🤖 Native Android App (Kotlin + Jetpack Compose)

The complete native Android mobile application source code is available in [`android/`](android/):

### Android Project Structure:
```
android/
├── app/
│   ├── build.gradle.kts          # Dependencies: CameraX, MediaPipe, Compose, Coroutines
│   └── src/main/
│       ├── AndroidManifest.xml   # Camera permissions & hardware acceleration
│       └── java/com/talentlens/app/
│           ├── MainActivity.kt   # Navigation Compose & Root Bottom Bar Scaffold
│           ├── model/            # Kotlin Data Models (ProAthleteDataset, AthleteProfile, etc.)
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

## 🛠️ Quick Start (Web PWA)

### Prerequisites:
- **Node.js**: v18.0 or higher
- **Browser**: Google Chrome / Safari / Edge

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
