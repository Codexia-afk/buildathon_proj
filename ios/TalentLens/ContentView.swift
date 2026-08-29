//
//  ContentView.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public enum AppTab: Int {
    case home = 0
    case workout = 1
    case scout = 2
    case benchmarks = 3
}

public struct ContentView: View {
    @State private var selectedTab: AppTab = .home
    @State private var currentAthlete = AthleteProfile()
    @State private var latestAssessment: AssessmentResult? = nil
    @State private var showResultScreen: Bool = false
    
    public init() {}
    
    public var body: some View {
        ZStack {
            TLTheme.backgroundDark.edgesIgnoringSafeArea(.all)
            
            if showResultScreen, let assessment = latestAssessment {
                ResultScreen(
                    assessment: assessment,
                    onRetest: {
                        showResultScreen = false
                        selectedTab = .workout
                    },
                    onNavigateToScout: {
                        showResultScreen = false
                        selectedTab = .scout
                    }
                )
            } else {
                TabView(selection: $selectedTab) {
                    HomeScreen(
                        onStartAthleteAssessment: { selectedTab = .workout },
                        onOpenScoutDashboard: { selectedTab = .scout }
                    )
                    .tabItem {
                        Label("Home", systemImage: "house.fill")
                    }
                    .tag(AppTab.home)
                    
                    WorkoutScreen(
                        athlete: $currentAthlete,
                        onProfileChange: { updated in
                            currentAthlete = updated
                            AthleteRepository.shared.updateProfile(updated)
                        },
                        onFinishWorkout: { result in
                            latestAssessment = result
                            showResultScreen = true
                        }
                    )
                    .tabItem {
                        Label("Workout Lab", systemImage: "figure.cross.training")
                    }
                    .tag(AppTab.workout)
                    
                    ScoutFeedScreen()
                        .tabItem {
                            Label("Scout Feed", systemImage: "person.3.fill")
                        }
                        .tag(AppTab.scout)
                    
                    BenchmarksScreen()
                        .tabItem {
                            Label("Standards", systemImage: "chart.bar.xaxis")
                        }
                        .tag(AppTab.benchmarks)
                }
                .accentColor(TLTheme.brandOrange)
            }
        }
    }
}
