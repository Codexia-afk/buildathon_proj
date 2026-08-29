//
//  DataModels.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import Foundation
import SwiftUI

public enum Gender: String, CaseIterable, Identifiable, Codable {
    case male = "Male"
    case female = "Female"
    case other = "Other"
    
    public var id: String { rawValue }
    public var displayName: String { rawValue }
}

public enum SportType: String, CaseIterable, Identifiable, Codable {
    case athletics = "Athletics (Sprint/Jump)"
    case football = "Football"
    case kabaddi = "Kabaddi"
    case wrestling = "Wrestling"
    case boxing = "Boxing"
    case cricket = "Cricket"
    case hockey = "Hockey"
    case badminton = "Badminton"
    case weightlifting = "Weightlifting"
    case general = "Multi-Sport / General"
    
    public var id: String { rawValue }
    public var displayName: String { rawValue }
}

public enum ExerciseType: String, CaseIterable, Identifiable, Codable {
    case pushups = "pushups_standard"
    case squats = "squats_standard"
    case plank = "plank_hold"
    case verticalJump = "vertical_jump"
    
    public var id: String { rawValue }
    
    public var title: String {
        switch self {
        case .pushups: return "Standard Push-Ups"
        case .squats: return "Deep Bodyweight Squats"
        case .plank: return "Isometric Plank Hold"
        case .verticalJump: return "Vertical Jump Power"
        }
    }
    
    public var shortName: String {
        switch self {
        case .pushups: return "Push-Ups"
        case .squats: return "Squats"
        case .plank: return "Plank"
        case .verticalJump: return "Vert Jump"
        }
    }
    
    public var category: String {
        switch self {
        case .pushups: return "Upper Body"
        case .squats: return "Lower Body"
        case .plank: return "Core"
        case .verticalJump: return "Power"
        }
    }
    
    public var metricUnit: String {
        switch self {
        case .pushups, .squats: return "reps"
        case .plank: return "sec"
        case .verticalJump: return "cm"
        }
    }
    
    public var instructions: [String] {
        switch self {
        case .pushups:
            return [
                "Position camera sideways with full body in view.",
                "Maintain straight plank alignment (155°-185°).",
                "Lower chest until elbows flex to 90° depth.",
                "Push up to full arm lockout (>155°) to count rep."
            ]
        case .squats:
            return [
                "Stand facing 45° to the camera.",
                "Feet shoulder-width apart.",
                "Descend until hip crease is below knee level (knee <= 90°).",
                "Stand upright with hips fully extended (>160°)."
            ]
        case .plank:
            return [
                "Assume forearm plank position in profile.",
                "Keep shoulders, hips, and ankles in a straight line.",
                "Avoid sagging hips (<145°) or piking (>200°).",
                "Hold posture as long as possible until failure."
            ]
        case .verticalJump:
            return [
                "Stand 6-8 feet away in clear view.",
                "Perform countermovement squat dip.",
                "Explode straight up with maximum vertical power.",
                "AI calculates flight hang time to compute height."
            ]
        }
    }
}

public enum TalentTier: String, CaseIterable, Identifiable, Codable {
    case nationalElite = "National Elite Prospect (Top 5%)"
    case stateContender = "State Level Contender (Top 15%)"
    case districtPerformer = "District High Performer (Top 30%)"
    case activeClub = "Active Club Athlete (Top 50%)"
    case developing = "Developing Talent (Base Tier)"
    
    public var id: String { rawValue }
    public var displayName: String { rawValue }
    
    public var badgeColorHex: UInt {
        switch self {
        case .nationalElite: return 0xF59E0B
        case .stateContender: return 0xFFFF4D00
        case .districtPerformer: return 0x00F0FF
        case .activeClub: return 0x10B981
        case .developing: return 0x94A3B8
        }
    }
}

public struct Point2D: Codable, Equatable {
    public var x: CGFloat
    public var y: CGFloat
    public var visibility: CGFloat
    
