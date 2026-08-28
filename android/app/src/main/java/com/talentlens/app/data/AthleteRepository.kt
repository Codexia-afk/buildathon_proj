package com.talentlens.app.data

import com.talentlens.app.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.random.Random

object AthleteRepository {

    private var currentProfile = AthleteProfile(
        id = "ath_default",
        fullName = "Aarav Sharma",
        age = 17,
        gender = Gender.MALE,
        primarySport = SportType.WRESTLING,
        state = "Haryana",
        district = "Sonipat",
        schoolOrAcademy = "Sonipat Sports Excellence Akhada",
        phone = "+91 98765 00000"
    )

    private val initialSeedAssessments = mutableListOf(
        AssessmentResult(
            id = "ass_101",
            athleteId = "ath_101",
            athleteName = "Vikas Kumar Phogat",
            age = 17,
            gender = Gender.MALE,
            state = "Haryana",
            district = "Bhiwani",
            sport = SportType.WRESTLING,
            exerciseType = ExerciseType.PUSHUPS,
            score = 62,
            durationSeconds = 60,
            percentile = 98.2f,
            talentTier = TalentTier.NATIONAL_ELITE,
            biomechanics = BiomechanicsData(
                averageElbowFlexion = 74f,
                averageTrunkAlignment = 175f,
                formScore = 96,
                incompletedReps = 1,
                cadenceRpm = 54f,
                peakSpeedSec = 0.9f
            ),
            verificationHash = "TL-98-HAR-V1K4S",
            scoutNotes = listOf("Exceptional core stability and explosive lockout speed. Recommended for national camp."),
            isShortlisted = true
        ),
        AssessmentResult(
            id = "ass_102",
            athleteId = "ath_102",
            athleteName = "Ananya S. Nair",
            age = 16,
            gender = Gender.FEMALE,
            state = "Kerala",
            district = "Kottayam",
            sport = SportType.ATHLETICS,
            exerciseType = ExerciseType.VERTICAL_JUMP,
            score = 62,
            durationSeconds = 30,
            percentile = 96.8f,
            talentTier = TalentTier.NATIONAL_ELITE,
            biomechanics = BiomechanicsData(
                averageTrunkAlignment = 178f,
                formScore = 98,
                jumpHeightCm = 62f,
                flightTimeSec = 0.71f
            ),
            verificationHash = "TL-96-KER-AN4NY",
            scoutNotes = listOf("Phenomenal explosive ground reaction force."),
            isShortlisted = true
        ),
        AssessmentResult(
            id = "ass_103",
            athleteId = "ath_103",
            athleteName = "Gurpreet Singh",
            age = 19,
            gender = Gender.MALE,
            state = "Punjab",
            district = "Patiala",
            sport = SportType.WEIGHTLIFTING,
            exerciseType = ExerciseType.SQUATS,
            score = 82,
            durationSeconds = 60,
            percentile = 92.5f,
            talentTier = TalentTier.STATE_CONTENDER,
            biomechanics = BiomechanicsData(
                averageKneeFlexion = 78f,
                averageTrunkAlignment = 168f,
                formScore = 92,
                cadenceRpm = 82f
            ),
            verificationHash = "TL-92-PUN-GURP7",
            isShortlisted = false
        ),
        AssessmentResult(
            id = "ass_104",
            athleteId = "ath_104",
            athleteName = "Mary Lalremruati",
            age = 15,
            gender = Gender.FEMALE,
            state = "Manipur",
            district = "Imphal East",
            sport = SportType.BOXING,
            exerciseType = ExerciseType.PLANK,
            score = 185,
            durationSeconds = 185,
            percentile = 94.0f,
            talentTier = TalentTier.STATE_CONTENDER,
            biomechanics = BiomechanicsData(
                averageTrunkAlignment = 176f,
                formScore = 95
            ),
            verificationHash = "TL-94-MAN-MARY9",
            scoutNotes = listOf("Ironclad isometric abdominal bracing."),
            isShortlisted = true
        ),
        AssessmentResult(
            id = "ass_105",
            athleteId = "ath_105",
            athleteName = "Rohit Ramesh Pawar",
            age = 18,
            gender = Gender.MALE,
            state = "Maharashtra",
            district = "Kolhapur",
            sport = SportType.KABADDI,
            exerciseType = ExerciseType.PUSHUPS,
            score = 52,
            durationSeconds = 60,
            percentile = 88.0f,
            talentTier = TalentTier.STATE_CONTENDER,
            biomechanics = BiomechanicsData(
                averageElbowFlexion = 82f,
                averageTrunkAlignment = 170f,
                formScore = 90
            ),
            verificationHash = "TL-88-MAH-ROH1T",
            isShortlisted = false
        )
    )

