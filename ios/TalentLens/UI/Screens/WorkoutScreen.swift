//
//  WorkoutScreen.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI
import Combine

public struct WorkoutScreen: View {
    @Binding public var athlete: AthleteProfile
    public let onProfileChange: (AthleteProfile) -> Void
    public let onFinishWorkout: (AssessmentResult) -> Void
    
    @StateObject private var cameraManager = CameraManager()
    @StateObject private var poseDetector = PoseDetectorHelper()
    @StateObject private var voiceCoach = VoiceCoachService.shared
    
    @State private var selectedExercise: ExerciseType = .pushups
    @State private var landmarks: [Point2D] = []
    @State private var elapsedSeconds: Int = 0
    @State private var isTimerRunning: Bool = false
    @State private var isSimulating: Bool = false
    @State private var showProfileSheet: Bool = false
    
    @StateObject private var engine = ExerciseStateEngine(exerciseType: .pushups)
    @State private var timerSubscription: AnyCancellable?
    
    public init(
        athlete: Binding<AthleteProfile>,
        onProfileChange: @escaping (AthleteProfile) -> Void,
        onFinishWorkout: @escaping (AssessmentResult) -> Void
    ) {
        self._athlete = athlete
        self.onProfileChange = onProfileChange
        self.onFinishWorkout = onFinishWorkout
    }
    
    private func setupEngine() {
        engine.exerciseType = selectedExercise
        engine.onRepCounted = { rep in
            voiceCoach.playRepCountBeep()
            voiceCoach.speak("\(rep)")
        }
        engine.onDepthReached = {
            voiceCoach.playDepthBeep()
        }
        engine.onFormWarning = { warning in
            voiceCoach.playWarningBeep()
            voiceCoach.speak(warning)
        }
        engine.onJumpCompleted = { height in
            voiceCoach.playRepCountBeep()
            voiceCoach.speak("\(Int(height)) centimeters!")
        }
    }
    
