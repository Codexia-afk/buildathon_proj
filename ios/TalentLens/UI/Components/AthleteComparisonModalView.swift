//
//  AthleteComparisonModalView.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public struct AthleteComparisonModalView: View {
    public let athletes: [AssessmentResult]
    public let onDismiss: () -> Void
    
    public init(athletes: [AssessmentResult], onDismiss: @escaping () -> Void) {
        self.athletes = athletes
        self.onDismiss = onDismiss
    }
    
    private var shareText: String {
        let text = athletes.map { a in
            "\(a.athleteName) (\(a.state)) | \(a.sport.displayName) | Score: \(a.score) | National %ile: \(Int(a.percentile))% | Form: \(a.biomechanics.formScore)%"
        }.joined(separator: "\n\n")
        return "TalentLens Comparison Matrix:\n\n\(text)"
    }
    
    public var body: some View {
        ZStack {
            TLTheme.backgroundDark.edgesIgnoringSafeArea(.all)
            
            ScrollView {
                VStack(spacing: 16) {
                    // Header
                    HStack {
                        HStack(spacing: 8) {
                            Image(systemName: "arrow.left.arrow.right")
                                .foregroundColor(TLTheme.cyberCyan)
                            Text("Head-to-Head Comparison")
                                .font(.system(size: 18, weight: .bold))
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
                    
                    Text("Comparing \(athletes.count) shortlisted prospects side-by-side")
                        .font(.system(size: 11, design: .monospaced))
                        .foregroundColor(TLTheme.textSecondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal)
                    
                    Divider().background(TLTheme.cardBorder).padding(.horizontal)
                    
                    // Side-by-Side Cards
                    HStack(alignment: .top, spacing: 10) {
                        ForEach(athletes) { a in
                            VStack(alignment: .leading, spacing: 8) {
                                Text(a.athleteName)
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(TLTheme.textPrimary)
                                    .lineLimit(1)
                                
                                Text("\(a.district), \(a.state)")
                                    .font(.system(size: 10))
                                    .foregroundColor(TLTheme.textSecondary)
                                
                                Text(a.sport.displayName)
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(TLTheme.cyberCyan)
                                    .lineLimit(1)
                                
                                Divider().background(TLTheme.cardBorder)
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("SCORE")
                                        .font(.system(size: 9, weight: .bold))
                                        .foregroundColor(TLTheme.textSecondary)
                                    Text("\(a.score) \(a.exerciseType.metricUnit)")
                                        .font(.system(size: 16, weight: .black))
                                        .foregroundColor(TLTheme.textPrimary)
                                }
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("PERCENTILE")
                                        .font(.system(size: 9, weight: .bold))
                                        .foregroundColor(TLTheme.brandOrange)
                                    Text("\(Int(a.percentile))%")
                                        .font(.system(size: 16, weight: .black))
                                        .foregroundColor(TLTheme.brandOrange)
                                }
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("FORM")
                                        .font(.system(size: 9, weight: .bold))
                                        .foregroundColor(TLTheme.verifiedEmerald)
                                    Text("\(a.biomechanics.formScore)%")
                                        .font(.system(size: 16, weight: .black))
                                        .foregroundColor(TLTheme.verifiedEmerald)
                                }
                            }
                            .padding(12)
                            .frame(maxWidth: .infinity)
                            .background(TLTheme.cardBackground)
                            .cornerRadius(16)
                            .overlay(RoundedRectangle(cornerRadius: 16).stroke(TLTheme.cardBorder, lineWidth: 1))
                        }
                    }
                    .padding(.horizontal)
                    
                    // Share Comparison Link
                    ShareLink(item: shareText) {
                        HStack {
                            Image(systemName: "square.and.arrow.up.fill")
                            Text("Share Comparison Report")
                                .fontWeight(.bold)
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(TLTheme.brandOrange)
                        .foregroundColor(.white)
                        .cornerRadius(14)
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 24)
                }
            }
        }
    }
}
