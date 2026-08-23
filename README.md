# TalentLens

AI-powered sports talent assessment platform. An athlete records a push-up set on webcam, gets live AI-counted reps and a national percentile score, and the verified result appears in real time on a scout/coach dashboard.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173` or `http://localhost:3000`) in **Chrome** — it has the most reliable webcam + WebGL support for the pose-detection model.

## How it works

- **Athlete flow** (`/assess`): fills a short profile, enables the webcam, and does a set of push-ups. Real-time client-side pose estimation tracks body keypoints, calculates elbow angle and counts reps via a state machine, and converts the final rep count into a percentile against a national age/gender benchmark table.
- **Scout dashboard** (`/dashboard`): shows all submitted assessments, filterable by sport and minimum percentile, sortable by percentile, with a shortlist feature and a per-athlete trend chart (Recharts).
- **"Realtime" sync**: real-time updates are powered by local reactive storage with `BroadcastChannel` fallback + Firebase Firestore integration — open the athlete flow and the dashboard in two tabs to see a new assessment appear live on the dashboard without manual refresh.

## Swapping in real Firebase (post-hackathon)

To connect to a multi-device Firebase backend:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/), enable **Firestore** and **Auth**.
2. Configure `.env` with your Firebase API keys (see `.env.example`).
3. Firestore live snapshot listeners will automatically synchronize assessments across all connected devices.

## What's implemented vs. roadmap

**Implemented:**
- Live webcam pose tracking and automatic push-up rep counting
- Skeleton overlay visualization during tracking
- Percentile benchmarking against age/gender norms
- Real-time scout dashboard with filters, sort, shortlist, and trend charts
- Graceful handling of denied camera permission and "no person detected" states

**Roadmap (not built for this MVP):**
- Anti-cheat / video tamper detection
- Multilingual voice guidance
- Offline/SMS sync fallback for low-connectivity areas
- Additional test types beyond push-ups (vertical jump, sprint timing)
- Federation portal integration (SAI / Khelo India)

## One-paragraph pitch

TalentLens is an AI-powered platform that turns any phone with a camera into a verified sports talent scout. An athlete performs a fitness test on webcam; on-device pose estimation counts reps automatically and instantly benchmarks the result against national age-and-gender percentiles — turning a raw number into a real signal of potential. Verified results appear live on a coach-facing dashboard, closing the loop between an athlete's performance and the scouts who'd never otherwise see it. Built for India's talent discovery gap, where ability is everywhere but scouts are concentrated in a handful of cities.
