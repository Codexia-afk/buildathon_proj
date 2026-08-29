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
    
    public var iconEmoji: String {
        switch self {
        case .athletics: return "🏃"
        case .football: return "⚽"
        case .kabaddi: return "🤾"
        case .wrestling: return "🤼"
        case .boxing: return "🥊"
        case .cricket: return "🏏"
        case .hockey: return "🏑"
        case .badminton: return "🏸"
        case .weightlifting: return "🏋️"
        case .general: return "🏅"
        }
    }
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

public struct SportTrainingDrill: Identifiable, Codable, Equatable {
    public var id: String { exerciseType.rawValue }
    public let exerciseType: ExerciseType
    public let roleRationale: String
    public let biomechanicalFocus: String
    public let gymTargetScore: String
    public let importanceTier: String
    
    public init(
        exerciseType: ExerciseType,
        roleRationale: String,
        biomechanicalFocus: String,
        gymTargetScore: String,
        importanceTier: String
    ) {
        self.exerciseType = exerciseType
        self.roleRationale = roleRationale
        self.biomechanicalFocus = biomechanicalFocus
        self.gymTargetScore = gymTargetScore
        self.importanceTier = importanceTier
    }
}

public struct SportTrainingProfile: Identifiable, Codable, Equatable {
    public var id: String { sport.rawValue }
    public let sport: SportType
    public let tagline: String
    public let primaryQuality: String
    public let recommendedDrills: [SportTrainingDrill]
    public let gymCoachingTip: String
    
    public init(
        sport: SportType,
        tagline: String,
        primaryQuality: String,
        recommendedDrills: [SportTrainingDrill],
        gymCoachingTip: String
    ) {
        self.sport = sport
        self.tagline = tagline
        self.primaryQuality = primaryQuality
        self.recommendedDrills = recommendedDrills
        self.gymCoachingTip = gymCoachingTip
    }
}

