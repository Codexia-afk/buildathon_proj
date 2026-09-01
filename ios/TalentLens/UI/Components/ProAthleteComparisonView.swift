//
//  ProAthleteComparisonView.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public struct ProAthleteComparisonView: View {
    public let userAssessment: AssessmentResult
    public let onDismiss: () -> Void
    
    @State private var selectedPro: ProAthleteBenchmark
    
    public init(userAssessment: AssessmentResult, onDismiss: @escaping () -> Void) {
        self.userAssessment = userAssessment
        self.onDismiss = onDismiss
        _selectedPro = State(initialValue: ProAthleteDataset.proForSport(userAssessment.sport))
    }
    
    private var proTargetScore: Int {
        selectedPro.targetScore(for: userAssessment.exerciseType)
    }
    
    private var matchPercentage: Int {
        let target = max(1, proTargetScore)
        let pct = (Float(userAssessment.score) / Float(target)) * 100.0
        return Int(min(120.0, pct))
    }
    
    private var gapToPro: Int {
        max(0, proTargetScore - userAssessment.score)
    }
    
    private var shareText: String {
        """
        🏅 TalentLens Pro Athlete Benchmark Comparison:
        Athlete: \(userAssessment.athleteName) (\(userAssessment.sport.displayName))
        Score: \(userAssessment.score) \(userAssessment.exerciseType.metricUnit)
        
        ⭐ Matched Pro Champion: \(selectedPro.name) (\(selectedPro.title))
        Pro Benchmark: \(proTargetScore) \(userAssessment.exerciseType.metricUnit)
        Match Level: \(matchPercentage)% of Pro Standard!
        
        Archetype: \(selectedPro.physicalArchetype)
        Verified via TalentLens Edge AI.
        """
    }
    
    public var body: some View {
        ZStack {
            TLTheme.backgroundDark.edgesIgnoringSafeArea(.all)
            
            ScrollView {
                VStack(spacing: 16) {
                    // Header
                    HStack {
                        HStack(spacing: 8) {
                            Text("⭐")
                                .font(.title2)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("PRO ATHLETE COMPARISON")
                                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                                    .foregroundColor(TLTheme.brandOrange)
                                Text("Head-to-Head vs Champions")
                                    .font(.system(size: 18, weight: .heavy))
                                    .foregroundColor(TLTheme.textPrimary)
                            }
                        }
                        Spacer()
                        Button(action: onDismiss) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(TLTheme.textSecondary)
                                .font(.title2)
                        }
                    }
                    .padding(.horizontal)
                    .padding(.top, 16)
                    
                    // Champion Selector Carousel
                    VStack(alignment: .leading, spacing: 8) {
                        Text("COMPARE AGAINST TOP-CLASS CHAMPIONS:")
                            .font(.system(size: 10, weight: .bold, design: .monospaced))
                            .foregroundColor(TLTheme.textSecondary)
                            .padding(.horizontal)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(ProAthleteDataset.athletes) { pro in
                                    let isSelected = (pro.name == selectedPro.name)
                                    Button(action: {
                                        selectedPro = pro
                                    }) {
                                        HStack(spacing: 6) {
                                            Text(pro.iconEmoji)
                                            Text(pro.name.components(separatedBy: " ").first ?? pro.name)
                                                .font(.system(size: 12, weight: .bold))
                                        }
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 8)
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
                        }
                    }
                    
                    // Pro Champion Showcase Dossier Card
                    VStack(alignment: .leading, spacing: 14) {
                        HStack(alignment: .top, spacing: 14) {
                            ZStack {
                                RoundedRectangle(cornerRadius: 20)
                                    .fill(TLTheme.brandOrange.opacity(0.15))
                                    .frame(width: 60, height: 60)
                                Text(selectedPro.iconEmoji)
                                    .font(.system(size: 32))
                            }
                            
                            VStack(alignment: .leading, spacing: 3) {
                                HStack {
                                    Text(selectedPro.name)
                                        .font(.system(size: 20, weight: .black))
                                        .foregroundColor(TLTheme.textPrimary)
                                    Spacer()
                                    Text(selectedPro.sport.iconEmoji)
                                }
                                
                                Text(selectedPro.title)
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(TLTheme.cyberCyan)
                                
                                Text(selectedPro.achievement)
                                    .font(.system(size: 11))
                                    .foregroundColor(TLTheme.textSecondary)
                            }
                        }
                        
                        Divider().background(TLTheme.cardBorder)
                        
                        // Physical Archetype Badge
                        VStack(alignment: .leading, spacing: 4) {
                            Text("PHYSICAL ARCHETYPE")
                                .font(.system(size: 9, weight: .bold, design: .monospaced))
                                .foregroundColor(TLTheme.brandOrange)
                            Text(selectedPro.physicalArchetype)
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(TLTheme.textPrimary)
                        }
                        .padding(10)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(TLTheme.cardBackground.opacity(0.8))
                        .cornerRadius(12)
                        
                        // Head-to-Head Comparison Score Matrix
                        VStack(spacing: 10) {
                            HStack {
                                Text("EXERCISE METRIC")
                                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                                    .foregroundColor(TLTheme.textSecondary)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                Text("YOU")
                                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                                    .foregroundColor(TLTheme.brandOrange)
                                    .frame(width: 70, alignment: .center)
                                Text(selectedPro.name.components(separatedBy: " ").first?.uppercased() ?? "PRO")
                                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                                    .foregroundColor(TLTheme.cyberCyan)
                                    .frame(width: 70, alignment: .center)
                            }
                            
                            Divider().background(TLTheme.cardBorder)
                            
                            // Active Exercise Comparison Row
                            ProMetricRow(
                                title: userAssessment.exerciseType.shortName,
                                userValue: "\(userAssessment.score) \(userAssessment.exerciseType.metricUnit)",
                                proValue: "\(proTargetScore) \(userAssessment.exerciseType.metricUnit)",
                                isHighlighted: true,
                                progressPct: Float(matchPercentage) / 100.0
                            )
                            
                            // Form Score
                            ProMetricRow(
                                title: "Form Precision",
                                userValue: "\(userAssessment.biomechanics.formScore)%",
                                proValue: "\(selectedPro.formPrecisionScore)%",
                                isHighlighted: false,
                                progressPct: Float(userAssessment.biomechanics.formScore) / Float(selectedPro.formPrecisionScore)
                            )
                            
                            // Push-ups Standard
                            if userAssessment.exerciseType != .pushups {
                                ProMetricRow(
                                    title: "Push-Ups (Endurance)",
                                    userValue: "Target Drill",
                                    proValue: "\(selectedPro.pushupsScore) reps",
                                    isHighlighted: false,
                                    progressPct: 0.7
                                )
                            }
                            
                            // Squats Standard
                            if userAssessment.exerciseType != .squats {
                                ProMetricRow(
                                    title: "Squats (Leg Power)",
                                    userValue: "Target Drill",
                                    proValue: "\(selectedPro.squatsScore) reps",
                                    isHighlighted: false,
                                    progressPct: 0.7
                                )
                            }
                            
                            // Plank Hold
                            if userAssessment.exerciseType != .plank {
                                ProMetricRow(
                                    title: "Plank (Core Stability)",
                                    userValue: "Target Drill",
                                    proValue: "\(selectedPro.plankSeconds) sec",
                                    isHighlighted: false,
                                    progressPct: 0.7
                                )
                            }
                            
                            // Vertical Jump
                            if userAssessment.exerciseType != .verticalJump {
                                ProMetricRow(
                                    title: "Vert Jump (Explosive)",
                                    userValue: "Target Drill",
                                    proValue: "\(Int(selectedPro.verticalJumpCm)) cm",
                                    isHighlighted: false,
                                    progressPct: 0.7
                                )
                            }
                        }
                        .padding(12)
                        .background(TLTheme.backgroundDark.opacity(0.8))
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(TLTheme.cardBorder, lineWidth: 1))
                        
                        // Metric Match Dial & Milestone Gap
                        HStack(spacing: 14) {
                            // Match % Dial
                            VStack(spacing: 2) {
                                Text("\(matchPercentage)%")
                                    .font(.system(size: 28, weight: .black))
                                    .foregroundColor(matchPercentage >= 90 ? TLTheme.verifiedEmerald : TLTheme.brandOrange)
                                Text("PRO MATCH")
                                    .font(.system(size: 8, weight: .bold, design: .monospaced))
                                    .foregroundColor(TLTheme.textSecondary)
                            }
                            .padding(12)
                            .frame(width: 100)
                            .background(TLTheme.cardBackground)
                            .cornerRadius(14)
                            .overlay(RoundedRectangle(cornerRadius: 14).stroke(TLTheme.cardBorder, lineWidth: 1))
                            
                            // Milestone Gap Text
                            VStack(alignment: .leading, spacing: 3) {
                                Text("MILESTONE GAP TO CHAMPION:")
                                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                                    .foregroundColor(TLTheme.cyberCyan)
                                
                                if gapToPro == 0 {
                                    Text("🏆 Olympic Level Match Achieved!")
                                        .font(.system(size: 13, weight: .bold))
                                        .foregroundColor(TLTheme.verifiedEmerald)
                                } else {
                                    Text("+\(gapToPro) \(userAssessment.exerciseType.metricUnit) needed to match \(selectedPro.name.components(separatedBy: " ").first ?? "Pro")'s benchmark")
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundColor(TLTheme.textPrimary)
                                }
                                
                                Text("Focus: \(selectedPro.focusArea)")
                                    .font(.system(size: 10))
                                    .foregroundColor(TLTheme.textSecondary)
                                    .lineLimit(1)
                            }
                            Spacer()
                        }
                        
                        // Champion Advice Quote
                        VStack(alignment: .leading, spacing: 6) {
                            HStack {
                                Text("💡 CHAMPION COACHING ADVICE")
                                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                                    .foregroundColor(TLTheme.cyberCyan)
                                Spacer()
                                Text("— \(selectedPro.name)")
                                    .font(.system(size: 9, weight: .semibold))
                                    .foregroundColor(TLTheme.textSecondary)
                            }
                            
                            Text("\"\(selectedPro.proAdviceQuote)\"")
                                .font(.system(size: 11, weight: .medium))
                                .italic()
                                .foregroundColor(TLTheme.textPrimary)
                                .lineSpacing(2)
                        }
                        .padding(12)
                        .background(TLTheme.cyberCyan.opacity(0.1))
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(TLTheme.cyberCyan.opacity(0.3), lineWidth: 1))
                    }
                    .padding(18)
                    .background(TLTheme.cardBackground)
                    .cornerRadius(24)
                    .overlay(RoundedRectangle(cornerRadius: 24).stroke(TLTheme.cardBorder, lineWidth: 1))
                    .padding(.horizontal)
                    
                    // Share Link & Actions
                    VStack(spacing: 10) {
                        ShareLink(item: shareText) {
                            HStack(spacing: 8) {
                                Image(systemName: "square.and.arrow.up")
                                    .foregroundColor(.white)
                                Text("Share Pro Comparison Card")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.white)
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(TLTheme.brandOrange)
                            .cornerRadius(16)
                        }
                        
                        Button(action: onDismiss) {
                            Text("Done / Return to Results")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(TLTheme.textSecondary)
                                .frame(maxWidth: .infinity)
                                .frame(height: 44)
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 24)
                }
            }
        }
    }
}

