//
//  ExerciseStateEngine.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import Foundation
import Combine

public enum FSMWorkoutState: String, Codable {
    case idle = "IDLE"
    case calibrating = "CALIBRATING"
    case ready = "READY"
    case goingDown = "GOING_DOWN"
    case bottomReached = "BOTTOM_REACHED"
    case goingUp = "GOING_UP"
    case holding = "HOLDING"
    case jumping = "JUMPING"
    case paused = "PAUSED"
    case completed = "COMPLETED"
}

public class ExerciseStateEngine: ObservableObject {
    public var exerciseType: ExerciseType
    public var onRepCounted: ((Int) -> Void)?
    public var onDepthReached: (() -> Void)?
    public var onFormWarning: ((String) -> Void)?
    public var onJumpCompleted: ((Float) -> Void)?
    
    @Published public private(set) var state: FSMWorkoutState = .idle
    @Published public private(set) var score: Int = 0
    @Published public private(set) var incompleteCount: Int = 0
    @Published public private(set) var currentPrimaryAngle: Float = 180.0
    @Published public private(set) var currentSecondaryAngle: Float = 180.0
    @Published public private(set) var depthProgressPercent: Int = 0
    @Published public private(set) var formScore: Int = 100
    @Published public private(set) var activeSide: String = "right"
    @Published public private(set) var peakJumpCm: Float = 0
    
    private var startTimeMs: Double = 0
    private var lastWarningTimeMs: Double = 0
    private var primaryAnglesHistory: [Float] = []
    private var secondaryAnglesHistory: [Float] = []
    private var repDurationsSec: [Float] = []
    private var repStartTimeMs: Double = 0
    private var minAngleInCurrentRep: Float = 180.0
    
    // Jump tracking
    private var jumpTakeoffTimeMs: Double = 0
    private var baselineAnkleY: Float? = nil
    
    // Plank tracking
    private var plankTotalFrames: Int = 0
    private var plankGoodFrames: Int = 0
    
    public init(
        exerciseType: ExerciseType = .pushups,
        onRepCounted: ((Int) -> Void)? = nil,
        onDepthReached: (() -> Void)? = nil,
        onFormWarning: ((String) -> Void)? = nil,
        onJumpCompleted: ((Float) -> Void)? = nil
    ) {
        self.exerciseType = exerciseType
        self.onRepCounted = onRepCounted
        self.onDepthReached = onDepthReached
        self.onFormWarning = onFormWarning
        self.onJumpCompleted = onJumpCompleted
    }
    
    public func start() {
        state = .calibrating
        score = 0
        incompleteCount = 0
        formScore = 100
        peakJumpCm = 0
        startTimeMs = Date().timeIntervalSince1970 * 1000
        repStartTimeMs = startTimeMs
        primaryAnglesHistory.removeAll()
        secondaryAnglesHistory.removeAll()
        repDurationsSec.removeAll()
        minAngleInCurrentRep = 180.0
        baselineAnkleY = nil
        plankTotalFrames = 0
        plankGoodFrames = 0
    }
    
    public func pause() {
        state = .paused
    }
    
    public func resume() {
        state = .ready
    }
    
    public func reset() {
        state = .idle
        score = 0
        incompleteCount = 0
        depthProgressPercent = 0
        currentPrimaryAngle = 180.0
        currentSecondaryAngle = 180.0
    }
    