    public var body: some View {
        ZStack {
            TLTheme.backgroundDark.edgesIgnoringSafeArea(.all)
            
            VStack(spacing: 12) {
                // Exercise Carousel & Profile Button
                HStack {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(ExerciseType.allCases) { ex in
                                let isSelected = (ex == selectedExercise)
                                Button(action: {
                                    if engine.state == .idle {
                                        selectedExercise = ex
                                        engine.reset()
                                        elapsedSeconds = 0
                                        setupEngine()
                                        if isSimulating {
                                            startSimulationForCurrentExercise()
                                        }
                                    }
                                }) {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(ex.category.uppercased())
                                            .font(.system(size: 9, weight: .bold))
                                            .foregroundColor(isSelected ? TLTheme.brandOrange : TLTheme.textSecondary)
                                        Text(ex.shortName)
                                            .font(.system(size: 13, weight: .bold))
                                            .foregroundColor(TLTheme.textPrimary)
                                    }
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 8)
                                    .background(isSelected ? TLTheme.cardBackground : TLTheme.cardBackground.opacity(0.5))
                                    .cornerRadius(14)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 14)
                                            .stroke(isSelected ? TLTheme.brandOrange : TLTheme.cardBorder, lineWidth: isSelected ? 1.5 : 1)
                                    )
                                }
                            }
                        }
                    }
                    
                    Button(action: { showProfileSheet = true }) {
                        Image(systemName: "person.crop.circle")
                            .foregroundColor(TLTheme.brandOrange)
                            .font(.title2)
                            .frame(width: 44, height: 44)
                            .background(TLTheme.cardBackground)
                            .clipShape(Circle())
                    }
                }
                .padding(.horizontal)
                
                // Live Camera & Pose Canvas Container
                ZStack {
                    RoundedRectangle(cornerRadius: 24)
                        .fill(Color.black)
                        .overlay(RoundedRectangle(cornerRadius: 24).stroke(TLTheme.cardBorder, lineWidth: 2))
                    
                    if cameraManager.isCameraAuthorized && !isSimulating {
                        CameraPreviewView(captureSession: cameraManager.captureSession)
                            .clipShape(RoundedRectangle(cornerRadius: 24))
                    } else if isSimulating {
                        // Simulator placeholder background
                        ZStack {
                            Color.black
                            Text("🤖 AI Vision Simulation Mode Active")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(TLTheme.cyberCyan.opacity(0.7))
                                .offset(y: -90)
                        }
                        .clipShape(RoundedRectangle(cornerRadius: 24))
                    }
                    
                    // Pose Skeleton Overlay
                    PoseSkeletonOverlayView(
                        landmarks: landmarks,
                        exerciseType: selectedExercise,
                        primaryAngle: engine.currentPrimaryAngle,
                        isTargetDepthReached: engine.depthProgressPercent >= 100
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 24))
                    
                    // Top HUD Controls
                    VStack {
                        HStack {
                            // Stopwatch Timer
                            HStack(spacing: 6) {
                                Circle()
                                    .fill(isTimerRunning ? Color.red : TLTheme.textSecondary)
                                    .frame(width: 8, height: 8)
                                
                                let mins = elapsedSeconds / 60
                                let secs = elapsedSeconds % 60
                                Text(String(format: "%02d:%02d", mins, secs))
                                    .font(.system(size: 14, weight: .bold, design: .monospaced))
                                    .foregroundColor(TLTheme.textPrimary)
                            }
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(TLTheme.backgroundDark.opacity(0.85))
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(TLTheme.cardBorder, lineWidth: 1))
                            
                            Spacer()
                            
                            // Action controls (Simulate AI, Flip camera, Mute voice coach)
                            HStack(spacing: 8) {
                                Button(action: toggleSimulation) {
                                    Image(systemName: isSimulating ? "cpu.fill" : "cpu")
                                        .foregroundColor(isSimulating ? TLTheme.cyberCyan : TLTheme.textPrimary)
                                        .frame(width: 36, height: 36)
                                        .background(isSimulating ? TLTheme.cyberCyan.opacity(0.3) : TLTheme.backgroundDark.opacity(0.8))
                                        .clipShape(Circle())
                                }
                                
                                Button(action: { cameraManager.flipCamera() }) {
                                    Image(systemName: "camera.rotate.fill")
                                        .foregroundColor(TLTheme.textPrimary)
                                        .frame(width: 36, height: 36)
                                        .background(TLTheme.backgroundDark.opacity(0.8))
                                        .clipShape(Circle())
                                }
                                
                                Button(action: { voiceCoach.isMuted.toggle() }) {
                                    Image(systemName: voiceCoach.isMuted ? "speaker.slash.fill" : "speaker.wave.2.fill")
                                        .foregroundColor(TLTheme.textPrimary)
                                        .frame(width: 36, height: 36)
                                        .background(TLTheme.backgroundDark.opacity(0.8))
                                        .clipShape(Circle())
                                }
                            }
                        }
                        .padding(12)
                        
                        Spacer()
                        
                        // Bottom Big Score Badge
                        HStack(alignment: .bottom, spacing: 6) {
                            Text("\(engine.score)")
                                .font(.system(size: 48, weight: .black))
                                .foregroundColor(TLTheme.textPrimary)
                            Text(selectedExercise.metricUnit.uppercased())
                                .font(.system(size: 14, weight: .bold, design: .monospaced))
                                .foregroundColor(TLTheme.brandOrange)
                                .offset(y: -8)
                        }
                        .padding(.horizontal, 24)
                        .padding(.vertical, 8)
                        .background(TLTheme.backgroundDark.opacity(0.9))
                        .cornerRadius(20)
                        .overlay(RoundedRectangle(cornerRadius: 20).stroke(TLTheme.cardBorder, lineWidth: 1))
                        .padding(.bottom, 16)
                    }
                }
                .padding(.horizontal)
                
                // Bottom Action Buttons
                HStack(spacing: 10) {
                    if engine.state == .idle {
                        Button(action: {
                            engine.start()
                            isTimerRunning = true
                            startTimer()
                            voiceCoach.speak("Assume position to begin \(selectedExercise.shortName)")
                        }) {
                            HStack {
                                Image(systemName: "play.fill")
                                Text("Start \(selectedExercise.shortName) Test")
                                    .font(.system(size: 15, weight: .bold))
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 54)
                            .background(TLTheme.brandOrange)
                            .foregroundColor(.white)
                            .cornerRadius(16)
                        }
                    } else {
                        Button(action: {
                            if engine.state == .paused {
                                engine.resume()
                                isTimerRunning = true
                            } else {
                                engine.pause()
                                isTimerRunning = false
                            }
                        }) {
                            Text(engine.state == .paused ? "Resume" : "Pause")
                                .font(.system(size: 15, weight: .bold))
                                .frame(maxWidth: .infinity)
                                .frame(height: 54)
                                .background(TLTheme.cardBackground)
                                .foregroundColor(TLTheme.textPrimary)
                                .cornerRadius(16)
                        }
                        
                        Button(action: finishWorkoutAction) {
                            HStack {
                                Image(systemName: "checkmark")
                                Text("Finish & Verify")
                                    .font(.system(size: 15, weight: .bold))
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 54)
                            .background(TLTheme.brandOrange)
                            .foregroundColor(.white)
                            .cornerRadius(16)
                        }
                    }
                }
                .padding(.horizontal)
                .padding(.bottom, 12)
            }
        }
        .onAppear {
            setupEngine()
            cameraManager.onLandmarksDetected = { detected in
                if !isSimulating {
                    self.landmarks = detected
                    self.engine.processFrame(landmarks: detected)
                }
            }
        }
        .onDisappear {
            stopTimer()
            poseDetector.stopSimulation()
        }
        .sheet(isPresented: $showProfileSheet) {
            ProfileSetupModalView(
                currentProfile: $athlete,
                onDismiss: { showProfileSheet = false },
                onSave: { updated in
                    athlete = updated
                    onProfileChange(updated)
                    showProfileSheet = false
                }
            )
        }
    }
    
    private func toggleSimulation() {
        isSimulating.toggle()
        if isSimulating {
            startSimulationForCurrentExercise()
        } else {
            poseDetector.stopSimulation()
        }
    }
    
    private func startSimulationForCurrentExercise() {
        poseDetector.startSimulation(for: selectedExercise) { fakeLandmarks in
            self.landmarks = fakeLandmarks
            self.engine.processFrame(landmarks: fakeLandmarks)
        }
    }
    
    private func startTimer() {
        timerSubscription = Timer.publish(every: 1.0, on: .main, in: .common)
            .autoconnect()
            .sink { _ in
                if isTimerRunning {
                    elapsedSeconds += 1
                }
            }
    }
    
    private func stopTimer() {
        timerSubscription?.cancel()
        timerSubscription = nil
    }
    
    private func finishWorkoutAction() {
        isTimerRunning = false
        stopTimer()
        poseDetector.stopSimulation()
        
        let biomechanics = engine.finish(elapsedSeconds: elapsedSeconds)
        let calc = PercentileEngine.calculate(
            score: engine.score,
            age: athlete.age,
            gender: athlete.gender,
            exerciseType: selectedExercise
        )
        let hash = "TL-\(calc.percentileRounded)-\(athlete.state.prefix(3).uppercased())-\(Int.random(in: 1000...9999))"
        
        let result = AssessmentResult(
            athleteId: athlete.id,
            athleteName: athlete.fullName,
            age: athlete.age,
            gender: athlete.gender,
            state: athlete.state,
            district: athlete.district,
            sport: athlete.primarySport,
            exerciseType: selectedExercise,
            score: engine.score,
            durationSeconds: max(1, elapsedSeconds),
            percentile: calc.percentile,
            talentTier: calc.talentTier,
            biomechanics: biomechanics,
            verificationHash: hash
        )
        
        AthleteRepository.shared.saveAssessment(result)
        voiceCoach.speak("Assessment verified! \(calc.talentTier.displayName)", priority: true)
        onFinishWorkout(result)
    }
}
