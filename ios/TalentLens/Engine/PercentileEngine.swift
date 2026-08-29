//
//  PercentileEngine.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import Foundation

public struct AgeBracketNorms {
    public let minAge: Int
    public let maxAge: Int
    public let label: String
    public let maleP10: Int
    public let maleP25: Int
    public let maleP50: Int
    public let maleP75: Int
    public let maleP90: Int
    public let maleP95: Int
    public let maleP99: Int
    public let maleRecord: Int
    public let femaleP10: Int
    public let femaleP25: Int
    public let femaleP50: Int
    public let femaleP75: Int
    public let femaleP90: Int
    public let femaleP95: Int
    public let femaleP99: Int
    public let femaleRecord: Int
}

public struct PercentileCalculation {
    public let score: Int
    public let percentile: Float
    public let percentileRounded: Int
    public let talentTier: TalentTier
    public let bracketLabel: String
    public let medianScore: Int
    public let eliteThreshold: Int
    public let nationalRecord: Int
    public let comparisonSummary: String
}

public struct PercentileEngine {
    
    private static let pushUpNorms = [
        AgeBracketNorms(minAge: 10, maxAge: 13, label: "Sub-Junior (10-13y)", maleP10: 4, maleP25: 8, maleP50: 14, maleP75: 22, maleP90: 30, maleP95: 36, maleP99: 45, maleRecord: 58, femaleP10: 2, femaleP25: 5, femaleP50: 10, femaleP75: 16, femaleP90: 23, femaleP95: 28, femaleP99: 36, femaleRecord: 48),
        AgeBracketNorms(minAge: 14, maxAge: 17, label: "Junior (14-17y)", maleP10: 10, maleP25: 18, maleP50: 28, maleP75: 38, maleP90: 48, maleP95: 55, maleP99: 68, maleRecord: 84, femaleP10: 5, femaleP25: 11, femaleP50: 19, femaleP75: 27, femaleP90: 36, femaleP95: 42, femaleP99: 52, femaleRecord: 65),
        AgeBracketNorms(minAge: 18, maxAge: 22, label: "Youth / College (18-22y)", maleP10: 14, maleP25: 24, maleP50: 35, maleP75: 46, maleP90: 58, maleP95: 66, maleP99: 80, maleRecord: 102, femaleP10: 7, femaleP25: 14, femaleP50: 22, femaleP75: 32, femaleP90: 42, femaleP95: 48, femaleP99: 60, femaleRecord: 75),
        AgeBracketNorms(minAge: 23, maxAge: 30, label: "Senior (23-30y)", maleP10: 12, maleP25: 22, maleP50: 33, maleP75: 44, maleP90: 55, maleP95: 62, maleP99: 76, maleRecord: 98, femaleP10: 6, femaleP25: 12, femaleP50: 20, femaleP75: 29, femaleP90: 39, femaleP95: 45, femaleP99: 56, femaleRecord: 70),
        AgeBracketNorms(minAge: 31, maxAge: 99, label: "Masters (30+y)", maleP10: 8, maleP25: 16, maleP50: 25, maleP75: 35, maleP90: 45, maleP95: 52, maleP99: 65, maleRecord: 82, femaleP10: 4, femaleP25: 9, femaleP50: 15, femaleP75: 23, femaleP90: 31, femaleP95: 37, femaleP99: 48, femaleRecord: 60)
    ]
    
