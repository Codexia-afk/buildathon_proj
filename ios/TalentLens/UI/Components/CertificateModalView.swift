//
//  CertificateModalView.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public struct CertificateModalView: View {
    public let assessment: AssessmentResult
    public let onDismiss: () -> Void
    
    public init(assessment: AssessmentResult, onDismiss: @escaping () -> Void) {
        self.assessment = assessment
        self.onDismiss = onDismiss
    }
    
    private var shareText: String {
        "TalentLens Verified Certificate: \(assessment.athleteName) achieved \(Int(assessment.percentile))th national percentile in \(assessment.exerciseType.title)! Hash: \(assessment.verificationHash)"
    }
    
    public var body: some View {
        ZStack {
            TLTheme.backgroundDark.edgesIgnoringSafeArea(.all)
            
            ScrollView {
                VStack(spacing: 20) {
                    // Header Bar
                    HStack {
                        HStack(spacing: 8) {
                            Image(systemName: "checkmark.seal.fill")
                                .foregroundColor(TLTheme.verifiedEmerald)
                                .font(.title3)
                            Text("OFFICIAL CREDENTIAL")
                                .font(.system(size: 13, weight: .bold, design: .monospaced))
                                .foregroundColor(TLTheme.textPrimary)
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
                    
                    // Certificate Border Box
                    VStack(spacing: 16) {
                        VStack(spacing: 4) {
                            Text("TALENTLENS PROTOCOL")
                                .font(.system(size: 20, weight: .black))
                                .foregroundColor(TLTheme.brandOrange)
                                .kerning(2.0)
                            
                            Text("National Sports Talent Assessment Certificate")
                                .font(.system(size: 12))
                                .foregroundColor(TLTheme.textSecondary)
                        }
                        
                        Divider().background(TLTheme.cardBorder)
                        
                        VStack(spacing: 4) {
                            Text(assessment.athleteName.uppercased())
                                .font(.system(size: 22, weight: .black))
                                .foregroundColor(TLTheme.textPrimary)
                                .multilineTextAlignment(.center)
                            
                            Text("\(assessment.district), \(assessment.state) • \(assessment.age) Yrs • \(assessment.sport.displayName)")
                                .font(.system(size: 13))
                                .foregroundColor(TLTheme.textSecondary)
                        }
                        
                        // 3 KPIs
                        HStack {
                            VStack(spacing: 4) {
                                Text("SCORE")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(TLTheme.textSecondary)
                                Text("\(assessment.score) \(assessment.exerciseType.metricUnit)")
                                    .font(.system(size: 22, weight: .black))
                                    .foregroundColor(TLTheme.textPrimary)
                            }
                            .frame(maxWidth: .infinity)
                            
                            VStack(spacing: 4) {
                                Text("PERCENTILE")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(TLTheme.brandOrange)
                                Text("\(Int(assessment.percentile))%")
                                    .font(.system(size: 22, weight: .black))
                                    .foregroundColor(TLTheme.brandOrange)
                            }
                            .frame(maxWidth: .infinity)
                            
                            VStack(spacing: 4) {
                                Text("FORM QUALITY")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(TLTheme.verifiedEmerald)
                                Text("\(assessment.biomechanics.formScore)%")
                                    .font(.system(size: 22, weight: .black))
                                    .foregroundColor(TLTheme.verifiedEmerald)
                            }
                            .frame(maxWidth: .infinity)
                        }
                        .padding(.vertical, 8)
                        
                        // Tier Badge
                        Text(assessment.talentTier.displayName)
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(Color(hex: assessment.talentTier.badgeColorHex))
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(Color(hex: assessment.talentTier.badgeColorHex).opacity(0.15))
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: assessment.talentTier.badgeColorHex).opacity(0.4), lineWidth: 1)
                            )
                        
                        Text("Verification Hash: \(assessment.verificationHash)")
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(TLTheme.textSecondary)
                    }
                    .padding(20)
                    .background(TLTheme.cardBackground)
                    .cornerRadius(20)
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(TLTheme.brandOrange.opacity(0.5), lineWidth: 1.5)
                    )
                    .padding(.horizontal)
                    
                    // Share Sheet
                    ShareLink(item: shareText) {
                        HStack {
                            Image(systemName: "square.and.arrow.up.fill")
                            Text("Share Official Credential")
                                .fontWeight(.bold)
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(TLTheme.brandOrange)
                        .foregroundColor(.white)
                        .cornerRadius(16)
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 20)
                }
            }
        }
    }
}
