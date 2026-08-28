package com.talentlens.app.model

import java.util.UUID

enum class Gender(val displayName: String) {
    MALE("Male"),
    FEMALE("Female"),
    OTHER("Other")
}

enum class SportType(val displayName: String) {
    ATHLETICS("Athletics (Sprint/Jump)"),
    FOOTBALL("Football"),
    KABADDI("Kabaddi"),
    WRESTLING("Wrestling"),
    BOXING("Boxing"),
    CRICKET("Cricket"),
    HOCKEY("Hockey"),
    BADMINTON("Badminton"),
    WEIGHTLIFTING("Weightlifting"),
    GENERAL("Multi-Sport / General")
}

enum class ExerciseType(
    val id: String,
    val title: String,
    val shortName: String,
    val category: String,
    val metricUnit: String,
    val instructions: List<String>
) {
    PUSHUPS(
        id = "pushups_standard",
        title = "Standard Push-Ups",
        shortName = "Push-Ups",
        category = "Upper Body",
        metricUnit = "reps",
        instructions = listOf(
            "Position camera sideways with full body in view.",
            "Maintain straight plank alignment (155°-185°).",
            "Lower chest until elbows flex to 90° depth.",
            "Push up to full arm lockout (>155°) to count rep."
        )
    ),
    SQUATS(
        id = "squats_standard",
        title = "Deep Bodyweight Squats",
        shortName = "Squats",
        category = "Lower Body",
        metricUnit = "reps",
        instructions = listOf(
            "Stand facing 45° to the camera.",
            "Feet shoulder-width apart.",
            "Descend until hip crease is below knee level (knee <= 90°).",
            "Stand upright with hips fully extended (>160°)."
        )
    ),
    PLANK(
        id = "plank_hold",
        title = "Isometric Plank Hold",
        shortName = "Plank",
        category = "Core",
        metricUnit = "sec",
        instructions = listOf(
            "Assume forearm plank position in profile.",
            "Keep shoulders, hips, and ankles in a straight line.",
            "Avoid sagging hips (<145°) or piking (>200°).",
            "Hold posture as long as possible until failure."
        )
    ),
    VERTICAL_JUMP(
        id = "vertical_jump",
        title = "Vertical Jump Power",
        shortName = "Vert Jump",
        category = "Power",
        metricUnit = "cm",
        instructions = listOf(
            "Stand 6-8 feet away in clear view.",
            "Perform countermovement squat dip.",
            "Explode straight up with maximum vertical power.",
            "AI calculates flight hang time to compute height."
        )
    )
}

enum class TalentTier(val displayName: String, val badgeColorHex: Long) {
    NATIONAL_ELITE("National Elite Prospect (Top 5%)", 0xFFF59E0B),
    STATE_CONTENDER("State Level Contender (Top 15%)", 0xFFFF4D00),
    DISTRICT_PERFORMER("District High Performer (Top 30%)", 0xFF00F0FF),
    ACTIVE_CLUB("Active Club Athlete (Top 50%)", 0xFF10B981),
    DEVELOPING("Developing Talent (Base Tier)", 0xFF94A3B8)
}

data class AthleteProfile(
    val id: String = "ath_${System.currentTimeMillis()}",
    val fullName: String = "Aarav Sharma",
    val age: Int = 17,
    val gender: Gender = Gender.MALE,
    val primarySport: SportType = SportType.WRESTLING,
    val state: String = "Haryana",
    val district: String = "Sonipat",
    val schoolOrAcademy: String = "Sonipat Sports Excellence Akhada",
    val phone: String = "+91 98765 00000"
)

data class BiomechanicsData(
    val averageElbowFlexion: Float = 80f,
    val averageKneeFlexion: Float = 85f,
    val averageTrunkAlignment: Float = 174f,
    val formScore: Int = 95,
    val incompletedReps: Int = 0,
    val cadenceRpm: Float = 42f,
    val peakSpeedSec: Float = 1.0f,
    val jumpHeightCm: Float = 0f,
    val flightTimeSec: Float = 0f
)

data class AssessmentResult(
    val id: String = "ass_${System.currentTimeMillis()}",
    val athleteId: String,
    val athleteName: String,
    val age: Int,
    val gender: Gender,
    val state: String,
    val district: String,
    val sport: SportType,
    val exerciseType: ExerciseType,
    val score: Int,
    val durationSeconds: Int,
    val percentile: Float,
    val talentTier: TalentTier,
    val biomechanics: BiomechanicsData,
    val verificationHash: String,
    val verifiedAt: Long = System.currentTimeMillis(),
    val scoutNotes: List<String> = emptyList(),
    val isShortlisted: Boolean = false
)