    private static let squatNorms = [
        AgeBracketNorms(minAge: 10, maxAge: 13, label: "Sub-Junior (10-13y)", maleP10: 12, maleP25: 20, maleP50: 30, maleP75: 42, maleP90: 55, maleP95: 65, maleP99: 80, maleRecord: 105, femaleP10: 10, femaleP25: 18, femaleP50: 28, femaleP75: 38, femaleP90: 50, femaleP95: 60, femaleP99: 75, femaleRecord: 98),
        AgeBracketNorms(minAge: 14, maxAge: 17, label: "Junior (14-17y)", maleP10: 18, maleP25: 28, maleP50: 42, maleP75: 58, maleP90: 74, maleP95: 85, maleP99: 105, maleRecord: 135, femaleP10: 15, femaleP25: 24, femaleP50: 36, femaleP75: 50, femaleP90: 65, femaleP95: 76, femaleP99: 95, femaleRecord: 120),
        AgeBracketNorms(minAge: 18, maxAge: 22, label: "Youth / College (18-22y)", maleP10: 22, maleP25: 35, maleP50: 50, maleP75: 68, maleP90: 86, maleP95: 98, maleP99: 120, maleRecord: 155, femaleP10: 18, femaleP25: 28, femaleP50: 42, femaleP75: 58, femaleP90: 74, femaleP95: 85, femaleP99: 99, femaleRecord: 135),
        AgeBracketNorms(minAge: 23, maxAge: 30, label: "Senior (23-30y)", maleP10: 20, maleP25: 32, maleP50: 46, maleP75: 64, maleP90: 80, maleP95: 92, maleP99: 115, maleRecord: 145, femaleP10: 16, femaleP25: 26, femaleP50: 38, femaleP75: 54, femaleP90: 68, femaleP95: 78, femaleP99: 98, femaleRecord: 125),
        AgeBracketNorms(minAge: 31, maxAge: 99, label: "Masters (30+y)", maleP10: 15, maleP25: 24, maleP50: 36, maleP75: 50, maleP90: 65, maleP95: 75, maleP99: 95, maleRecord: 120, femaleP10: 12, femaleP25: 20, femaleP50: 30, femaleP75: 42, femaleP90: 55, femaleP95: 65, femaleP99: 82, femaleRecord: 105)
    ]
    
    private static let plankNorms = [
        AgeBracketNorms(minAge: 10, maxAge: 13, label: "Sub-Junior (10-13y)", maleP10: 25, maleP25: 45, maleP50: 70, maleP75: 105, maleP90: 140, maleP95: 165, maleP99: 210, maleRecord: 300, femaleP10: 20, femaleP25: 40, femaleP50: 60, femaleP75: 90, femaleP90: 125, femaleP95: 150, femaleP99: 190, femaleRecord: 270),
        AgeBracketNorms(minAge: 14, maxAge: 17, label: "Junior (14-17y)", maleP10: 40, maleP25: 65, maleP50: 100, maleP75: 145, maleP90: 190, maleP95: 225, maleP99: 280, maleRecord: 400, femaleP10: 30, femaleP25: 55, femaleP50: 85, femaleP75: 125, femaleP90: 165, femaleP95: 195, femaleP99: 245, femaleRecord: 350),
        AgeBracketNorms(minAge: 18, maxAge: 22, label: "Youth / College (18-22y)", maleP10: 50, maleP25: 80, maleP50: 120, maleP75: 175, maleP90: 230, maleP95: 270, maleP99: 340, maleRecord: 480, femaleP10: 40, femaleP25: 65, femaleP50: 100, femaleP75: 145, femaleP90: 190, femaleP95: 225, femaleP99: 280, femaleRecord: 400),
        AgeBracketNorms(minAge: 23, maxAge: 30, label: "Senior (23-30y)", maleP10: 45, maleP25: 75, maleP50: 115, maleP75: 165, maleP90: 215, maleP95: 255, maleP99: 320, maleRecord: 450, femaleP10: 35, femaleP25: 60, femaleP50: 95, femaleP75: 135, femaleP90: 180, femaleP95: 210, femaleP99: 265, femaleRecord: 380),
        AgeBracketNorms(minAge: 31, maxAge: 99, label: "Masters (30+y)", maleP10: 35, maleP25: 60, maleP50: 90, maleP75: 130, maleP90: 175, maleP95: 205, maleP99: 260, maleRecord: 360, femaleP10: 25, femaleP25: 45, femaleP50: 75, femaleP75: 110, femaleP90: 150, femaleP95: 175, femaleP99: 220, femaleRecord: 310)
    ]
    
