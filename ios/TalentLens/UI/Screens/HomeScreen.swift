//
//  HomeScreen.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public struct HomeScreen: View {
    public let onStartAthleteAssessment: () -> Void
    public let onOpenScoutDashboard: () -> Void
    
    public init(
        onStartAthleteAssessment: @escaping () -> Void,
        onOpenScoutDashboard: @escaping () -> Void
    ) {
        self.onStartAthleteAssessment = onStartAthleteAssessment
        self.onOpenScoutDashboard = onOpenScoutDashboard
    }
    
    public var body: some View {
        ZStack {
            TLTheme.backgroundDark.edgesIgnoringSafeArea(.all)
            
            ScrollView {
                VStack(spacing: 20) {
                    Spacer().frame(height: 10)
                    
                    // Brand Title
                    Text("TALENTLENS")
                        .font(.system(size: 32, weight: .black))
                        .foregroundColor(TLTheme.brandOrange)
                        .kerning(4.0)
                    
                    Text("Discover Talent,\nWherever It's Hiding.")
                        .font(.system(size: 28, weight: .heavy))
                        .foregroundColor(TLTheme.textPrimary)
                        .multilineTextAlignment(.center)
                        .lineSpacing(4)
                    
                    Text("Turn your iPhone camera into an Olympic-grade AI athletic testing lab. On-device Apple Vision pose estimation verifies biomechanics and benchmarks scores against national Indian percentiles.")
                        .font(.system(size: 13))
                        .foregroundColor(TLTheme.textSecondary)
                        .multilineTextAlignment(.center)
                        .lineSpacing(3)
                        .padding(.horizontal, 16)
                    
                    Spacer().frame(height: 4)
                    
                    // Dual Entry Cards
                    // 1. Athlete Card
                    Button(action: onStartAthleteAssessment) {
                        HStack(spacing: 16) {
                            ZStack {
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(TLTheme.brandOrange)
                                    .frame(width: 54, height: 54)
                                Image(systemName: "figure.cross.training")
                                    .foregroundColor(.white)
                                    .font(.title2)
                            }
                            
                            VStack(alignment: .leading, spacing: 3) {
                                Text("I'M AN ATHLETE")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(TLTheme.brandOrange)
                                Text("Test Physical Fitness")
                                    .font(.system(size: 18, weight: .heavy))
                                    .foregroundColor(TLTheme.textPrimary)
                                Text("Push-ups, Squats, Plank & Vert Jump")
                                    .font(.system(size: 11))
                                    .foregroundColor(TLTheme.textSecondary)
                            }
                            
                            Spacer()
                            
                            Image(systemName: "arrow.right")
                                .foregroundColor(TLTheme.brandOrange)
                                .font(.system(size: 16, weight: .bold))
                        }
                        .padding(20)
                        .background(TLTheme.cardBackground)
                        .cornerRadius(24)
                        .overlay(
                            RoundedRectangle(cornerRadius: 24)
                                .stroke(TLTheme.brandOrange.opacity(0.6), lineWidth: 1.5)
                        )
                    }
                    .padding(.horizontal)
                    
                    // 2. Scout Card
                    Button(action: onOpenScoutDashboard) {
                        HStack(spacing: 16) {
                            ZStack {
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(TLTheme.cyberCyan.opacity(0.15))
                                    .frame(width: 54, height: 54)
                                Image(systemName: "person.3.fill")
                                    .foregroundColor(TLTheme.cyberCyan)
                                    .font(.title3)
                            }
                            
                            VStack(alignment: .leading, spacing: 3) {
                                Text("I'M A SCOUT / COACH")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(TLTheme.cyberCyan)
                                Text("Scout Discovery Feed")
                                    .font(.system(size: 18, weight: .heavy))
                                    .foregroundColor(TLTheme.textPrimary)
                                Text("Live verified athlete stream across India")
                                    .font(.system(size: 11))
                                    .foregroundColor(TLTheme.textSecondary)
                            }
                            
                            Spacer()
                            
                            Image(systemName: "arrow.right")
                                .foregroundColor(TLTheme.textSecondary)
                                .font(.system(size: 16, weight: .bold))
                        }
                        .padding(20)
                        .background(TLTheme.cardBackground)
                        .cornerRadius(24)
                        .overlay(
                            RoundedRectangle(cornerRadius: 24)
                                .stroke(TLTheme.cardBorder, lineWidth: 1)
                        )
                    }
                    .padding(.horizontal)
                    
                    Spacer().frame(height: 6)
                    
                    // Feature Highlights Card
                    VStack(alignment: .leading, spacing: 12) {
                        HStack(spacing: 10) {
                            Image(systemName: "bolt.fill")
                                .foregroundColor(TLTheme.brandOrange)
                                .font(.system(size: 14))
                            Text("100% On-Device Apple Neural Engine Inference")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(TLTheme.textPrimary)
                        }
                        
                        HStack(spacing: 10) {
                            Image(systemName: "checkmark.seal.fill")
                                .foregroundColor(TLTheme.verifiedEmerald)
                                .font(.system(size: 14))
                            Text("SAI & Khelo India Aligned Age Cohort Percentiles")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(TLTheme.textPrimary)
                        }
                        
                        HStack(spacing: 10) {
                            Image(systemName: "speaker.wave.3.fill")
                                .foregroundColor(TLTheme.cyberCyan)
                                .font(.system(size: 14))
                            Text("Real-Time AI Voice Coach Audio Feedback")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(TLTheme.textPrimary)
                        }
                    }
                    .padding(18)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(TLTheme.cardBackground)
                    .cornerRadius(20)
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(TLTheme.cardBorder, lineWidth: 1)
                    )
                    .padding(.horizontal)
                    .padding(.bottom, 24)
                }
            }
        }
    }
}