public struct SportTrainingDatabase {
    public static let profiles: [SportType: SportTrainingProfile] = [
        .cricket: SportTrainingProfile(
            sport: .cricket,
            tagline: "Fast Bowling Stride Force, Anti-Rotational Core & Batting Drive",
            primaryQuality: "Rotational Trunk Stability & Explosive Ground Reaction",
            recommendedDrills: [
                SportTrainingDrill(
                    exerciseType: .verticalJump,
                    roleRationale: "Explosive run-up plant & jump takeoff velocity for fast bowlers & batting stride extension",
                    biomechanicalFocus: "Hang-time & maximal vertical elastic rebound",
                    gymTargetScore: "Target: >55 cm (Elite Fast Bowler)",
                    importanceTier: "Primary Bowling Power Test"
                ),
                SportTrainingDrill(
                    exerciseType: .plank,
                    roleRationale: "Anti-rotational core stabilization to protect lumbar spine during high-impact delivery stride",
                    biomechanicalFocus: "Neutral spine alignment without hip rotation",
                    gymTargetScore: "Target: >150 sec (Lumbar Protection)",
                    importanceTier: "Core Injury-Shielding Drill"
                ),
                SportTrainingDrill(
                    exerciseType: .squats,
                    roleRationale: "Lower-body power drive for wicket-keeping crouch, running between wickets & batting stance",
                    biomechanicalFocus: "Parallel knee depth with upright chest",
                    gymTargetScore: "Target: >45 reps / min",
                    importanceTier: "Leg Endurance & Wicket Stance"
                ),
                SportTrainingDrill(
                    exerciseType: .pushups,
                    roleRationale: "Pectoral, triceps and shoulder girdle endurance for fast outfield boundary throwing",
                    biomechanicalFocus: "90° elbow flexion with locked core",
                    gymTargetScore: "Target: >40 reps",
                    importanceTier: "Throwing Arm Conditioning"
                )
            ],
            gymCoachingTip: "Fast bowlers experience 8-10x bodyweight on delivery stride. Keep your plank straight to eliminate spine energy leaks."
        ),
        .wrestling: SportTrainingProfile(
            sport: .wrestling,
            tagline: "Mat Hand-Fighting, Takedown Explosiveness & Core Gut-Wrench Defense",
            primaryQuality: "Isometric Core Bracing & Explosive Leg Attack Drive",
            recommendedDrills: [
                SportTrainingDrill(
                    exerciseType: .plank,
                    roleRationale: "Ironclad isometric core bracing to defend against gut-wrench rolls & maintain mat parterre posture",
                    biomechanicalFocus: "Maximal abdominal tension & straight hip line",
                    gymTargetScore: "Target: >180 sec (National Akhada Standard)",
                    importanceTier: "Mat Defense & Bridge Anchor"
                ),
                SportTrainingDrill(
                    exerciseType: .squats,
                    roleRationale: "Deep hip flexion power for low-level single/double-leg attack shots & sprawl recoveries",
                    biomechanicalFocus: "Deep sub-90° knee angle with explosive hip extension",
                    gymTargetScore: "Target: >55 reps",
                    importanceTier: "Takedown Shot Engine"
                ),
                SportTrainingDrill(
                    exerciseType: .pushups,
                    roleRationale: "Upper body explosive pushing power for hand-fighting, collar ties & snapping down opponents",
                    biomechanicalFocus: "Strict arm lockout to simulate underhook breaks",
                    gymTargetScore: "Target: >50 reps",
                    importanceTier: "Hand-Fighting & Chest Power"
                ),
                SportTrainingDrill(
                    exerciseType: .verticalJump,
                    roleRationale: "Instantaneous rate of force development for explosive re-attacks and mat lifting power",
                    biomechanicalFocus: "Maximum takeoff acceleration",
                    gymTargetScore: "Target: >58 cm",
                    importanceTier: "Explosive Lift Power"
                )
            ],
            gymCoachingTip: "Focus on crisp arm lockout during push-ups to simulate breaking opponents' underhooks on the mat."
        ),
        .football: SportTrainingProfile(
            sport: .football,
            tagline: "Sprint Acceleration, Aerial Header Duels & 90-Min Physical Resilience",
            primaryQuality: "Explosive Aerial Hang-Time & Lower-Body Deceleration",
            recommendedDrills: [
                SportTrainingDrill(
                    exerciseType: .verticalJump,
                    roleRationale: "Crucial for aerial header duels, set pieces & explosive first-step sprint acceleration",
                    biomechanicalFocus: "Triple-extension takeoff and hang-time",
                    gymTargetScore: "Target: >60 cm (Wing/Forward Standard)",
                    importanceTier: "Aerial Combat & Sprint Speed"
                ),
                SportTrainingDrill(
                    exerciseType: .squats,
                    roleRationale: "Builds hamstring/quadriceps strength for rapid deceleration, cutting & shot power",
                    biomechanicalFocus: "Controlled eccentric descent with explosive upward drive",
                    gymTargetScore: "Target: >50 reps",
                    importanceTier: "Cutting & Knee Stability"
                ),
                SportTrainingDrill(
                    exerciseType: .plank,
                    roleRationale: "Shielding torso stability during shoulder-to-shoulder physical challenges on the pitch",
                    biomechanicalFocus: "Rock-solid core under fatigue",
                    gymTargetScore: "Target: >140 sec",
                    importanceTier: "Physical Shielding Strength"
                ),
                SportTrainingDrill(
                    exerciseType: .pushups,
                    roleRationale: "Upper body balance and arm pump propulsion during high-speed breakaways",
                    biomechanicalFocus: "90° elbow depth with steady rhythm",
                    gymTargetScore: "Target: >35 reps",
                    importanceTier: "Sprint Arm Pump Drive"
                )
            ],
            gymCoachingTip: "Maximize knee flexion in squats to strengthen knee stabilizing ligaments (ACL/MCL) against sudden turf cuts."
        ),
        .kabaddi: SportTrainingProfile(
            sport: .kabaddi,
            tagline: "Raider Toe-Touch Spring, Corner Ankle Holds & Multi-Defender Resistance",
            primaryQuality: "Explosive Lateral Spring & Kinetic Chain Defense",
            recommendedDrills: [
                SportTrainingDrill(
                    exerciseType: .squats,
                    roleRationale: "Rapid level change for defender tackle dives and raider sudden bonus-line lunges",
                    biomechanicalFocus: "Deep knee bend and instant rebound",
                    gymTargetScore: "Target: >55 reps",
                    importanceTier: "Bonus Line Lunge Engine"
                ),
                SportTrainingDrill(
                    exerciseType: .verticalJump,
                    roleRationale: "Explosive leaping over defender chain tackles (frog jump / lion jump evasions)",
                    biomechanicalFocus: "Max vertical apex height",
                    gymTargetScore: "Target: >62 cm (Pro Kabaddi Raider Standard)",
                    importanceTier: "Chain Evasion Leaping"
                ),
                SportTrainingDrill(
                    exerciseType: .plank,
                    roleRationale: "Maintaining cantilever core tension when resisting multi-defender chain tackle pulls",
                    biomechanicalFocus: "Anti-piking rigid spine alignment",
                    gymTargetScore: "Target: >160 sec",
                    importanceTier: "Midline Drag Resistance"
                ),
                SportTrainingDrill(
                    exerciseType: .pushups,
                    roleRationale: "Upper body hand thrust for hand touches and defender pushing duels",
                    biomechanicalFocus: "Explosive chest push-off",
                    gymTargetScore: "Target: >45 reps",
                    importanceTier: "Raider Hand-Touch Power"
                )
            ],
            gymCoachingTip: "Train full-depth squats to ensure rapid hip rebound when executing sudden escapes back across the midline."
        ),
        .badminton: SportTrainingProfile(
            sport: .badminton,
            tagline: "Jump Smash Apex Power, Court Lunge Recovery & Rotational Stability",
            primaryQuality: "Peak Vertical Hang-Time & Rapid Footwork Recovery",
            recommendedDrills: [
                SportTrainingDrill(
                    exerciseType: .verticalJump,
                    roleRationale: "Dominating the rear-court with steep jump smashes and high contact point apex reach",
                    biomechanicalFocus: "Flight hang-time for kinetic wind-up",
                    gymTargetScore: "Target: >62 cm (Top 5% National Shuttler)",
                    importanceTier: "Rear-Court Jump Smash"
                ),
                SportTrainingDrill(
                    exerciseType: .squats,
                    roleRationale: "Extreme single-leg deceleration in front-court lunges and rapid base recovery",
                    biomechanicalFocus: "Deep hip mobility and ankle dorsiflexion",
                    gymTargetScore: "Target: >48 reps",
                    importanceTier: "Front-Court Lunge Recovery"
                ),
                SportTrainingDrill(
                    exerciseType: .plank,
                    roleRationale: "Core anti-rotation to stabilize torso during high-velocity overhead slice/smash rotations",
                    biomechanicalFocus: "Solid torso bracing without spine twisting",
                    gymTargetScore: "Target: >130 sec",
                    importanceTier: "Overhead Smash Stability"
                ),
                SportTrainingDrill(
                    exerciseType: .pushups,
                    roleRationale: "Shoulder girdle stability to prevent rotator cuff overuse injuries during match play",
                    biomechanicalFocus: "Controlled tempo with full range",
                    gymTargetScore: "Target: >35 reps",
                    importanceTier: "Rotator Cuff Injury Shield"
                )
            ],
            gymCoachingTip: "Aim for maximum hang-time in vertical jumps to give your racket kinetic chain full wind-up time at the apex."
        ),
        .boxing: SportTrainingProfile(
            sport: .boxing,
            tagline: "Kinetic Chain Punch Drive, Torso Shielding & 12-Round Shoulder Stamina",
            primaryQuality: "Upper Body Muscular Endurance & Trunk Shock Absorption",
            recommendedDrills: [
                SportTrainingDrill(
                    exerciseType: .pushups,
                    roleRationale: "High-cadence punch extension speed and shoulder endurance for continuous combinations",
                    biomechanicalFocus: "Rapid cadence (>45 RPM) with full lockout",
                    gymTargetScore: "Target: >55 reps / min",
                    importanceTier: "Combination Punch Speed"
                ),
                SportTrainingDrill(
                    exerciseType: .squats,
                    roleRationale: "Leg drive generating 60%+ of knockout power kinetic chain from canvas to fist",
                    biomechanicalFocus: "Explosive upward leg drive",
                    gymTargetScore: "Target: >50 reps",
                    importanceTier: "Kinetic Punch Power Drive"
                ),
                SportTrainingDrill(
                    exerciseType: .plank,
                    roleRationale: "Absorbing heavy body shots and maintaining tight guard under championship fatigue",
                    biomechanicalFocus: "Tight abdominal brace throughout",
                    gymTargetScore: "Target: >170 sec",
                    importanceTier: "Body Punch Shock Absorber"
                ),
                SportTrainingDrill(
                    exerciseType: .verticalJump,
                    roleRationale: "Spring-loaded footwork for in-and-out slipping, pivots & rapid angle changes",
                    biomechanicalFocus: "Elastic ankle and calf spring",
                    gymTargetScore: "Target: >54 cm",
                    importanceTier: "Ring Footwork Spring"
                )
            ],
            gymCoachingTip: "Maintain high cadence (45+ RPM) in push-ups to build the fast-twitch endurance needed in championship rounds."
        ),
        .athletics: SportTrainingProfile(
            sport: .athletics,
            tagline: "Ground Reaction Force, Triple-Extension & Stride Frequency",
            primaryQuality: "Rate of Force Development & Explosive Elasticity",
            recommendedDrills: [
                SportTrainingDrill(
                    exerciseType: .verticalJump,
                    roleRationale: "Direct indicator of ground reaction force (F = m·a) and sprint takeoff velocity",
                    biomechanicalFocus: "Explosive triple extension (hip-knee-ankle)",
                    gymTargetScore: "Target: >65 cm (Elite Sprinter/Jumper)",
                    importanceTier: "Ground Reaction Velocity"
                ),
                SportTrainingDrill(
                    exerciseType: .squats,
                    roleRationale: "Maximum hip and knee extension power for sprint starting blocks & drive phase",
                    biomechanicalFocus: "Parallel depth with maximal ascent velocity",
                    gymTargetScore: "Target: >55 reps",
                    importanceTier: "Drive Phase Acceleration"
                ),
                SportTrainingDrill(
                    exerciseType: .plank,
                    roleRationale: "Eliminating torso energy leaks during maximum velocity upright sprinting",
                    biomechanicalFocus: "Rigid neutral torso alignment",
                    gymTargetScore: "Target: >160 sec",
                    importanceTier: "Sprint Posture Integrity"
                ),
                SportTrainingDrill(
                    exerciseType: .pushups,
                    roleRationale: "Arm drive momentum and upper-body counter-rotational balance during strides",
                    biomechanicalFocus: "Symmetric arm lockout",
                    gymTargetScore: "Target: >45 reps",
                    importanceTier: "Arm Drive Counterbalance"
                )
            ],
            gymCoachingTip: "Vertical jump hang-time directly correlates with sub-11s 100m sprint stride length and frequency."
        ),
        .weightlifting: SportTrainingProfile(
            sport: .weightlifting,
            tagline: "Olympic Squat Depth, Triple Extension & Rigid Spinal Lockout",
            primaryQuality: "Deep Hip Mobility & Maximum Isometric Core Bracing",
            recommendedDrills: [
                SportTrainingDrill(
                    exerciseType: .squats,
                    roleRationale: "Ass-to-grass (ATG) sub-80° knee flexion mobility for snatch and clean catch positions",
                    biomechanicalFocus: "Full deep knee flexion with vertical spine",
                    gymTargetScore: "Target: >60 reps (Perfect Deep Form)",
                    importanceTier: "Olympic Clean Catch Foundation"
                ),
                SportTrainingDrill(
                    exerciseType: .plank,
                    roleRationale: "Bracing intra-abdominal pressure and neutral spine alignment under heavy overhead loads",
                    biomechanicalFocus: "Zero spinal flexion/extension variance",
                    gymTargetScore: "Target: >200 sec (Spine Shield)",
                    importanceTier: "Intra-Abdominal Pressure Brace"
                ),
                SportTrainingDrill(
                    exerciseType: .verticalJump,
                    roleRationale: "Peak triple-extension (hip-knee-ankle) power during second pull of the snatch/clean",
                    biomechanicalFocus: "Explosive takeoff acceleration",
                    gymTargetScore: "Target: >60 cm",
                    importanceTier: "Second-Pull Power Metric"
                ),
                SportTrainingDrill(
                    exerciseType: .pushups,
                    roleRationale: "Upper body overhead pressing foundation and elbow lockout integrity",
                    biomechanicalFocus: "Complete 180° arm lockout",
                    gymTargetScore: "Target: >45 reps",
                    importanceTier: "Overhead Lockout Integrity"
                )
            ],
            gymCoachingTip: "Descend below parallel on squats with vertical chest alignment to master the Olympic catch."
        ),
        .hockey: SportTrainingProfile(
            sport: .hockey,
            tagline: "Low-Crouch Drag-Flick Power, Acceleration & Lateral Core Force",
            primaryQuality: "Sustained Low-Stance Endurance & Rotational Power",
            recommendedDrills: [
                SportTrainingDrill(
                    exerciseType: .squats,
                    roleRationale: "Maintaining prolonged semi-crouched dribbling and drag-flick posture without fatigue",
                    biomechanicalFocus: "Sustained quad & hip endurance",
                    gymTargetScore: "Target: >50 reps",
                    importanceTier: "Low-Stance Stick Play"
                ),
                SportTrainingDrill(
                    exerciseType: .plank,
                    roleRationale: "Transferring rotational torque from torso into high-speed drag flick shots",
                    biomechanicalFocus: "Spine stabilization during torque",
                    gymTargetScore: "Target: >140 sec",
                    importanceTier: "Drag-Flick Torque Transfer"
                ),
                SportTrainingDrill(
                    exerciseType: .verticalJump,
                    roleRationale: "Explosive counter-attack sprint acceleration from dead stops on turf",
                    biomechanicalFocus: "Quick ground push-off",
                    gymTargetScore: "Target: >56 cm",
                    importanceTier: "Turf Breakaway Acceleration"
                ),
                SportTrainingDrill(
                    exerciseType: .pushups,
                    roleRationale: "Forearm, wrist and tricep control for aerial passing and stick handling",
                    biomechanicalFocus: "Consistent 90° depth",
                    gymTargetScore: "Target: >38 reps",
                    importanceTier: "Stick Control & Push Passing"
                )
            ],
            gymCoachingTip: "Squat endurance prevents lower back fatigue during continuous low-center-of-gravity stick play."
        ),
        .general: SportTrainingProfile(
            sport: .general,
            tagline: "All-Round Olympic Tri-Power, Joint Integrity & Kinetic Balance",
            primaryQuality: "Full-Spectrum Biomechanical Balance",
            recommendedDrills: [
                SportTrainingDrill(
                    exerciseType: .pushups,
                    roleRationale: "Upper body push strength & endurance",
                    biomechanicalFocus: "90° elbow depth, straight spine",
                    gymTargetScore: "Target: >40 reps",
                    importanceTier: "Upper Body Base"
                ),
                SportTrainingDrill(
                    exerciseType: .squats,
                    roleRationale: "Lower body functional mobility & leg power",
                    biomechanicalFocus: "Parallel knee depth (>90°)",
                    gymTargetScore: "Target: >45 reps",
                    importanceTier: "Lower Body Base"
                ),
                SportTrainingDrill(
                    exerciseType: .plank,
                    roleRationale: "Core spine stabilization & endurance",
                    biomechanicalFocus: "Neutral spine alignment",
                    gymTargetScore: "Target: >120 sec",
                    importanceTier: "Core Posture Anchor"
                ),
                SportTrainingDrill(
                    exerciseType: .verticalJump,
                    roleRationale: "Explosive lower body force & hang-time",
                    biomechanicalFocus: "Countermovement takeoff",
                    gymTargetScore: "Target: >50 cm",
                    importanceTier: "Explosive Power Metric"
                )
            ],
            gymCoachingTip: "A balanced athletic foundation is the cornerstone of lifelong injury prevention and elite sports transition."
        )
    ]
    
    public static func profile(for sport: SportType) -> SportTrainingProfile {
        return profiles[sport] ?? profiles[.general]!
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
