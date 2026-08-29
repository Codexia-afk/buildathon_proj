//
//  ProfileSetupModalView.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public let INDIAN_STATES_LIST = [
    "Haryana", "Kerala", "Punjab", "Maharashtra", "Odisha", "Manipur",
    "Tamil Nadu", "Karnataka", "Assam", "Telangana", "Uttar Pradesh",
    "Rajasthan", "Gujarat", "Madhya Pradesh", "West Bengal", "Jharkhand"
]

public struct ProfileSetupModalView: View {
    @Binding public var currentProfile: AthleteProfile
    public let onDismiss: () -> Void
    public let onSave: (AthleteProfile) -> Void
    
    @State private var name: String = ""
    @State private var age: String = ""
    @State private var gender: Gender = .male
    @State private var sport: SportType = .wrestling
    @State private var state: String = "Haryana"
    @State private var district: String = "Sonipat"
    @State private var academy: String = ""
    
    public init(
        currentProfile: Binding<AthleteProfile>,
        onDismiss: @escaping () -> Void,
        onSave: @escaping (AthleteProfile) -> Void
    ) {
        self._currentProfile = currentProfile
        self.onDismiss = onDismiss
        self.onSave = onSave
    }
    
    public var body: some View {
        ZStack {
            TLTheme.backgroundDark.edgesIgnoringSafeArea(.all)
            
            ScrollView {
                VStack(spacing: 16) {
                    // Header
                    HStack {
                        HStack(spacing: 8) {
                            Image(systemName: "person.crop.circle.fill")
                                .foregroundColor(TLTheme.brandOrange)
                                .font(.title3)
                            Text("Athlete Profile")
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
                    
                    Divider().background(TLTheme.cardBorder).padding(.horizontal)
                    
                    // Full Name
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Full Name")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(TLTheme.textSecondary)
                        TextField("Athlete Name", text: $name)
                            .padding(12)
                            .background(TLTheme.cardBackground)
                            .foregroundColor(TLTheme.textPrimary)
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(TLTheme.cardBorder, lineWidth: 1))
                    }
                    .padding(.horizontal)
                    
                    // Age & District
                    HStack(spacing: 10) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Age (Yrs)")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(TLTheme.textSecondary)
                            TextField("17", text: $age)
                                .keyboardType(.numberPad)
                                .padding(12)
                                .background(TLTheme.cardBackground)
                                .foregroundColor(TLTheme.textPrimary)
                                .cornerRadius(12)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(TLTheme.cardBorder, lineWidth: 1))
                        }
                        
                        VStack(alignment: .leading, spacing: 6) {
                            Text("District")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(TLTheme.textSecondary)
                            TextField("District", text: $district)
                                .padding(12)
                                .background(TLTheme.cardBackground)
                                .foregroundColor(TLTheme.textPrimary)
                                .cornerRadius(12)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(TLTheme.cardBorder, lineWidth: 1))
                        }
                    }
                    .padding(.horizontal)
                    
                    // Gender
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Gender")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(TLTheme.textSecondary)
                        
                        HStack(spacing: 8) {
                            ForEach([Gender.male, Gender.female]) { g in
                                let isSelected = (g == gender)
                                Button(action: { gender = g }) {
                                    Text(g.displayName)
                                        .font(.system(size: 13, weight: .bold))
                                        .frame(maxWidth: .infinity)
                                        .frame(height: 42)
                                        .background(isSelected ? TLTheme.brandOrange : TLTheme.cardBackground)
                                        .foregroundColor(isSelected ? .white : TLTheme.textSecondary)
                                        .cornerRadius(12)
                                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(isSelected ? TLTheme.brandOrange : TLTheme.cardBorder, lineWidth: 1))
                                }
                            }
                        }
                    }
                    .padding(.horizontal)
                    
                    // State / Territory Carousel
                    VStack(alignment: .leading, spacing: 8) {
                        Text("State / Territory")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(TLTheme.textSecondary)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(INDIAN_STATES_LIST, id: \.self) { st in
                                    let isSelected = (st == state)
                                    Button(action: { state = st }) {
                                        Text(st)
                                            .font(.system(size: 12, weight: .bold))
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 8)
                                            .background(isSelected ? TLTheme.brandOrange.opacity(0.2) : TLTheme.cardBackground)
                                            .foregroundColor(isSelected ? TLTheme.brandOrange : TLTheme.textSecondary)
                                            .cornerRadius(10)
                                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(isSelected ? TLTheme.brandOrange : TLTheme.cardBorder, lineWidth: 1))
                                    }
                                }
                            }
                        }
                    }
                    .padding(.horizontal)
                    
                    // Sport Discipline Carousel
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Primary Sport Discipline")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(TLTheme.textSecondary)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(SportType.allCases) { sp in
                                    let isSelected = (sp == sport)
                                    Button(action: { sport = sp }) {
                                        Text(sp.displayName)
                                            .font(.system(size: 12, weight: .bold))
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 8)
                                            .background(isSelected ? TLTheme.cyberCyan.opacity(0.2) : TLTheme.cardBackground)
                                            .foregroundColor(isSelected ? TLTheme.cyberCyan : TLTheme.textSecondary)
                                            .cornerRadius(10)
                                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(isSelected ? TLTheme.cyberCyan : TLTheme.cardBorder, lineWidth: 1))
                                    }
                                }
                            }
                        }
                    }
                    .padding(.horizontal)
                    
                    // Academy
                    VStack(alignment: .leading, spacing: 6) {
                        Text("School / Academy / Akhada")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(TLTheme.textSecondary)
                        TextField("Academy Name", text: $academy)
                            .padding(12)
                            .background(TLTheme.cardBackground)
                            .foregroundColor(TLTheme.textPrimary)
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(TLTheme.cardBorder, lineWidth: 1))
                    }
                    .padding(.horizontal)
                    
                    // Save Button
                    Button(action: {
                        let updated = AthleteProfile(
                            id: currentProfile.id,
                            fullName: name.trimmingCharacters(in: .whitespaces).isEmpty ? "Athlete" : name.trimmingCharacters(in: .whitespaces),
                            age: Int(age) ?? 17,
                            gender: gender,
                            primarySport: sport,
                            state: state,
                            district: district.trimmingCharacters(in: .whitespaces).isEmpty ? "District" : district.trimmingCharacters(in: .whitespaces),
                            schoolOrAcademy: academy.trimmingCharacters(in: .whitespaces),
                            phone: currentProfile.phone
                        )
                        onSave(updated)
                    }) {
                        Text("Save & Set Active Profile")
                            .font(.system(size: 15, weight: .bold))
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
        .onAppear {
            self.name = currentProfile.fullName
            self.age = "\(currentProfile.age)"
            self.gender = currentProfile.gender
            self.sport = currentProfile.primarySport
            self.state = currentProfile.state
            self.district = currentProfile.district
            self.academy = currentProfile.schoolOrAcademy
        }
    }
}
