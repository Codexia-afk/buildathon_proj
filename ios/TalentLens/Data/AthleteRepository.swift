//
//  AthleteRepository.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import Foundation
import Combine

public class AthleteRepository: ObservableObject {
    public static let shared = AthleteRepository()
    
    @Published public var currentProfile: AthleteProfile = AthleteProfile(
        id: "ath_default",
        fullName: "Aarav Sharma",
        age: 17,
        gender: .male,
        primarySport: .wrestling,
        state: "Haryana",
        district: "Sonipat",
        schoolOrAcademy: "Sonipat Sports Excellence Akhada",
        phone: "+91 98765 00000"
    )
    
    @Published public var assessments: [AssessmentResult] = [
        AssessmentResult(
            id: "ass_101",
            athleteId: "ath_101",
            athleteName: "Vikas Kumar Phogat",
            age: 17,
            gender: .male,
            state: "Haryana",
            district: "Bhiwani",
            sport: .wrestling,
            exerciseType: .pushups,
            score: 62,
            durationSeconds: 60,
            percentile: 98.2,
            talentTier: .nationalElite,
            biomechanics: BiomechanicsData(
                averageElbowFlexion: 74,
                averageTrunkAlignment: 175,
                formScore: 96,
                incompletedReps: 1,
                cadenceRpm: 54,
                peakSpeedSec: 0.9
            ),
            verificationHash: "TL-98-HAR-V1K4S",
            scoutNotes: ["Exceptional core stability and explosive lockout speed. Recommended for national camp."],
            isShortlisted: true
        ),
        AssessmentResult(
            id: "ass_102",
            athleteId: "ath_102",
            athleteName: "Ananya S. Nair",
            age: 16,
            gender: .female,
            state: "Kerala",
            district: "Kottayam",
            sport: .athletics,
            exerciseType: .verticalJump,
            score: 62,
            durationSeconds: 30,
            percentile: 96.8,
            talentTier: .nationalElite,
            biomechanics: BiomechanicsData(
                averageTrunkAlignment: 178,
                formScore: 98,
                jumpHeightCm: 62,
                flightTimeSec: 0.71
            ),
            verificationHash: "TL-96-KER-AN4NY",
            scoutNotes: ["Phenomenal explosive ground reaction force."],
            isShortlisted: true
        ),
        AssessmentResult(
            id: "ass_103",
            athleteId: "ath_103",
            athleteName: "Gurpreet Singh",
            age: 19,
            gender: .male,
            state: "Punjab",
            district: "Patiala",
            sport: .weightlifting,
            exerciseType: .squats,
            score: 82,
            durationSeconds: 60,
            percentile: 92.5,
            talentTier: .stateContender,
            biomechanics: BiomechanicsData(
                averageKneeFlexion: 78,
                averageTrunkAlignment: 168,
                formScore: 92,
                cadenceRpm: 82
            ),
            verificationHash: "TL-92-PUN-GURP7",
            isShortlisted: false
        ),
        AssessmentResult(
            id: "ass_104",
            athleteId: "ath_104",
            athleteName: "Mary Lalremruati",
            age: 15,
            gender: .female,
            state: "Manipur",
            district: "Imphal East",
            sport: .boxing,
            exerciseType: .plank,
            score: 185,
            durationSeconds: 185,
            percentile: 94.0,
            talentTier: .stateContender,
            biomechanics: BiomechanicsData(
                averageTrunkAlignment: 176,
                formScore: 95
            ),
            verificationHash: "TL-94-MAN-MARY9",
            scoutNotes: ["Ironclad isometric abdominal bracing."],
            isShortlisted: true
        ),
        AssessmentResult(
            id: "ass_105",
            athleteId: "ath_105",
            athleteName: "Rohit Ramesh Pawar",
            age: 18,
            gender: .male,
            state: "Maharashtra",
            district: "Kolhapur",
            sport: .kabaddi,
            exerciseType: .pushups,
            score: 52,
            durationSeconds: 60,
            percentile: 88.0,
            talentTier: .stateContender,
            biomechanics: BiomechanicsData(
                averageElbowFlexion: 82,
                averageTrunkAlignment: 170,
                formScore: 90
            ),
            verificationHash: "TL-88-MAH-ROH1T",
            isShortlisted: false
        )
    ]
    
    public init() {}
    
    public func updateProfile(_ profile: AthleteProfile) {
        self.currentProfile = profile
    }
    
    public func saveAssessment(_ result: AssessmentResult) {
        assessments.insert(result, at: 0)
    }
    
    public func toggleShortlist(id: String) {
        if let idx = assessments.firstIndex(where: { $0.id == id }) {
            assessments[idx].isShortlisted.toggle()
        }
    }
    
    public func addScoutNote(id: String, note: String) {
        if let idx = assessments.firstIndex(where: { $0.id == id }) {
            assessments[idx].scoutNotes.append(note)
        }
    }
    
    public func getAthleteHistory(athleteId: String) -> [AssessmentResult] {
        return assessments.filter { $0.athleteId == athleteId }
    }
    
    @discardableResult
    public func simulateIncomingLiveAssessment() -> AssessmentResult {
        let names = ["Devendra Murmu", "Simranjeet Kaur", "Neeraj Yadav", "Ananya Deshmukh", "Sahil Rathore"]
        let states = ["Jharkhand", "Punjab", "Haryana", "Maharashtra", "Rajasthan"]
        let sports: [SportType] = [.football, .athletics, .wrestling, .boxing, .kabaddi]
        let tests: [ExerciseType] = [.pushups, .squats, .plank, .verticalJump]
        
        let idx = Int.random(in: 0..<names.count)
        let chosenTest = tests.randomElement() ?? .pushups
        let chosenState = states[idx]
        
        let score: Int
        switch chosenTest {
        case .pushups: score = Int.random(in: 40...65)
        case .squats: score = Int.random(in: 55...90)
        case .plank: score = Int.random(in: 120...240)
        case .verticalJump: score = Int.random(in: 50...75)
        }
        
        let result = AssessmentResult(
            id: "ass_live_\(Int(Date().timeIntervalSince1970 * 1000))",
            athleteId: "ath_live_\(Int(Date().timeIntervalSince1970 * 1000))",
            athleteName: names[idx],
            age: Int.random(in: 15...20),
            gender: (idx % 2 == 0) ? .male : .female,
            state: chosenState,
            district: "Excellence Hub",
            sport: sports[idx],
            exerciseType: chosenTest,
            score: score,
            durationSeconds: 60,
            percentile: Float(Double.random(in: 92.0...99.5)),
            talentTier: .nationalElite,
            biomechanics: BiomechanicsData(formScore: 98),
            verificationHash: "TL-98-\(chosenState.prefix(3).uppercased())-\(Int.random(in: 1000...9999))",
            isShortlisted: false
        )
        
        saveAssessment(result)
        return result
    }
    
    public func exportToCsvString() -> String {
        var csv = "Athlete Name,Age,Gender,Sport,State,District,Exercise,Score,Percentile,Tier,Form Score,Hash,Date\n"
        for a in assessments {
            let row = "\"\(a.athleteName)\",\(a.age),\(a.gender.displayName),\"\(a.sport.displayName)\",\"\(a.state)\",\"\(a.district)\",\"\(a.exerciseType.title)\",\(a.score),\(a.percentile),\"\(a.talentTier.displayName)\",\(a.biomechanics.formScore),\"\(a.verificationHash)\",\(a.verifiedAt)\n"
            csv.append(row)
        }
        return csv
    }
}