    public func finish(elapsedSeconds: Int) -> BiomechanicsData {
        state = .completed
        let avgPrimary = primaryAnglesHistory.isEmpty ? 85.0 : (primaryAnglesHistory.reduce(0, +) / Float(primaryAnglesHistory.count))
        let avgSecondary = secondaryAnglesHistory.isEmpty ? 174.0 : (secondaryAnglesHistory.reduce(0, +) / Float(secondaryAnglesHistory.count))
        let fastestRep = repDurationsSec.isEmpty ? 1.0 : (repDurationsSec.min() ?? 1.0)
        let finalRpm = elapsedSeconds > 0 ? (Float(score) / (Float(elapsedSeconds) / 60.0)) : 0.0
        let finalForm = max(60, 100 - (incompleteCount * 5))
        
        return BiomechanicsData(
            averageElbowFlexion: exerciseType == .pushups ? avgPrimary : 80.0,
            averageKneeFlexion: exerciseType == .squats ? avgPrimary : 85.0,
            averageTrunkAlignment: avgSecondary,
            formScore: finalForm,
            incompletedReps: incompleteCount,
            cadenceRpm: finalRpm,
            peakSpeedSec: fastestRep,
            jumpHeightCm: peakJumpCm
        )
    }
    
    public func processFrame(landmarks: [Point2D]) {
        if state == .idle || state == .paused || state == .completed {
            return
        }
        guard landmarks.count >= 33 else { return }
        
        let leftShoulder = landmarks[11]
        let leftElbow = landmarks[13]
        let leftWrist = landmarks[15]
        let leftHip = landmarks[23]
        let leftKnee = landmarks[25]
        let leftAnkle = landmarks[27]
        
        let rightShoulder = landmarks[12]
        let rightElbow = landmarks[14]
        let rightWrist = landmarks[16]
        let rightHip = landmarks[24]
        let rightKnee = landmarks[26]
        let rightAnkle = landmarks[28]
        
        let leftVis = leftShoulder.visibility + leftHip.visibility + leftAnkle.visibility
        let rightVis = rightShoulder.visibility + rightHip.visibility + rightAnkle.visibility
        
        activeSide = (rightVis >= leftVis) ? "right" : "left"
        
        let shoulder = (activeSide == "right") ? rightShoulder : leftShoulder
        let elbow = (activeSide == "right") ? rightElbow : leftElbow
        let wrist = (activeSide == "right") ? rightWrist : leftWrist
        let hip = (activeSide == "right") ? rightHip : leftHip
        let knee = (activeSide == "right") ? rightKnee : leftKnee
        let ankle = (activeSide == "right") ? rightAnkle : leftAnkle
        
        let now = Date().timeIntervalSince1970 * 1000
        
        switch exerciseType {
        case .pushups:
            let elbowAngle = GeometryUtils.calculateJointAngle(a: shoulder, b: elbow, c: wrist)
            let plankAngle = GeometryUtils.calculatePlankAlignment(shoulder: shoulder, hip: hip, ankle: ankle)
            
            currentPrimaryAngle = GeometryUtils.smoothAngle(current: elbowAngle, previous: currentPrimaryAngle)
            currentSecondaryAngle = plankAngle
            
            primaryAnglesHistory.append(currentPrimaryAngle)
            secondaryAnglesHistory.append(plankAngle)
            
            let progress = max(0, min(100, Int(((155.0 - currentPrimaryAngle) / (155.0 - 90.0)) * 100.0)))
            depthProgressPercent = progress
            
            if plankAngle < 145.0 || plankAngle > 200.0 {
                if now - lastWarningTimeMs > 2500 {
                    onFormWarning?("Keep your back straight")
                    lastWarningTimeMs = now
                }
            }
            
            switch state {
            case .calibrating:
                if currentPrimaryAngle >= 150.0 {
                    state = .ready
                }
            case .ready:
                if currentPrimaryAngle < 140.0 {
                    state = .goingDown
                    repStartTimeMs = now
                }
            case .goingDown:
                if currentPrimaryAngle <= 90.0 {
                    state = .bottomReached
                    onDepthReached?()
                } else if currentPrimaryAngle > 150.0 {
                    state = .ready
                    incompleteCount += 1
                }
            case .bottomReached:
                if currentPrimaryAngle > 105.0 {
                    state = .goingUp
                }
            case .goingUp:
                if currentPrimaryAngle >= 155.0 {
                    score += 1
                    let durSec = Float((now - repStartTimeMs) / 1000.0)
                    repDurationsSec.append(durSec)
                    onRepCounted?(score)
                    state = .ready
                }
            default:
                break
            }
            
        case .squats:
            let kneeAngle = GeometryUtils.calculateKneeFlexion(hip: hip, knee: knee, ankle: ankle)
            let hipAngle = GeometryUtils.calculateHipFlexion(shoulder: shoulder, hip: hip, knee: knee)
            
            currentPrimaryAngle = GeometryUtils.smoothAngle(current: kneeAngle, previous: currentPrimaryAngle)
            currentSecondaryAngle = hipAngle
            
            primaryAnglesHistory.append(currentPrimaryAngle)
            secondaryAnglesHistory.append(hipAngle)
            
            let progress = max(0, min(100, Int(((160.0 - currentPrimaryAngle) / (160.0 - 90.0)) * 100.0)))
            depthProgressPercent = progress
            
            switch state {
            case .calibrating:
                if currentPrimaryAngle >= 155.0 {
                    state = .ready
                }
            case .ready:
                if currentPrimaryAngle < 145.0 {
                    state = .goingDown
                    repStartTimeMs = now
                }
            case .goingDown:
                if currentPrimaryAngle <= 90.0 {
                    state = .bottomReached
                    onDepthReached?()
                } else if currentPrimaryAngle > 155.0 {
                    state = .ready
                    incompleteCount += 1
                }
            case .bottomReached:
                if currentPrimaryAngle > 105.0 {
                    state = .goingUp
                }
            case .goingUp:
                if currentPrimaryAngle >= 160.0 {
                    score += 1
                    let durSec = Float((now - repStartTimeMs) / 1000.0)
                    repDurationsSec.append(durSec)
                    onRepCounted?(score)
                    state = .ready
                }
            default:
                break
            }
            
        case .plank:
            let plankAngle = GeometryUtils.calculatePlankAlignment(shoulder: shoulder, hip: hip, ankle: ankle)
            currentPrimaryAngle = plankAngle
            primaryAnglesHistory.append(plankAngle)
            
            plankTotalFrames += 1
            let isGood = (plankAngle >= 155.0 && plankAngle <= 185.0)
            if isGood { plankGoodFrames += 1 }
            
            formScore = plankTotalFrames > 0 ? Int((Float(plankGoodFrames) / Float(plankTotalFrames)) * 100.0) : 100
            
            switch state {
            case .calibrating:
                if isGood { state = .holding }
            case .holding:
                if !isGood && (now - lastWarningTimeMs > 2500) {
                    onFormWarning?(plankAngle < 155.0 ? "Hips sagging! Lift core" : "Hips too high")
                    lastWarningTimeMs = now
                }
            default:
                break
            }
            
        case .verticalJump:
            let kneeAngle = GeometryUtils.calculateKneeFlexion(hip: hip, knee: knee, ankle: ankle)
            currentPrimaryAngle = kneeAngle
            
            let ankleY = Float((leftAnkle.y + rightAnkle.y) / 2.0)
            
            switch state {
            case .calibrating:
                baselineAnkleY = ankleY
                state = .ready
            case .ready:
                if kneeAngle < 125.0 {
                    state = .goingDown
                }
            case .goingDown:
                let base = baselineAnkleY ?? ankleY
                if ankleY < base - 0.04 {
                    state = .jumping
                    jumpTakeoffTimeMs = now
                }
            case .jumping:
                let base = baselineAnkleY ?? ankleY
                if ankleY >= base - 0.02 && jumpTakeoffTimeMs > 0 {
                    let flightTime = Float((now - jumpTakeoffTimeMs) / 1000.0)
                    if flightTime >= 0.2 && flightTime <= 1.0 {
                        let height = GeometryUtils.calculateJumpHeightFromFlightTime(flightTimeSec: flightTime)
                        if height > peakJumpCm {
                            peakJumpCm = height
                            score = Int(height.rounded())
                        }
                        onJumpCompleted?(height)
                    }
                    state = .ready
                    jumpTakeoffTimeMs = 0
                }
            default:
                break
            }
        }
    }
}