// Subview for single metric comparison row
private struct ProMetricRow: View {
    let title: String
    let userValue: String
    let proValue: String
    let isHighlighted: Bool
    let progressPct: Float
    
    var body: some View {
        VStack(spacing: 4) {
            HStack {
                Text(title)
                    .font(.system(size: 11, weight: isHighlighted ? .bold : .medium))
                    .foregroundColor(isHighlighted ? TLTheme.textPrimary : TLTheme.textSecondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                
                Text(userValue)
                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                    .foregroundColor(isHighlighted ? TLTheme.brandOrange : TLTheme.textPrimary)
                    .frame(width: 70, alignment: .center)
                
                Text(proValue)
                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                    .foregroundColor(TLTheme.cyberCyan)
                    .frame(width: 70, alignment: .center)
            }
            
            if isHighlighted {
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 3)
                            .fill(TLTheme.cardBorder)
                            .frame(height: 5)
                        
                        RoundedRectangle(cornerRadius: 3)
                            .fill(TLTheme.brandOrange)
                            .frame(width: min(geo.size.width, geo.size.width * CGFloat(min(1.0, progressPct))), height: 5)
                    }
                }
                .frame(height: 5)
                .padding(.top, 2)
            }
        }
        .padding(.vertical, 2)
    }
}
