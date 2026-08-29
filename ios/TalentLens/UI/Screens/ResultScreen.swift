//
//  ResultScreen.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public struct ResultScreen: View {
    public let assessment: AssessmentResult
    public let onRetest: () -> Void
    public let onNavigateToScout: () -> Void
    
    @State private var showCertificate: Bool = false
    @State private var isBroadcasted: Bool = false
    
    public init(
        assessment: AssessmentResult,
        onRetest: @escaping () -> Void,
        onNavigateToScout: @escaping () -> Void
    ) {
        self.assessment = assessment
        self.onRetest = onRetest
        self.onNavigateToScout = onNavigateToScout
    }
    
    private var sportProfile: SportTrainingProfile {
        SportTrainingDatabase.profile(for: assessment.sport)
    }
    
    private var drillInfo: SportTrainingDrill? {
        sportProfile.recommendedDrills.first(where: { $0.exerciseType == assessment.exerciseType })
    }
    
    public var body: some View {
        ZStack {
            TLTheme.backgroundDark.edgesIgnoringSafeArea(.all)
            
            ScrollView {
                VStack(spacing: 16) {
                    // Top Banner
                    HStack(spacing: 12) {
                        Image(systemName: "checkmark.seal.fill")
                            .foregroundColor(TLTheme.verifiedEmerald)
                            .font(.title2)
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text("AI VERIFIED ASSESSMENT")
                                .font(.system(size: 12, weight: .bold, design: .monospaced))
                                .foregroundColor(TLTheme.textPrimary)
                            Text("Hash: \(assessment.verificationHash)")
                                .font(.system(size: 11, design: .monospaced))
                                .foregroundColor(TLTheme.verifiedEmerald)
                        }
                        Spacer()
                    }
                    .padding(16)
                    .background(TLTheme.verifiedEmerald.opacity(0.15))
                    .cornerRadius(20)
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(TLTheme.verifiedEmerald.opacity(0.4), lineWidth: 1)
                    )
                    .padding(.horizontal)
                    .padding(.top, 16)
                    
                    // Main Result Card
                    VStack(alignment: .leading, spacing: 16) {
                        VStack(alignment: .leading, spacing: 4) {
                            HStack {
                                Text(assessment.exerciseType.title.uppercased())
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(TLTheme.brandOrange)
                                Spacer()
                                Text("\(assessment.sport.iconEmoji) \(assessment.sport.displayName)")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(TLTheme.cyberCyan)
                            }
                            
                            Text(assessment.athleteName)
                                .font(.system(size: 24, weight: .black))
                                .foregroundColor(TLTheme.textPrimary)
                            
                            Text("\(assessment.district), \(assessment.state) • \(assessment.age)y • \(assessment.sport.displayName)")
                                .font(.system(size: 12))
                                .foregroundColor(TLTheme.textSecondary)
                        }
                        
                        Divider().background(TLTheme.cardBorder)
                        
                        // 3-Metric KPI Grid
                        HStack {
                            VStack(spacing: 4) {
                                Text("SCORE")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(TLTheme.textSecondary)
                                Text("\(assessment.score)")
                                    .font(.system(size: 32, weight: .black))
                                    .foregroundColor(TLTheme.textPrimary)
                                Text(assessment.exerciseType.metricUnit.uppercased())
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(TLTheme.brandOrange)
                            }
                            .frame(maxWidth: .infinity)
                            
                            VStack(spacing: 4) {
                                Text("NATIONAL %ILE")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(TLTheme.brandOrange)
                                Text("\(Int(assessment.percentile))%")
                                    .font(.system(size: 32, weight: .black))
                                    .foregroundColor(TLTheme.brandOrange)
                                Text("SAI Standards")
                                    .font(.system(size: 10))
                                    .foregroundColor(TLTheme.textSecondary)
                            }
                            .frame(maxWidth: .infinity)
                            
                            VStack(spacing: 4) {
                                Text("FORM SCORE")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(TLTheme.verifiedEmerald)
                                Text("\(assessment.biomechanics.formScore)%")
                                    .font(.system(size: 32, weight: .black))
                                    .foregroundColor(TLTheme.verifiedEmerald)
                                Text("Precision")
                                    .font(.system(size: 10))
                                    .foregroundColor(TLTheme.textSecondary)
                            }
                            .frame(maxWidth: .infinity)
                        }
                        
                        // Sport Readiness Context Card
                        if let drill = drillInfo {
                            VStack(alignment: .leading, spacing: 6) {
                                HStack {
                                    Text("SPORT SPECIFIC READINESS")
                                        .font(.system(size: 10, weight: .bold, design: .monospaced))
                                        .foregroundColor(TLTheme.cyberCyan)
                                    Spacer()
                                    Text(drill.importanceTier)
                                        .font(.system(size: 9, weight: .bold))
                                        .foregroundColor(TLTheme.brandOrange)
                                }
                                
                                Text("Why it matters: \(drill.roleRationale)")
                                    .font(.system(size: 11))
                                    .foregroundColor(TLTheme.textPrimary)
                                
                                Text("Gym Standard: \(drill.gymTargetScore)")
                                    .font(.system(size: 10, weight: .bold, design: .monospaced))
                                    .foregroundColor(TLTheme.textSecondary)
                            }
                            .padding(12)
                            .background(TLTheme.cardBackground.opacity(0.8))
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(TLTheme.cardBorder, lineWidth: 1))
                        }
                        
                        // Talent Tier Badge
                        Text(assessment.talentTier.displayName)
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(Color(hex: assessment.talentTier.badgeColorHex))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 10)
                            .background(Color(hex: assessment.talentTier.badgeColorHex).opacity(0.15))
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: assessment.talentTier.badgeColorHex).opacity(0.4), lineWidth: 1)
                            )
                    }
                    .padding(20)
                    .background(TLTheme.cardBackground)
                    .cornerRadius(24)
                    .overlay(
                        RoundedRectangle(cornerRadius: 24)
                            .stroke(TLTheme.cardBorder, lineWidth: 1)
                    )
                    .padding(.horizontal)
                    
                    // Actions
                    VStack(spacing: 12) {
                        Button(action: { showCertificate = true }) {
                            HStack(spacing: 8) {
                                Image(systemName: "rosette")
                                    .foregroundColor(TLTheme.brandOrange)
                                Text("View & Print Official Certificate")
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(TLTheme.textPrimary)
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                            .background(TLTheme.cardBackground)
                            .cornerRadius(16)
                            .overlay(RoundedRectangle(cornerRadius: 16).stroke(TLTheme.cardBorder, lineWidth: 1))
                        }
                        
                        Button(action: {
                            isBroadcasted = true
                        }) {
                            HStack(spacing: 8) {
                                Image(systemName: isBroadcasted ? "checkmark" : "paperplane.fill")
                                Text(isBroadcasted ? "Broadcasted to Live Scouts ✓" : "Push to Live Scout Network")
                                    .font(.system(size: 15, weight: .bold))
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                            .background(TLTheme.brandOrange)
                            .foregroundColor(.white)
                            .cornerRadius(16)
                        }
                        .disabled(isBroadcasted)
                        
                        Button(action: onRetest) {
                            HStack(spacing: 8) {
                                Image(systemName: "arrow.clockwise")
                                    .foregroundColor(TLTheme.textSecondary)
                                Text("Retest / Switch Exercise Drill")
                                    .font(.system(size: 14))
                                    .foregroundColor(TLTheme.textSecondary)
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(Color.clear)
                            .overlay(RoundedRectangle(cornerRadius: 16).stroke(TLTheme.cardBorder, lineWidth: 1))
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 24)
                }
            }
        }
        .sheet(isPresented: $showCertificate) {
            CertificateModalView(
                assessment: assessment,
                onDismiss: { showCertificate = false }
            )
        }
    }
}