    public init(x: CGFloat, y: CGFloat, visibility: CGFloat = 1.0) {
        self.x = x
        self.y = y
        self.visibility = visibility
    }
}

public struct AthleteProfile: Identifiable, Codable, Equatable {
    public var id: String
    public var fullName: String
    public var age: Int
    public var gender: Gender
    public var primarySport: SportType
    public var state: String
    public var district: String
    public var schoolOrAcademy: String
    public var phone: String
    
    public init(
        id: String = "ath_\(Int(Date().timeIntervalSince1970 * 1000))",
        fullName: String = "Aarav Sharma",
        age: Int = 17,
        gender: Gender = .male,
        primarySport: SportType = .wrestling,
        state: String = "Haryana",
        district: String = "Sonipat",
        schoolOrAcademy: String = "Sonipat Sports Excellence Akhada",
        phone: String = "+91 98765 00000"
    ) {
        self.id = id
        self.fullName = fullName
        self.age = age
        self.gender = gender
        self.primarySport = primarySport
        self.state = state
        self.district = district
        self.schoolOrAcademy = schoolOrAcademy
        self.phone = phone
    }
}

public struct BiomechanicsData: Codable, Equatable {
    public var averageElbowFlexion: Float
    public var averageKneeFlexion: Float
    public var averageTrunkAlignment: Float
    public var formScore: Int
    public var incompletedReps: Int
    public var cadenceRpm: Float
    public var peakSpeedSec: Float
    public var jumpHeightCm: Float
    public var flightTimeSec: Float
    
    public init(
        averageElbowFlexion: Float = 80,
        averageKneeFlexion: Float = 85,
        averageTrunkAlignment: Float = 174,
        formScore: Int = 95,
        incompletedReps: Int = 0,
        cadenceRpm: Float = 42,
        peakSpeedSec: Float = 1.0,
        jumpHeightCm: Float = 0,
        flightTimeSec: Float = 0
    ) {
        self.averageElbowFlexion = averageElbowFlexion
        self.averageKneeFlexion = averageKneeFlexion
        self.averageTrunkAlignment = averageTrunkAlignment
        self.formScore = formScore
        self.incompletedReps = incompletedReps
        self.cadenceRpm = cadenceRpm
        self.peakSpeedSec = peakSpeedSec
        self.jumpHeightCm = jumpHeightCm
        self.flightTimeSec = flightTimeSec
    }
}

public struct AssessmentResult: Identifiable, Codable, Equatable {
    public var id: String
    public var athleteId: String
    public var athleteName: String
    public var age: Int
    public var gender: Gender
    public var state: String
    public var district: String
    public var sport: SportType
    public var exerciseType: ExerciseType
    public var score: Int
    public var durationSeconds: Int
    public var percentile: Float
    public var talentTier: TalentTier
    public var biomechanics: BiomechanicsData
    public var verificationHash: String
    public var verifiedAt: Date
    public var scoutNotes: [String]
    public var isShortlisted: Bool
    
    public init(
        id: String = "ass_\(Int(Date().timeIntervalSince1970 * 1000))",
        athleteId: String,
        athleteName: String,
        age: Int,
        gender: Gender,
        state: String,
        district: String,
        sport: SportType,
        exerciseType: ExerciseType,
        score: Int,
        durationSeconds: Int,
        percentile: Float,
        talentTier: TalentTier,
        biomechanics: BiomechanicsData,
        verificationHash: String,
        verifiedAt: Date = Date(),
        scoutNotes: [String] = [],
        isShortlisted: Bool = false
    ) {
        self.id = id
        self.athleteId = athleteId
        self.athleteName = athleteName
        self.age = age
        self.gender = gender
        self.state = state
        self.district = district
        self.sport = sport
        self.exerciseType = exerciseType
        self.score = score
        self.durationSeconds = durationSeconds
        self.percentile = percentile
        self.talentTier = talentTier
        self.biomechanics = biomechanics
        self.verificationHash = verificationHash
        self.verifiedAt = verifiedAt
        self.scoutNotes = scoutNotes
        self.isShortlisted = isShortlisted
    }
}
