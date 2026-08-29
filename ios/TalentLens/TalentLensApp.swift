//
//  TalentLensApp.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

@main
struct TalentLensApp: App {
    init() {
        // Configure dark appearance for TabBar and NavigationBar
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(TLTheme.cardBackground)
        
        appearance.stackedLayoutAppearance.normal.iconColor = UIColor(TLTheme.textSecondary)
        appearance.stackedLayoutAppearance.normal.titleTextAttributes = [.foregroundColor: UIColor(TLTheme.textSecondary)]
        
        appearance.stackedLayoutAppearance.selected.iconColor = UIColor(TLTheme.brandOrange)
        appearance.stackedLayoutAppearance.selected.titleTextAttributes = [.foregroundColor: UIColor(TLTheme.brandOrange)]
        
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .preferredColorScheme(.dark)
        }
    }
}
