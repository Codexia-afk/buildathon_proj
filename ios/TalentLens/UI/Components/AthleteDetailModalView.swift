//
//  AthleteDetailModalView.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public struct AthleteDetailModalView: View {
    public let assessment: AssessmentResult
    public let onDismiss: () -> Void
    public let onToggleShortlist: () -> Void
    
    @ObservedObject private var repository = AthleteRepository.shared
    @State private var noteInput: String = ""
    @State private var inviteSent: Bool = false
    
    public init(
        assessment: AssessmentResult,
        onDismiss: @escaping () -> Void,
        onToggleShortlist: @escaping () -> Void
    ) {
        self.assessment = assessment
        self.onDismiss = onDismiss
        self.onToggleShortlist = onToggleShortlist
    }
    
    private var liveAssessment: AssessmentResult {
        repository.assessments.first(where: { $0.id == assessment.id }) ?? assessment
    }
    
    public var body: some View {
        ZStack {
            TLTheme.backgroundDark.edgesIgnoringSafeArea(.all)
            
            ScrollView {
                VStack(spacing: 16) {
                    // Header
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(liveAssessment.athleteName)
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(TLTheme.textPrimary)
                            Text("\(liveAssessment.sport.displayName) • \(liveAssessment.district), \(liveAssessment.state)")
                                .font(.system(size: 13))
                                .foregroundColor(TLTheme.textSecondary)
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
                    
                    Divider().background(TLTheme.cardBorder).padding(.horizontal)
                    
                    // 3-Metric KPI Grid
                    HStack(spacing: 8) {
                        VStack(spacing: 4) {
                            Text("PERCENTILE")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(TLTheme.brandOrange)
                            Text("\(Int(liveAssessment.percentile))%")
                                .font(.system(size: 22, weight: .black))
                                .foregroundColor(TLTheme.brandOrange)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(TLTheme.cardBackground)
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(TLTheme.cardBorder, lineWidth: 1))
                        
                        VStack(spacing: 4) {
                            Text("SCORE")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(TLTheme.textSecondary)
                            Text("\(liveAssessment.score) \(liveAssessment.exerciseType.metricUnit)")
                                .font(.system(size: 22, weight: .black))
                                .foregroundColor(TLTheme.textPrimary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(TLTheme.cardBackground)
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(TLTheme.cardBorder, lineWidth: 1))
                        
                        VStack(spacing: 4) {
                            Text("FORM")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(TLTheme.verifiedEmerald)
                            Text("\(liveAssessment.biomechanics.formScore)%")
                                .font(.system(size: 22, weight: .black))
                                .foregroundColor(TLTheme.verifiedEmerald)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(TLTheme.cardBackground)
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(TLTheme.cardBorder, lineWidth: 1))
                    }
                    .padding(.horizontal)
                    
                    // Biomechanics Breakdown
                    VStack(alignment: .leading, spacing: 10) {
                        Text("AI BIOMECHANICAL REPORT")
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundColor(TLTheme.cyberCyan)
                        
                        HStack {
                            Text("Average Joint Flexion:")
                                .font(.system(size: 13))
                                .foregroundColor(TLTheme.textSecondary)
                            Spacer()
                            Text("\(Int(liveAssessment.biomechanics.averageElbowFlexion))° (Target 90°)")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(TLTheme.textPrimary)
                        }
                        
                        HStack {
                            Text("Spine Alignment:")
                                .font(.system(size: 13))
                                .foregroundColor(TLTheme.textSecondary)
                            Spacer()
                            Text("\(Int(liveAssessment.biomechanics.averageTrunkAlignment))° (Neutral)")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(TLTheme.textPrimary)
                        }
                        
                        HStack {
                            Text("Cadence / Velocity:")
                                .font(.system(size: 13))
                                .foregroundColor(TLTheme.textSecondary)
                            Spacer()
                            Text("\(Int(liveAssessment.biomechanics.cadenceRpm)) RPM")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(TLTheme.textPrimary)
                        }
                    }
                    .padding(16)
                    .background(TLTheme.cardBackground)
                    .cornerRadius(16)
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(TLTheme.cardBorder, lineWidth: 1))
                    .padding(.horizontal)
                    
                    // Action Buttons (Shortlist & Invite)
                    HStack(spacing: 10) {
                        Button(action: onToggleShortlist) {
                            HStack {
                                Image(systemName: liveAssessment.isShortlisted ? "bookmark.fill" : "bookmark")
                                    .foregroundColor(liveAssessment.isShortlisted ? TLTheme.eliteGold : TLTheme.textSecondary)
                                Text(liveAssessment.isShortlisted ? "Shortlisted" : "Bookmark")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(liveAssessment.isShortlisted ? TLTheme.eliteGold : TLTheme.textSecondary)
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 48)
                            .background(liveAssessment.isShortlisted ? TLTheme.eliteGold.opacity(0.15) : TLTheme.cardBackground)
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(liveAssessment.isShortlisted ? TLTheme.eliteGold : TLTheme.cardBorder, lineWidth: 1))
                        }
                        
                        Button(action: { inviteSent = true }) {
                            HStack {
                                Image(systemName: "paperplane.fill")
                                Text(inviteSent ? "Invite Sent ✓" : "Invite for Trials")
                                    .font(.system(size: 13, weight: .bold))
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 48)
                            .background(TLTheme.brandOrange)
                            .foregroundColor(.white)
                            .cornerRadius(12)
                        }
                        .disabled(inviteSent)
                    }
                    .padding(.horizontal)
                    
                    // Scout Evaluation Notes
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Scout Evaluation Notes")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(TLTheme.textSecondary)
                        
                        HStack {
                            TextField("Add scout observation...", text: $noteInput)
                                .padding(10)
                                .background(TLTheme.cardBackground)
                                .foregroundColor(TLTheme.textPrimary)
                                .cornerRadius(10)
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(TLTheme.cardBorder, lineWidth: 1))
                            
                            Button(action: {
                                if !noteInput.trimmingCharacters(in: .whitespaces).isEmpty {
                                    repository.addScoutNote(id: liveAssessment.id, note: noteInput.trimmingCharacters(in: .whitespaces))
                                    noteInput = ""
                                }
                            }) {
                                Text("Add")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(TLTheme.textPrimary)
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 10)
                                    .background(TLTheme.cardBackground)
                                    .cornerRadius(10)
                                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(TLTheme.cardBorder, lineWidth: 1))
                            }
                        }
                        
                        ForEach(liveAssessment.scoutNotes, id: \.self) { note in
                            Text("• \(note)")
                                .font(.system(size: 12))
                                .foregroundColor(TLTheme.textSecondary)
                                .padding(10)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(TLTheme.cardBackground.opacity(0.6))
                                .cornerRadius(8)
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 24)
                }
            }
        }
    }
}
