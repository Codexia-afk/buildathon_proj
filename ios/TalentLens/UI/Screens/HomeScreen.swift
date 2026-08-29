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
                VStack(spacing: 18) {
                    Spacer().frame(height: 6)
                    
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
                    
                    Text("Turn your iPhone camera into an Olympic-grade AI athletic testing lab. Choose your sport to see tailored gym practice drills, real-time pose tracking, and national percentiles.")
                        .font(.system(size: 13))
                        .foregroundColor(TLTheme.textSecondary)
                        .multilineTextAlignment(.center)
                        .lineSpacing(3)
                        .padding(.horizontal, 16)
                    
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
                                Text("Sport Gym Lab & Test")
                                    .font(.system(size: 18, weight: .heavy))
                                    .foregroundColor(TLTheme.textPrimary)
                                Text("Cricket, Wrestling, Football, Badminton & More")
                                    .font(.system(size: 11))
                                    .foregroundColor(TLTheme.textSecondary)
                            }
                            
                            Spacer()
                            
                            Image(systemName: "arrow.right")
                                .foregroundColor(TLTheme.brandOrange)
                                .font(.system(size: 16, weight: .bold))
                        }
                        .padding(18)
                        .background(TLTheme.cardBackground)
                        .cornerRadius(22)
                        .overlay(
                            RoundedRectangle(cornerRadius: 22)
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
                        .padding(18)
                        .background(TLTheme.cardBackground)
                        .cornerRadius(22)
                        .overlay(
                            RoundedRectangle(cornerRadius: 22)
                                .stroke(TLTheme.cardBorder, lineWidth: 1)
                        )
                    }
                    .padding(.horizontal)
                    
                    // 3. Sport-Specific Gym Practice Directory
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("SPORT-SPECIFIC GYM PRACTICE BATTERIES")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(TLTheme.brandOrange)
                            Spacer()
                            Text("10 Sports")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(TLTheme.textSecondary)
                        }
                        
                        Text("Select your sport to practice the exact biomechanical qualities scouts look for:")
                            .font(.system(size: 12))
                            .foregroundColor(TLTheme.textSecondary)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 12) {
                                ForEach(SportType.allCases) { sp in
                                    let profile = SportTrainingDatabase.profile(for: sp)
                                    Button(action: onStartAthleteAssessment) {
                                        VStack(alignment: .leading, spacing: 8) {
                                            HStack {
                                                Text(sp.iconEmoji)
                                                    .font(.title2)
                                                Text(sp.displayName.components(separatedBy: " (").first ?? sp.displayName)
                                                    .font(.system(size: 14, weight: .bold))
                                                    .foregroundColor(TLTheme.textPrimary)
                                                Spacer()
                                                Image(systemName: "chevron.right")
                                                    .foregroundColor(TLTheme.textSecondary)
                                                    .font(.caption)
                                            }
                                            
                                            Text(profile.tagline)
                                                .font(.system(size: 11))
                                                .foregroundColor(TLTheme.textSecondary)
                                                .lineLimit(2)
                                                .frame(height: 32, alignment: .topLeading)
                                            
                                            Divider().background(TLTheme.cardBorder)
                                            
                                            HStack(spacing: 6) {
                                                ForEach(profile.recommendedDrills.prefix(3)) { drill in
                                                    Text(drill.exerciseType.shortName)
                                                        .font(.system(size: 9, weight: .bold))
                                                        .padding(.horizontal, 6)
                                                        .padding(.vertical, 3)
                                                        .background(TLTheme.brandOrange.opacity(0.15))
                                                        .foregroundColor(TLTheme.brandOrange)
                                                        .cornerRadius(6)
                                                }
                                            }
                                        }
                                        .padding(14)
                                        .frame(width: 220)
                                        .background(TLTheme.cardBackground)
                                        .cornerRadius(16)
                                        .overlay(RoundedRectangle(cornerRadius: 16).stroke(TLTheme.cardBorder, lineWidth: 1))
                                    }
                                }
                            }
                        }
                    }
                    .padding(16)
                    .background(TLTheme.cardBackground.opacity(0.6))
                    .cornerRadius(20)
                    .overlay(RoundedRectangle(cornerRadius: 20).stroke(TLTheme.cardBorder, lineWidth: 1))
                    .padding(.horizontal)
                    
                    // Feature Highlights Card
                    VStack(alignment: .leading, spacing: 10) {
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
                    .padding(16)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(TLTheme.cardBackground)
                    .cornerRadius(18)
                    .overlay(RoundedRectangle(cornerRadius: 18).stroke(TLTheme.cardBorder, lineWidth: 1))
                    .padding(.horizontal)
                    .padding(.bottom, 20)
                }
            }
        }
    }
}
