//
//  BenchmarksScreen.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public struct BenchmarksScreen: View {
    @State private var selectedTab: BenchmarkTab = .proChampions
    @State private var selectedExercise: ExerciseType = .pushups
    @State private var selectedGender: Gender = .male
    @State private var age: Double = 17.0
    @State private var score: Double = 38.0
    
    public enum BenchmarkTab: String, CaseIterable, Identifiable {
        case proChampions = "⭐ Pro Champions Dataset"
        case nationalPercentiles = "📊 SAI National Percentiles"
        
        public var id: String { rawValue }
    }
    
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
                        Text("STANDARDS & PRO BENCHMARKS")
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundColor(TLTheme.brandOrange)
                        Text("Elite Athletic Datasets")
                            .font(.system(size: 24, weight: .black))
                            .foregroundColor(TLTheme.textPrimary)
                        Text("Benchmark training metrics against Olympic champions and SAI national youth norms.")
                            .font(.system(size: 12))
                            .foregroundColor(TLTheme.textSecondary)
                    }
                    .padding(.horizontal)
                    .padding(.top, 12)
                    
                    // Tab Selector (Pro Champions vs SAI Percentiles)
                    HStack(spacing: 8) {
                        ForEach(BenchmarkTab.allCases) { tab in
                            let isSelected = (tab == selectedTab)
                            Button(action: { selectedTab = tab }) {
                                Text(tab.rawValue)
                                    .font(.system(size: 12, weight: .bold))
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 10)
                                    .background(isSelected ? TLTheme.brandOrange : TLTheme.cardBackground)
                                    .foregroundColor(isSelected ? .white : TLTheme.textSecondary)
                                    .cornerRadius(14)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 14)
                                            .stroke(isSelected ? TLTheme.brandOrange : TLTheme.cardBorder, lineWidth: 1)
                                    )
                            }
                        }
                    }
                    .padding(.horizontal)
                    
                    if selectedTab == .proChampions {
                        // Pro Champions Dataset View
                        VStack(alignment: .leading, spacing: 14) {
                            Text("WORLD-CLASS & OLYMPIC PRO DATASET (11 CHAMPIONS)")
                                .font(.system(size: 10, weight: .bold, design: .monospaced))
                                .foregroundColor(TLTheme.cyberCyan)
                                .padding(.horizontal)
                            
                            ForEach(ProAthleteDataset.athletes) { pro in
                                VStack(alignment: .leading, spacing: 10) {
                                    HStack(spacing: 12) {
                                        ZStack {
                                            Circle()
                                                .fill(TLTheme.brandOrange.opacity(0.15))
                                                .frame(width: 48, height: 48)
                                            Text(pro.iconEmoji)
                                                .font(.title2)
                                        }
                                        
                                        VStack(alignment: .leading, spacing: 2) {
                                            HStack {
                                                Text(pro.name)
                                                    .font(.system(size: 16, weight: .black))
                                                    .foregroundColor(TLTheme.textPrimary)
                                                Spacer()
                                                Text(pro.sport.iconEmoji)
                                                    .font(.subheadline)
                                                Text(pro.sport.displayName.components(separatedBy: " (").first ?? "")
                                                    .font(.system(size: 10, weight: .bold))
                                                    .foregroundColor(TLTheme.brandOrange)
                                            }
                                            
                                            Text(pro.title)
                                                .font(.system(size: 12, weight: .semibold))
                                                .foregroundColor(TLTheme.cyberCyan)
                                            
                                            Text(pro.achievement)
                                                .font(.system(size: 10))
                                                .foregroundColor(TLTheme.textSecondary)
                                        }
                                    }
                                    
                                    Divider().background(TLTheme.cardBorder)
                                    
                                    // 4-Pillar Pro Benchmark Matrix
                                    HStack(spacing: 6) {
                                        ProStatBadge(label: "PUSH-UPS", val: "\(pro.pushupsScore) reps")
                                        ProStatBadge(label: "SQUATS", val: "\(pro.squatsScore) reps")
                                        ProStatBadge(label: "PLANK", val: "\(pro.plankSeconds)s")
                                        ProStatBadge(label: "JUMP", val: "\(Int(pro.verticalJumpCm)) cm")
                                    }
                                    
                                    // Advice & Archetype
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("Archetype: \(pro.physicalArchetype)")
                                            .font(.system(size: 10, weight: .semibold))
                                            .foregroundColor(TLTheme.textPrimary)
                                        
                                        Text("\"\(pro.proAdviceQuote)\"")
                                            .font(.system(size: 10))
                                            .italic()
                                            .foregroundColor(TLTheme.textSecondary)
                                            .lineLimit(2)
                                    }
                                    .padding(8)
                                    .background(TLTheme.backgroundDark.opacity(0.7))
                                    .cornerRadius(8)
                                }
                                .padding(16)
                                .background(TLTheme.cardBackground)
                                .cornerRadius(20)
                                .overlay(RoundedRectangle(cornerRadius: 20).stroke(TLTheme.cardBorder, lineWidth: 1))
                                .padding(.horizontal)
                            }
                        }
                    } else {
                        // National Percentiles View
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
                                        .background(isSelected ? TLTheme.cardBackground : TLTheme.cardBackground.opacity(0.4))
                                        .cornerRadius(12)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 12)
                                                .stroke(isSelected ? TLTheme.brandOrange : TLTheme.cardBorder, lineWidth: isSelected ? 1.5 : 1)
                                        )
                                    }
                                }
                            }
                            .padding(.horizontal)
                        }
                        
                        // Interactive Sliders Card
                        VStack(spacing: 16) {
                            // Gender Segmented Picker
                            Picker("Gender", selection: $selectedGender) {
                                ForEach(Gender.allCases) { g in
                                    Text(g.displayName).tag(g)
                                }
                            }
                            .pickerStyle(SegmentedPickerStyle())
                            
                            // Age Slider
                            VStack(alignment: .leading, spacing: 6) {
                                HStack {
                                    Text("Athlete Age")
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundColor(TLTheme.textSecondary)
                                    Spacer()
                                    Text("\(Int(age)) years")
                                        .font(.system(size: 14, weight: .bold, design: .monospaced))
                                        .foregroundColor(TLTheme.textPrimary)
                                }
                                Slider(value: $age, in: 10...35, step: 1)
                                    .accentColor(TLTheme.brandOrange)
                            }
                            
                            // Score Slider
                            VStack(alignment: .leading, spacing: 6) {
                                HStack {
                                    Text(selectedExercise.title)
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundColor(TLTheme.textSecondary)
                                    Spacer()
                                    Text("\(Int(score)) \(selectedExercise.metricUnit)")
                                        .font(.system(size: 14, weight: .bold, design: .monospaced))
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
                    }
                    
                    Spacer().frame(height: 24)
                }
            }
        }
    }
}

private struct ProStatBadge: View {
    let label: String
    let val: String
    
    var body: some View {
        VStack(spacing: 2) {
            Text(label)
                .font(.system(size: 8, weight: .bold, design: .monospaced))
                .foregroundColor(TLTheme.textSecondary)
            Text(val)
                .font(.system(size: 10, weight: .black, design: .monospaced))
                .foregroundColor(TLTheme.brandOrange)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 6)
        .background(TLTheme.backgroundDark.opacity(0.8))
        .cornerRadius(8)
    }
}
