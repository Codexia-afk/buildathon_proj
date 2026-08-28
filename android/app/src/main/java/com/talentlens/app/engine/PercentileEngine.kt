package com.talentlens.app.engine

import com.talentlens.app.model.ExerciseType
import com.talentlens.app.model.Gender
import com.talentlens.app.model.TalentTier
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

data class AgeBracketNorms(
    val minAge: Int,
    val maxAge: Int,
    val label: String,
    val maleP10: Int,
    val maleP25: Int,
    val maleP50: Int,
    val maleP75: Int,
    val maleP90: Int,
    val maleP95: Int,
    val maleP99: Int,
    val maleRecord: Int,
    val femaleP10: Int,
    val femaleP25: Int,
    val femaleP50: Int,
    val femaleP75: Int,
    val femaleP90: Int,
    val femaleP95: Int,
    val femaleP99: Int,
    val femaleRecord: Int
)

data class PercentileCalculation(
    val score: Int,
    val percentile: Float,
    val percentileRounded: Int,
    val talentTier: TalentTier,
    val bracketLabel: String,
    val medianScore: Int,
    val eliteThreshold: Int,
    val nationalRecord: Int,
    val comparisonSummary: String
)

object PercentileEngine {

    private val pushUpNorms = listOf(
        AgeBracketNorms(10, 13, "Sub-Junior (10-13y)", 4, 8, 14, 22, 30, 36, 45, 58, 2, 5, 10, 16, 23, 28, 36, 48),
        AgeBracketNorms(14, 17, "Junior (14-17y)", 10, 18, 28, 38, 48, 55, 68, 84, 5, 11, 19, 27, 36, 42, 52, 65),
        AgeBracketNorms(18, 22, "Youth / College (18-22y)", 14, 24, 35, 46, 58, 66, 80, 102, 7, 14, 22, 32, 42, 48, 60, 75),
        AgeBracketNorms(23, 30, "Senior (23-30y)", 12, 22, 33, 44, 55, 62, 76, 98, 6, 12, 20, 29, 39, 45, 56, 70),
        AgeBracketNorms(31, 99, "Masters (30+y)", 8, 16, 25, 35, 45, 52, 65, 82, 4, 9, 15, 23, 31, 37, 48, 60)
    )

    private val squatNorms = listOf(
        AgeBracketNorms(10, 13, "Sub-Junior (10-13y)", 12, 20, 30, 42, 55, 65, 80, 105, 10, 18, 28, 38, 50, 60, 75, 98),
        AgeBracketNorms(14, 17, "Junior (14-17y)", 18, 28, 42, 58, 74, 85, 105, 135, 15, 24, 36, 50, 65, 76, 95, 120),
        AgeBracketNorms(18, 22, "Youth / College (18-22y)", 22, 35, 50, 68, 86, 98, 120, 155, 18, 28, 42, 58, 74, 85, 99, 135),
        AgeBracketNorms(23, 30, "Senior (23-30y)", 20, 32, 46, 64, 80, 92, 115, 145, 16, 26, 38, 54, 68, 78, 98, 125),
        AgeBracketNorms(31, 99, "Masters (30+y)", 15, 24, 36, 50, 65, 75, 95, 120, 12, 20, 30, 42, 55, 65, 82, 105)
    )

    private val plankNorms = listOf(
        AgeBracketNorms(10, 13, "Sub-Junior (10-13y)", 25, 45, 70, 105, 140, 165, 210, 300, 20, 40, 60, 90, 125, 150, 190, 270),
        AgeBracketNorms(14, 17, "Junior (14-17y)", 40, 65, 100, 145, 190, 225, 280, 400, 30, 55, 85, 125, 165, 195, 245, 350),
        AgeBracketNorms(18, 22, "Youth / College (18-22y)", 50, 80, 120, 175, 230, 270, 340, 480, 40, 65, 100, 145, 190, 225, 280, 400),
        AgeBracketNorms(23, 30, "Senior (23-30y)", 45, 75, 115, 165, 215, 255, 320, 450, 35, 60, 95, 135, 180, 210, 265, 380),
        AgeBracketNorms(31, 99, "Masters (30+y)", 35, 60, 90, 130, 175, 205, 260, 360, 25, 45, 75, 110, 150, 175, 220, 310)
    )