    private val _assessments = MutableStateFlow<List<AssessmentResult>>(initialSeedAssessments)
    val assessments: StateFlow<List<AssessmentResult>> = _assessments.asStateFlow()

    fun getCurrentProfile(): AthleteProfile = currentProfile

    fun updateProfile(profile: AthleteProfile) {
        currentProfile = profile
    }

    fun saveAssessment(result: AssessmentResult) {
        val current = _assessments.value.toMutableList()
        current.add(0, result)
        _assessments.value = current
    }

    fun toggleShortlist(id: String) {
        val current = _assessments.value.map { item ->
            if (item.id == id) item.copy(isShortlisted = !item.isShortlisted) else item
        }
        _assessments.value = current
    }

    fun addScoutNote(id: String, note: String) {
        val current = _assessments.value.map { item ->
            if (item.id == id) {
                val updatedNotes = item.scoutNotes.toMutableList().apply { add(note) }
                item.copy(scoutNotes = updatedNotes)
            } else item
        }
        _assessments.value = current
    }

    fun getAthleteHistory(athleteId: String): List<AssessmentResult> {
        return _assessments.value.filter { it.athleteId == athleteId }
    }

    fun simulateIncomingLiveAssessment(): AssessmentResult {
        val names = listOf("Devendra Murmu", "Simranjeet Kaur", "Neeraj Yadav", "Ananya Deshmukh", "Sahil Rathore")
        val states = listOf("Jharkhand", "Punjab", "Haryana", "Maharashtra", "Rajasthan")
        val sports = listOf(SportType.FOOTBALL, SportType.ATHLETICS, SportType.WRESTLING, SportType.BOXING, SportType.KABADDI)
        val tests = listOf(ExerciseType.PUSHUPS, ExerciseType.SQUATS, ExerciseType.PLANK, ExerciseType.VERTICAL_JUMP)

        val idx = Random.nextInt(names.size)
        val chosenTest = tests.random()
        val chosenState = states[idx]

        val score = when (chosenTest) {
            ExerciseType.PUSHUPS -> Random.nextInt(40, 65)
            ExerciseType.SQUATS -> Random.nextInt(55, 90)
            ExerciseType.PLANK -> Random.nextInt(120, 240)
            ExerciseType.VERTICAL_JUMP -> Random.nextInt(50, 75)
        }

        val result = AssessmentResult(
            id = "ass_live_${System.currentTimeMillis()}",
            athleteId = "ath_live_${System.currentTimeMillis()}",
            athleteName = names[idx],
            age = Random.nextInt(15, 20),
            gender = if (idx % 2 == 0) Gender.MALE else Gender.FEMALE,
            state = chosenState,
            district = "Excellence Hub",
            sport = sports[idx],
            exerciseType = chosenTest,
            score = score,
            durationSeconds = 60,
            percentile = Random.nextDouble(92.0, 99.5).toFloat(),
            talentTier = TalentTier.NATIONAL_ELITE,
            biomechanics = BiomechanicsData(formScore = 98),
            verificationHash = "TL-98-${chosenState.take(3).uppercase()}-${Random.nextInt(1000, 9999)}",
            isShortlisted = false
        )

        saveAssessment(result)
        return result
    }

    fun exportToCsvString(): String {
        val headers = "Athlete Name,Age,Gender,Sport,State,District,Exercise,Score,Percentile,Tier,Form Score,Hash,Date\n"
        val rows = _assessments.value.joinToString("\n") { a ->
            "\"${a.athleteName}\",${a.age},${a.gender.displayName},\"${a.sport.displayName}\",\"${a.state}\",\"${a.district}\",\"${a.exerciseType.title}\",${a.score},${a.percentile},\"${a.talentTier.displayName}\",${a.biomechanics.formScore},\"${a.verificationHash}\",${a.verifiedAt}"
        }
        return headers + rows
    }
}
