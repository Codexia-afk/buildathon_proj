//
//  Colors.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public extension Color {
    init(hex: UInt, alpha: Double = 1.0) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xff) / 255,
            green: Double((hex >> 08) & 0xff) / 255,
            blue: Double((hex >> 00) & 0xff) / 255,
            opacity: alpha
        )
    }
}

public struct TLTheme {
    public static let brandOrange = Color(hex: 0xFFFF4D00)
    public static let brandOrangeLight = Color(hex: 0xFFFF6E2E)
    public static let cyberCyan = Color(hex: 0xFF00F0FF)
    public static let verifiedEmerald = Color(hex: 0xFF10B981)
    public static let eliteGold = Color(hex: 0xFFF59E0B)
    
    public static let backgroundDark = Color(hex: 0xFF070A11)
    public static let cardBackground = Color(hex: 0xFF0F172A)
    public static let cardBorder = Color(hex: 0xFF1E293B)
    public static let textPrimary = Color(hex: 0xFFF8FAFC)
    public static let textSecondary = Color(hex: 0xFF94A3B8)
}