    private static let jumpNorms = [
        AgeBracketNorms(minAge: 10, maxAge: 13, label: "Sub-Junior (10-13y)", maleP10: 20, maleP25: 26, maleP50: 33, maleP75: 40, maleP90: 47, maleP95: 52, maleP99: 60, maleRecord: 70, femaleP10: 16, femaleP25: 22, femaleP50: 28, femaleP75: 34, femaleP90: 40, femaleP95: 44, femaleP99: 51, femaleRecord: 60),
        AgeBracketNorms(minAge: 14, maxAge: 17, label: "Junior (14-17y)", maleP10: 28, maleP25: 36, maleP50: 45, maleP75: 54, maleP90: 63, maleP95: 69, maleP99: 78, maleRecord: 90, femaleP10: 22, femaleP25: 29, femaleP50: 37, femaleP75: 45, femaleP90: 53, femaleP95: 58, femaleP99: 66, femaleRecord: 78),
        AgeBracketNorms(minAge: 18, maxAge: 22, label: "Youth / College (18-22y)", maleP10: 35, maleP25: 44, maleP50: 55, maleP75: 65, maleP90: 75, maleP95: 82, maleP99: 92, maleRecord: 108, femaleP10: 26, femaleP25: 34, femaleP50: 43, femaleP75: 52, femaleP90: 61, femaleP95: 67, femaleP99: 76, femaleRecord: 89),
        AgeBracketNorms(minAge: 23, maxAge: 30, label: "Senior (23-30y)", maleP10: 34, maleP25: 42, maleP50: 52, maleP75: 62, maleP90: 72, maleP95: 78, maleP99: 88, maleRecord: 102, femaleP10: 24, femaleP25: 32, femaleP50: 40, femaleP75: 49, femaleP90: 57, femaleP95: 63, femaleP99: 72, femaleRecord: 84),
        AgeBracketNorms(minAge: 31, maxAge: 99, label: "Masters (30+y)", maleP10: 27, maleP25: 35, maleP50: 44, maleP75: 53, maleP90: 62, maleP95: 68, maleP99: 77, maleRecord: 90, femaleP10: 20, femaleP25: 27, femaleP50: 34, femaleP75: 42, femaleP90: 49, femaleP95: 54, femaleP99: 62, femaleRecord: 74)
    ]
    
    public static func calculate(
        score: Int,
        age: Int,
        gender: Gender,
        exerciseType: ExerciseType
    ) -> PercentileCalculation {
        let normsList: [AgeBracketNorms]
        switch exerciseType {
        case .pushups: normsList = pushUpNorms
        case .squats: normsList = squatNorms
        case .plank: normsList = plankNorms
        case .verticalJump: normsList = jumpNorms
        }
        
        let bracket = normsList.first(where: { age >= $0.minAge && age <= $0.maxAge }) ?? normsList.last!
        let isMale = (gender == .male)
        
        let p10 = isMale ? bracket.maleP10 : bracket.femaleP10
        let p25 = isMale ? bracket.maleP25 : bracket.femaleP25
        let p50 = isMale ? bracket.maleP50 : bracket.femaleP50
        let p75 = isMale ? bracket.maleP75 : bracket.femaleP75
        let p90 = isMale ? bracket.maleP90 : bracket.femaleP90
        let p95 = isMale ? bracket.maleP95 : bracket.femaleP95
        let p99 = isMale ? bracket.maleP99 : bracket.femaleP99
        let record = isMale ? bracket.maleRecord : bracket.femaleRecord
        
        let anchors: [(score: Int, pct: Float)] = [
            (0, 0.0),
            (p10, 10.0),
            (p25, 25.0),
            (p50, 50.0),
            (p75, 75.0),
            (p90, 90.0),
            (p95, 95.0),
            (p99, 99.0),
            (record, 100.0)
        ]
        
        var rawPercentile: Float = 1.0
        
        if score >= record {
            rawPercentile = 99.9
        } else if score > 0 {
            for i in 0..<(anchors.count - 1) {
                let lower = anchors[i]
                let upper = anchors[i + 1]
                if score >= lower.score && score <= upper.score {
                    let ratio = Float(score - lower.score) / Float(max(1, upper.score - lower.score))
                    rawPercentile = lower.pct + ratio * (upper.pct - lower.pct)
                    break
                }
            }
        }
        
        let clampedPercentile = max(1.0, min(99.9, (rawPercentile * 10).rounded() / 10))
        let rounded = Int(clampedPercentile.rounded())
        
        let talentTier: TalentTier
        if clampedPercentile >= 95.0 {
            talentTier = .nationalElite
        } else if clampedPercentile >= 85.0 {
            talentTier = .stateContender
        } else if clampedPercentile >= 70.0 {
            talentTier = .districtPerformer
        } else if clampedPercentile >= 45.0 {
            talentTier = .activeClub
        } else {
            talentTier = .developing
        }
        
        let genderStr = isMale ? "Male" : "Female"
        let summary = "Outperforms \(rounded)% of \(genderStr) athletes across India in \(bracket.label)"
        
        return PercentileCalculation(
            score: score,
            percentile: clampedPercentile,
            percentileRounded: rounded,
            talentTier: talentTier,
            bracketLabel: bracket.label,
            medianScore: p50,
            eliteThreshold: p90,
            nationalRecord: record,
            comparisonSummary: summary
        )
    }
}