    private val jumpNorms = listOf(
        AgeBracketNorms(10, 13, "Sub-Junior (10-13y)", 20, 26, 33, 40, 47, 52, 60, 70, 16, 22, 28, 34, 40, 44, 51, 60),
        AgeBracketNorms(14, 17, "Junior (14-17y)", 28, 36, 45, 54, 63, 69, 78, 90, 22, 29, 37, 45, 53, 58, 66, 78),
        AgeBracketNorms(18, 22, "Youth / College (18-22y)", 35, 44, 55, 65, 75, 82, 92, 108, 26, 34, 43, 52, 61, 67, 76, 89),
        AgeBracketNorms(23, 30, "Senior (23-30y)", 34, 42, 52, 62, 72, 78, 88, 102, 24, 32, 40, 49, 57, 63, 72, 84),
        AgeBracketNorms(31, 99, "Masters (30+y)", 27, 35, 44, 53, 62, 68, 77, 90, 20, 27, 34, 42, 49, 54, 62, 74)
    )

    fun calculate(
        score: Int,
        age: Int,
        gender: Gender,
        exerciseType: ExerciseType
    ): PercentileCalculation {
        val normsList = when (exerciseType) {
            ExerciseType.PUSHUPS -> pushUpNorms
            ExerciseType.SQUATS -> squatNorms
            ExerciseType.PLANK -> plankNorms
            ExerciseType.VERTICAL_JUMP -> jumpNorms
        }

        val bracket = normsList.find { age >= it.minAge && age <= it.maxAge } ?: normsList.last()
        val isMale = gender == Gender.MALE

        val p10 = if (isMale) bracket.maleP10 else bracket.femaleP10
        val p25 = if (isMale) bracket.maleP25 else bracket.femaleP25
        val p50 = if (isMale) bracket.maleP50 else bracket.femaleP50
        val p75 = if (isMale) bracket.maleP75 else bracket.femaleP75
        val p90 = if (isMale) bracket.maleP90 else bracket.femaleP90
        val p95 = if (isMale) bracket.maleP95 else bracket.femaleP95
        val p99 = if (isMale) bracket.maleP99 else bracket.femaleP99
        val record = if (isMale) bracket.maleRecord else bracket.femaleRecord

        val anchors = listOf(
            0 to 0f,
            p10 to 10f,
            p25 to 25f,
            p50 to 50f,
            p75 to 75f,
            p90 to 90f,
            p95 to 95f,
            p99 to 99f,
            record to 100f
        )

        var rawPercentile = 1.0f

        if (score >= record) {
            rawPercentile = 99.9f
        } else if (score > 0) {
            for (i in 0 until anchors.size - 1) {
                val lower = anchors[i]
                val upper = anchors[i + 1]
                if (score >= lower.first && score <= upper.first) {
                    val ratio = (score - lower.first).toFloat() / max(1, upper.first - lower.first)
                    rawPercentile = lower.second + ratio * (upper.second - lower.second)
                    break
                }
            }
        }

        val clampedPercentile = max(1f, min(99.9f, (rawPercentile * 10f).roundToInt() / 10f))
        val rounded = clampedPercentile.roundToInt()

        val talentTier = when {
            clampedPercentile >= 95f -> TalentTier.NATIONAL_ELITE
            clampedPercentile >= 85f -> TalentTier.STATE_CONTENDER
            clampedPercentile >= 70f -> TalentTier.DISTRICT_PERFORMER
            clampedPercentile >= 45f -> TalentTier.ACTIVE_CLUB
            else -> TalentTier.DEVELOPING
        }

        val genderStr = if (isMale) "Male" else "Female"
        val summary = "Outperforms $rounded% of $genderStr athletes across India in ${bracket.label}"

        return PercentileCalculation(
            score = score,
            percentile = clampedPercentile,
            percentileRounded = rounded,
            talentTier = talentTier,
            bracketLabel = bracket.label,
            medianScore = p50,
            eliteThreshold = p90,
            nationalRecord = record,
            comparisonSummary = summary
        )
    }
}
