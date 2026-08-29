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
    
    @State private var selectedSport: SportType = .cricket
    @State private var isSportBatteryMode: Bool = true
    @State private var selectedExercise: ExerciseType = .verticalJump
    @State private var landmarks: [Point2D] = []
    @State private var elapsedSeconds: Int = 0
    @State private var isTimerRunning: Bool = false
    @State private var isSimulating: Bool = false
    @State private var showProfileSheet: Bool = false
    @State private var showSportBatterySheet: Bool = false
    
    @StateObject private var engine = ExerciseStateEngine(exerciseType: .verticalJump)
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
    
    private var currentSportProfile: SportTrainingProfile {
        SportTrainingDatabase.profile(for: selectedSport)
    }
    
    private var currentDrillInfo: SportTrainingDrill? {
        currentSportProfile.recommendedDrills.first(where: { $0.exerciseType == selectedExercise })
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
            
            VStack(spacing: 8) {
                // 1. Sport Selector Header & Profile Button
                HStack(spacing: 8) {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 6) {
                            ForEach(SportType.allCases) { sp in
                                let isSelected = (sp == selectedSport)
                                Button(action: {
                                    if engine.state == .idle {
                                        selectedSport = sp
                                        let prof = SportTrainingDatabase.profile(for: sp)
                                        if let firstDrill = prof.recommendedDrills.first {
                                            selectExercise(firstDrill.exerciseType)
                                        }
                                    }
                                }) {
                                    HStack(spacing: 5) {
                                        Text(sp.iconEmoji)
                                        Text(sp.displayName.components(separatedBy: " (").first ?? sp.displayName)
                                            .font(.system(size: 11, weight: .bold))
                                    }
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 6)
                                    .background(isSelected ? TLTheme.brandOrange : TLTheme.cardBackground)
                                    .foregroundColor(isSelected ? .white : TLTheme.textSecondary)
                                    .cornerRadius(12)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 12)
                                            .stroke(isSelected ? TLTheme.brandOrange : TLTheme.cardBorder, lineWidth: 1)
                                    )
                                }
                            }
                        }
                    }
                    
                    Button(action: { showProfileSheet = true }) {
                        Image(systemName: "person.crop.circle")
                            .foregroundColor(TLTheme.brandOrange)
                            .font(.title3)
                            .frame(width: 38, height: 38)
                            .background(TLTheme.cardBackground)
                            .clipShape(Circle())
                    }
                }
                .padding(.horizontal)
                .padding(.top, 4)
                
                // 2. Sport-Specific Gym Drill Selector Bar
                HStack(spacing: 6) {
                    ForEach(currentSportProfile.recommendedDrills) { drill in
                        let isSelected = (drill.exerciseType == selectedExercise)
                        Button(action: {
                            if engine.state == .idle {
                                selectExercise(drill.exerciseType)
                            }
                        }) {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(drill.exerciseType.shortName)
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(isSelected ? TLTheme.brandOrange : TLTheme.textPrimary)
                                Text(drill.importanceTier.components(separatedBy: " ").first ?? "")
                                    .font(.system(size: 8, weight: .semibold))
                                    .foregroundColor(TLTheme.textSecondary)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 6)
                            .background(isSelected ? TLTheme.cardBackground : TLTheme.cardBackground.opacity(0.4))
                            .cornerRadius(10)
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(isSelected ? TLTheme.brandOrange : TLTheme.cardBorder, lineWidth: isSelected ? 1.5 : 1)
                            )
                        }
                    }
                }
                .padding(.horizontal)
                
                // 3. Sport Rationale & Target Callout
                if let drill = currentDrillInfo {
                    HStack(spacing: 8) {
                        Image(systemName: "target")
                            .foregroundColor(TLTheme.cyberCyan)
                            .font(.system(size: 12))
                        
                        VStack(alignment: .leading, spacing: 1) {
                            Text("\(selectedSport.iconEmoji) \(selectedSport.displayName): \(drill.roleRationale)")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(TLTheme.textPrimary)
                                .lineLimit(1)
                            
                            HStack(spacing: 6) {
                                Text(drill.gymTargetScore)
                                    .font(.system(size: 9, weight: .black, design: .monospaced))
                                    .foregroundColor(TLTheme.brandOrange)
                                Text("• Focus: \(drill.biomechanicalFocus)")
                                    .font(.system(size: 9))
                                    .foregroundColor(TLTheme.textSecondary)
                                    .lineLimit(1)
                            }
                        }
                        Spacer()
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(TLTheme.cyberCyan.opacity(0.1))
                    .cornerRadius(10)
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(TLTheme.cyberCyan.opacity(0.3), lineWidth: 1))
                    .padding(.horizontal)
                }
                
                // 4. Live Camera & Pose Canvas Container
                ZStack {
                    RoundedRectangle(cornerRadius: 20)
                        .fill(Color.black)
                        .overlay(RoundedRectangle(cornerRadius: 20).stroke(TLTheme.cardBorder, lineWidth: 1.5))
                    
                    if cameraManager.isCameraAuthorized && !isSimulating {
                        CameraPreviewView(captureSession: cameraManager.captureSession)
                            .clipShape(RoundedRectangle(cornerRadius: 20))
                    } else if isSimulating {
                        ZStack {
                            Color.black
                            VStack(spacing: 4) {
                                Text("🤖 AI Vision Simulation Mode Active")
                                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                                    .foregroundColor(TLTheme.cyberCyan.opacity(0.7))
                                Text("Sport Battery: \(selectedSport.displayName)")
                                    .font(.system(size: 10))
                                    .foregroundColor(TLTheme.textSecondary)
                            }
                            .offset(y: -90)
                        }
                        .clipShape(RoundedRectangle(cornerRadius: 20))
                    }
                    
                    // Pose Skeleton Overlay
                    PoseSkeletonOverlayView(
                        landmarks: landmarks,
                        exerciseType: selectedExercise,
                        primaryAngle: engine.currentPrimaryAngle,
                        isTargetDepthReached: engine.depthProgressPercent >= 100
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    
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
                                    .font(.system(size: 13, weight: .bold, design: .monospaced))
                                    .foregroundColor(TLTheme.textPrimary)
                            }
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(TLTheme.backgroundDark.opacity(0.85))
                            .cornerRadius(10)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(TLTheme.cardBorder, lineWidth: 1))
                            
                            Spacer()
                            
                            // Action controls (Simulate AI, Flip camera, Mute voice coach)
                            HStack(spacing: 6) {
                                Button(action: toggleSimulation) {
                                    Image(systemName: isSimulating ? "cpu.fill" : "cpu")
                                        .foregroundColor(isSimulating ? TLTheme.cyberCyan : TLTheme.textPrimary)
                                        .frame(width: 32, height: 32)
                                        .background(isSimulating ? TLTheme.cyberCyan.opacity(0.3) : TLTheme.backgroundDark.opacity(0.8))
                                        .clipShape(Circle())
                                }
                                
                                Button(action: { cameraManager.flipCamera() }) {
                                    Image(systemName: "camera.rotate.fill")
                                        .foregroundColor(TLTheme.textPrimary)
                                        .frame(width: 32, height: 32)
                                        .background(TLTheme.backgroundDark.opacity(0.8))
                                        .clipShape(Circle())
                                }
                                
                                Button(action: { voiceCoach.isMuted.toggle() }) {
                                    Image(systemName: voiceCoach.isMuted ? "speaker.slash.fill" : "speaker.wave.2.fill")
                                        .foregroundColor(TLTheme.textPrimary)
                                        .frame(width: 32, height: 32)
                                        .background(TLTheme.backgroundDark.opacity(0.8))
                                        .clipShape(Circle())
                                }
                            }
                        }
                        .padding(10)
                        
                        Spacer()
                        
                        // Bottom Big Score Badge
                        HStack(alignment: .bottom, spacing: 6) {
                            Text("\(engine.score)")
                                .font(.system(size: 42, weight: .black))
                                .foregroundColor(TLTheme.textPrimary)
                            Text(selectedExercise.metricUnit.uppercased())
                                .font(.system(size: 13, weight: .bold, design: .monospaced))
                                .foregroundColor(TLTheme.brandOrange)
                                .offset(y: -6)
                        }
                        .padding(.horizontal, 20)
                        .padding(.vertical, 6)
                        .background(TLTheme.backgroundDark.opacity(0.9))
                        .cornerRadius(16)
                        .overlay(RoundedRectangle(cornerRadius: 16).stroke(TLTheme.cardBorder, lineWidth: 1))
                        .padding(.bottom, 12)
                    }
                }
                .padding(.horizontal)
                
                // 5. Bottom Action Buttons
                HStack(spacing: 10) {
                    if engine.state == .idle {
                        Button(action: {
                            engine.start()
                            isTimerRunning = true
                            startTimer()
                            voiceCoach.speak("Starting \(selectedSport.displayName) drill: \(selectedExercise.shortName)")
                        }) {
                            HStack(spacing: 8) {
                                Image(systemName: "play.fill")
                                Text("Start \(selectedSport.iconEmoji) \(selectedExercise.shortName) Drill")
                                    .font(.system(size: 14, weight: .bold))
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(TLTheme.brandOrange)
                            .foregroundColor(.white)
                            .cornerRadius(14)
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
                                .font(.system(size: 14, weight: .bold))
                                .frame(maxWidth: .infinity)
                                .frame(height: 50)
                                .background(TLTheme.cardBackground)
                                .foregroundColor(TLTheme.textPrimary)
                                .cornerRadius(14)
                        }
                        
                        Button(action: finishWorkoutAction) {
                            HStack {
                                Image(systemName: "checkmark")
                                Text("Finish & Verify")
                                    .font(.system(size: 14, weight: .bold))
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(TLTheme.brandOrange)
                            .foregroundColor(.white)
                            .cornerRadius(14)
                        }
                    }
                }
                .padding(.horizontal)
                .padding(.bottom, 8)
            }
        }
        .onAppear {
            self.selectedSport = athlete.primarySport
            if let first = SportTrainingDatabase.profile(for: athlete.primarySport).recommendedDrills.first {
                self.selectedExercise = first.exerciseType
            }
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
                    selectedSport = updated.primarySport
                    onProfileChange(updated)
                    showProfileSheet = false
                }
            )
        }
    }
    
    private func selectExercise(_ ex: ExerciseType) {
        selectedExercise = ex
        engine.reset()
        elapsedSeconds = 0
        setupEngine()
        if isSimulating {
            startSimulationForCurrentExercise()
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
            sport: selectedSport,
            exerciseType: selectedExercise,
            score: engine.score,
            durationSeconds: max(1, elapsedSeconds),
            percentile: calc.percentile,
            talentTier: calc.talentTier,
            biomechanics: biomechanics,
            verificationHash: hash
        )
        
        AthleteRepository.shared.saveAssessment(result)
        voiceCoach.speak("Assessment verified! \(selectedSport.displayName) rating: \(calc.talentTier.displayName)", priority: true)
        onFinishWorkout(result)
    }
}
