//
//  BenchmarksScreen.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public struct BenchmarksScreen: View {
    @State private var selectedExercise: ExerciseType = .pushups
    @State private var selectedGender: Gender = .male
    @State private var age: Double = 17.0
    @State private var score: Double = 38.0
    
    public init() {}
    
    private var calculation: PercentileCalculation {
        PercentileEngine.calculate(
            score: Int(score),
            age: Int(age),
            gender: selectedGender,
            exerciseType: selectedExercise
        )
    }
    
    public var body: some View {
        ZStack {
            TLTheme.backgroundDark.edgesIgnoringSafeArea(.all)
            
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // Header
                    VStack(alignment: .leading, spacing: 4) {
                        Text("NATIONAL STANDARDS")
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundColor(TLTheme.brandOrange)
                        Text("Percentile Calculator")
                            .font(.system(size: 24, weight: .black))
                            .foregroundColor(TLTheme.textPrimary)
                        Text("Explore empirical distributions calibrated against Khelo India / SAI youth norms.")
                            .font(.system(size: 12))
                            .foregroundColor(TLTheme.textSecondary)
                    }
                    .padding(.horizontal)
                    .padding(.top, 12)
                    
                    // Exercise Tabs
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(ExerciseType.allCases) { ex in
                                let isSelected = (ex == selectedExercise)
                                Button(action: {
                                    selectedExercise = ex
                                    if ex == .plank && score < 60 {
                                        score = 120
                                    } else if ex != .plank && score > 100 {
                                        score = 40
                                    }
                                }) {
                                    Text(ex.shortName)
                                        .font(.system(size: 12, weight: .bold))
                                        .padding(.horizontal, 14)
                                        .padding(.vertical, 8)
                                        .background(isSelected ? TLTheme.cardBackground : TLTheme.cardBackground.opacity(0.5))
                                        .foregroundColor(isSelected ? TLTheme.textPrimary : TLTheme.textSecondary)
                                        .cornerRadius(14)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 14)
                                                .stroke(isSelected ? TLTheme.brandOrange : TLTheme.cardBorder, lineWidth: isSelected ? 1.5 : 1)
                                        )
                                }
                            }
                        }
                        .padding(.horizontal)
                    }
                    
                    // Gender Selector
                    HStack(spacing: 8) {
                        ForEach([Gender.male, Gender.female]) { g in
                            let isSelected = (g == selectedGender)
                            Button(action: { selectedGender = g }) {
                                Text(g.displayName)
                                    .font(.system(size: 13, weight: .bold))
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 42)
                                    .background(isSelected ? TLTheme.brandOrange : TLTheme.cardBackground)
                                    .foregroundColor(isSelected ? .white : TLTheme.textSecondary)
                                    .cornerRadius(12)
                                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(isSelected ? TLTheme.brandOrange : TLTheme.cardBorder, lineWidth: 1))
                            }
                        }
                    }
                    .padding(.horizontal)
                    
                    // Sliders Card
                    VStack(spacing: 16) {
                        // Age Slider
                        VStack(alignment: .leading, spacing: 6) {
                            HStack {
                                Text("ATHLETE AGE")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(TLTheme.textSecondary)
                                Spacer()
                                Text("\(Int(age)) Years Old")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(TLTheme.textPrimary)
                            }
                            
                            Slider(value: $age, in: 10...35, step: 1)
                                .accentColor(TLTheme.brandOrange)
                        }
                        
                        Divider().background(TLTheme.cardBorder)
                        
                        // Score Slider
                        VStack(alignment: .leading, spacing: 6) {
                            HStack {
                                Text("TEST SCORE")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(TLTheme.textSecondary)
                                Spacer()
                                Text("\(Int(score)) \(selectedExercise.metricUnit)")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(TLTheme.brandOrange)
                            }
                            
                            Slider(
                                value: $score,
                                in: 1...(selectedExercise == .plank ? 300.0 : 100.0),
                                step: 1
                            )
                            .accentColor(TLTheme.brandOrange)
                        }
                    }
                    .padding(18)
                    .background(TLTheme.cardBackground)
                    .cornerRadius(20)
                    .overlay(RoundedRectangle(cornerRadius: 20).stroke(TLTheme.cardBorder, lineWidth: 1))
                    .padding(.horizontal)
                    
                    // Dynamic Calculation Card
                    let calc = calculation
                    VStack(alignment: .leading, spacing: 10) {
                        Text("CALCULATED PLACEMENT")
                            .font(.system(size: 10, weight: .bold, design: .monospaced))
                            .foregroundColor(TLTheme.textSecondary)
                        
                        HStack(alignment: .lastTextBaseline) {
                            Text("\(calc.percentileRounded)%")
                                .font(.system(size: 42, weight: .black))
                                .foregroundColor(TLTheme.textPrimary)
                            Spacer()
                            Text(calc.talentTier.displayName)
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: calc.talentTier.badgeColorHex))
                        }
                        
                        Text(calc.comparisonSummary)
                            .font(.system(size: 12))
                            .foregroundColor(TLTheme.textSecondary)
                    }
                    .padding(20)
                    .background(Color(hex: calc.talentTier.badgeColorHex).opacity(0.15))
                    .cornerRadius(20)
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(Color(hex: calc.talentTier.badgeColorHex).opacity(0.5), lineWidth: 1)
                    )
                    .padding(.horizontal)
                    .padding(.bottom, 24)
                }
            }
        }
    }
}
