//
//  ScoutFeedScreen.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public struct ScoutFeedScreen: View {
    @ObservedObject private var repository = AthleteRepository.shared
    
    @State private var searchQuery: String = ""
    @State private var selectedExerciseFilter: ExerciseType? = nil
    @State private var onlyShortlisted: Bool = false
    
    @State private var selectedForDetail: AssessmentResult? = nil
    @State private var selectedForCompare: Set<String> = []
    @State private var showComparisonSheet: Bool = false
    
    public init() {}
    
    private var filteredList: [AssessmentResult] {
        repository.assessments.filter { item in
            let matchesQuery = searchQuery.isEmpty ||
                item.athleteName.localizedCaseInsensitiveContains(searchQuery) ||
                item.state.localizedCaseInsensitiveContains(searchQuery) ||
                item.district.localizedCaseInsensitiveContains(searchQuery)
            
            let matchesEx = (selectedExerciseFilter == nil) || (item.exerciseType == selectedExerciseFilter)
            let matchesShortlist = !onlyShortlisted || item.isShortlisted
            
            return matchesQuery && matchesEx && matchesShortlist
        }
    }
    
    public var body: some View {
        ZStack {
            TLTheme.backgroundDark.edgesIgnoringSafeArea(.all)
            
            VStack(spacing: 12) {
                // Header Bar
                HStack {
                    VStack(alignment: .leading, spacing: 3) {
                        HStack(spacing: 6) {
                            Circle()
                                .fill(TLTheme.verifiedEmerald)
                                .frame(width: 8, height: 8)
                            Text("LIVE SCOUT NETWORK")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(TLTheme.verifiedEmerald)
                        }
                        
                        Text("Discovery Command Feed")
                            .font(.system(size: 22, weight: .black))
                            .foregroundColor(TLTheme.textPrimary)
                    }
                    
                    Spacer()
                    
                    // Quick Action Buttons
                    HStack(spacing: 8) {
                        ShareLink(item: repository.exportToCsvString()) {
                            Image(systemName: "arrow.down.doc.fill")
                                .foregroundColor(TLTheme.textPrimary)
                                .frame(width: 38, height: 38)
                                .background(TLTheme.cardBackground)
                                .clipShape(Circle())
                        }
                        
                        Button(action: {
                            repository.simulateIncomingLiveAssessment()
                        }) {
                            Image(systemName: "sparkles")
                                .foregroundColor(TLTheme.brandOrange)
                                .frame(width: 38, height: 38)
                                .background(TLTheme.cardBackground)
                                .clipShape(Circle())
                        }
                    }
                }
                .padding(.horizontal)
                .padding(.top, 8)
                
                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(TLTheme.textSecondary)
                    TextField("Search athlete name, state, or district...", text: $searchQuery)
                        .foregroundColor(TLTheme.textPrimary)
                }
                .padding(12)
                .background(TLTheme.cardBackground)
                .cornerRadius(16)
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(TLTheme.cardBorder, lineWidth: 1))
                .padding(.horizontal)
                
                // Exercise Filter Chips
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        Button(action: { selectedExerciseFilter = nil }) {
                            Text("All Tests")
                                .font(.system(size: 11, weight: .bold))
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(selectedExerciseFilter == nil ? TLTheme.brandOrange : TLTheme.cardBackground)
                                .foregroundColor(selectedExerciseFilter == nil ? .white : TLTheme.textSecondary)
                                .cornerRadius(12)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(selectedExerciseFilter == nil ? TLTheme.brandOrange : TLTheme.cardBorder, lineWidth: 1))
                        }
                        
                        ForEach(ExerciseType.allCases) { ex in
                            let isSelected = (selectedExerciseFilter == ex)
                            Button(action: { selectedExerciseFilter = ex }) {
                                Text(ex.shortName)
                                    .font(.system(size: 11, weight: .bold))
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(isSelected ? TLTheme.brandOrange : TLTheme.cardBackground)
                                    .foregroundColor(isSelected ? .white : TLTheme.textSecondary)
                                    .cornerRadius(12)
                                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(isSelected ? TLTheme.brandOrange : TLTheme.cardBorder, lineWidth: 1))
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                
                // Comparison Bar Trigger
                if selectedForCompare.count >= 2 {
                    Button(action: { showComparisonSheet = true }) {
                        HStack {
                            Image(systemName: "arrow.left.arrow.right")
                                .foregroundColor(TLTheme.cyberCyan)
                            Text("\(selectedForCompare.count) Athletes Selected for Comparison")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(TLTheme.textPrimary)
                            Spacer()
                            Text("View Matrix →")
                                .font(.system(size: 12, weight: .black))
                                .foregroundColor(TLTheme.cyberCyan)
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(TLTheme.cyberCyan.opacity(0.15))
                        .cornerRadius(16)
                        .overlay(RoundedRectangle(cornerRadius: 16).stroke(TLTheme.cyberCyan.opacity(0.5), lineWidth: 1))
                    }
                    .padding(.horizontal)
                }
                
                // Athletes List
                ScrollView {
                    LazyVStack(spacing: 10) {
                        ForEach(filteredList) { item in
                            let isCompared = selectedForCompare.contains(item.id)
                            
                            VStack(spacing: 10) {
                                HStack {
                                    // Checkbox for comparison
                                    Button(action: {
                                        if isCompared {
                                            selectedForCompare.remove(item.id)
                                        } else {
                                            if selectedForCompare.count < 3 {
                                                selectedForCompare.insert(item.id)
                                            }
                                        }
                                    }) {
                                        Image(systemName: isCompared ? "checkmark.square.fill" : "square")
                                            .foregroundColor(isCompared ? TLTheme.cyberCyan : TLTheme.textSecondary)
                                            .font(.title3)
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(item.athleteName)
                                            .font(.system(size: 16, weight: .bold))
                                            .foregroundColor(TLTheme.textPrimary)
                                        Text("\(item.district), \(item.state) • \(item.age)y • \(item.sport.displayName)")
                                            .font(.system(size: 11))
                                            .foregroundColor(TLTheme.textSecondary)
                                    }
                                    
                                    Spacer()
                                    
                                    Button(action: { repository.toggleShortlist(id: item.id) }) {
                                        Image(systemName: item.isShortlisted ? "bookmark.fill" : "bookmark")
                                            .foregroundColor(item.isShortlisted ? TLTheme.eliteGold : TLTheme.textSecondary)
                                            .font(.title3)
                                    }
                                }
                                
                                Divider().background(TLTheme.cardBorder)
                                
                                HStack {
                                    HStack(spacing: 12) {
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text(item.exerciseType.shortName.uppercased())
                                                .font(.system(size: 9, weight: .bold))
                                                .foregroundColor(TLTheme.textSecondary)
                                            Text("\(item.score) \(item.exerciseType.metricUnit)")
                                                .font(.system(size: 16, weight: .black))
                                                .foregroundColor(TLTheme.textPrimary)
                                        }
                                        
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text("PERCENTILE")
                                                .font(.system(size: 9, weight: .bold))
                                                .foregroundColor(TLTheme.brandOrange)
                                            Text("\(Int(item.percentile))%")
                                                .font(.system(size: 16, weight: .black))
                                                .foregroundColor(TLTheme.brandOrange)
                                        }
                                        
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text("FORM")
                                                .font(.system(size: 9, weight: .bold))
                                                .foregroundColor(TLTheme.verifiedEmerald)
                                            Text("\(item.biomechanics.formScore)%")
                                                .font(.system(size: 16, weight: .black))
                                                .foregroundColor(TLTheme.verifiedEmerald)
                                        }
                                    }
                                    
                                    Spacer()
                                    
                                    Text(item.talentTier.displayName.components(separatedBy: " (").first ?? item.talentTier.displayName)
                                        .font(.system(size: 10, weight: .bold))
                                        .foregroundColor(Color(hex: item.talentTier.badgeColorHex))
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(Color(hex: item.talentTier.badgeColorHex).opacity(0.15))
                                        .cornerRadius(8)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 8)
                                                .stroke(Color(hex: item.talentTier.badgeColorHex).opacity(0.4), lineWidth: 1)
                                        )
                                }
                            }
                            .padding(16)
                            .background(isCompared ? TLTheme.cardBackground.opacity(0.9) : TLTheme.cardBackground)
                            .cornerRadius(20)
                            .overlay(
                                RoundedRectangle(cornerRadius: 20)
                                    .stroke(isCompared ? TLTheme.cyberCyan : TLTheme.cardBorder, lineWidth: 1)
                            )
                            .onTapGesture {
                                selectedForDetail = item
                            }
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 24)
                }
            }
        }
        .sheet(item: $selectedForDetail) { assessment in
            AthleteDetailModalView(
                assessment: assessment,
                onDismiss: { selectedForDetail = nil },
                onToggleShortlist: { repository.toggleShortlist(id: assessment.id) }
            )
        }
        .sheet(isPresented: $showComparisonSheet) {
            let comparedItems = repository.assessments.filter { selectedForCompare.contains($0.id) }
            AthleteComparisonModalView(
                athletes: comparedItems,
                onDismiss: {
                    showComparisonSheet = false
                    selectedForCompare.removeAll()
                }
            )
        }
    }
}
