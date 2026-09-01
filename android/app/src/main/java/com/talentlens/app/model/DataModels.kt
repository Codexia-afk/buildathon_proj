package com.talentlens.app.model

import java.util.UUID

enum class Gender(val displayName: String) {
    MALE("Male"),
    FEMALE("Female"),
    OTHER("Other")
}

enum class SportType(val displayName: String, val iconEmoji: String) {
    ATHLETICS("Athletics (Sprint/Jump)", "🏃"),
    FOOTBALL("Football", "⚽"),
    KABADDI("Kabaddi", "🤾"),
    WRESTLING("Wrestling", "🤼"),
    BOXING("Boxing", "🥊"),
    CRICKET("Cricket", "🏏"),
    HOCKEY("Hockey", "🏑"),
    BADMINTON("Badminton", "🏸"),
    WEIGHTLIFTING("Weightlifting", "🏋️"),
    GENERAL("Multi-Sport / General", "🏅")
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

data class SportTrainingDrill(
    val exerciseType: ExerciseType,
    val roleRationale: String,
    val biomechanicalFocus: String,
    val gymTargetScore: String,
    val importanceTier: String
)

data class SportTrainingProfile(
    val sport: SportType,
    val tagline: String,
    val primaryQuality: String,
    val recommendedDrills: List<SportTrainingDrill>,
    val gymCoachingTip: String
)

object SportTrainingDatabase {
    val profiles = mapOf(
        SportType.CRICKET to SportTrainingProfile(
            sport = SportType.CRICKET,
            tagline = "Fast Bowling Stride Force, Anti-Rotational Core & Batting Drive",
            primaryQuality = "Rotational Trunk Stability & Explosive Ground Reaction",
            recommendedDrills = listOf(
                SportTrainingDrill(ExerciseType.VERTICAL_JUMP, "Explosive run-up plant & jump takeoff velocity for fast bowlers & batting stride", "Hang-time & maximal vertical elastic rebound", "Target: >55 cm (Elite Fast Bowler)", "Primary Bowling Power Test"),
                SportTrainingDrill(ExerciseType.PLANK, "Anti-rotational core stabilization to protect lumbar spine during high-impact delivery", "Neutral spine alignment without hip rotation", "Target: >150 sec (Lumbar Protection)", "Core Injury-Shielding Drill"),
                SportTrainingDrill(ExerciseType.SQUATS, "Lower-body power drive for wicket-keeping crouch, running between wickets & batting stance", "Parallel knee depth with upright chest", "Target: >45 reps / min", "Leg Endurance & Wicket Stance"),
                SportTrainingDrill(ExerciseType.PUSHUPS, "Pectoral, triceps and shoulder girdle endurance for fast outfield boundary throwing", "90° elbow flexion with locked core", "Target: >40 reps", "Throwing Arm Conditioning")
            ),
            gymCoachingTip = "Fast bowlers experience 8-10x bodyweight on delivery stride. Keep your plank straight to eliminate spine energy leaks."
        ),
        SportType.WRESTLING to SportTrainingProfile(
            sport = SportType.WRESTLING,
            tagline = "Mat Hand-Fighting, Takedown Explosiveness & Core Gut-Wrench Defense",
            primaryQuality = "Isometric Core Bracing & Explosive Leg Attack Drive",
            recommendedDrills = listOf(
                SportTrainingDrill(ExerciseType.PLANK, "Ironclad isometric core bracing to defend against gut-wrench rolls & maintain mat parterre posture", "Maximal abdominal tension & straight hip line", "Target: >180 sec (National Akhada Standard)", "Mat Defense & Bridge Anchor"),
                SportTrainingDrill(ExerciseType.SQUATS, "Deep hip flexion power for low-level single/double-leg attack shots & sprawl recoveries", "Deep sub-90° knee angle with explosive hip extension", "Target: >55 reps", "Takedown Shot Engine"),
                SportTrainingDrill(ExerciseType.PUSHUPS, "Upper body explosive pushing power for hand-fighting, collar ties & snapping down opponents", "Strict arm lockout to simulate underhook breaks", "Target: >50 reps", "Hand-Fighting & Chest Power"),
                SportTrainingDrill(ExerciseType.VERTICAL_JUMP, "Instantaneous rate of force development for explosive re-attacks and mat lifting power", "Maximum takeoff acceleration", "Target: >58 cm", "Explosive Lift Power")
            ),
            gymCoachingTip = "Focus on crisp arm lockout during push-ups to simulate breaking opponents' underhooks on the mat."
        ),
        SportType.FOOTBALL to SportTrainingProfile(
            sport = SportType.FOOTBALL,
            tagline = "Sprint Acceleration, Aerial Header Duels & 90-Min Physical Resilience",
            primaryQuality = "Explosive Aerial Hang-Time & Lower-Body Deceleration",
            recommendedDrills = listOf(
                SportTrainingDrill(ExerciseType.VERTICAL_JUMP, "Crucial for aerial header duels, set pieces & explosive first-step sprint acceleration", "Triple-extension takeoff and hang-time", "Target: >60 cm (Wing/Forward Standard)", "Aerial Combat & Sprint Speed"),
                SportTrainingDrill(ExerciseType.SQUATS, "Builds hamstring/quadriceps strength for rapid deceleration, cutting & shot power", "Controlled eccentric descent with explosive upward drive", "Target: >50 reps", "Cutting & Knee Stability"),
                SportTrainingDrill(ExerciseType.PLANK, "Shielding torso stability during shoulder-to-shoulder physical challenges on the pitch", "Rock-solid core under fatigue", "Target: >140 sec", "Physical Shielding Strength"),
                SportTrainingDrill(ExerciseType.PUSHUPS, "Upper body balance and arm pump propulsion during high-speed breakaways", "90° elbow depth with steady rhythm", "Target: >35 reps", "Sprint Arm Pump Drive")
            ),
            gymCoachingTip = "Maximize knee flexion in squats to strengthen knee stabilizing ligaments (ACL/MCL) against sudden turf cuts."
        ),
        SportType.KABADDI to SportTrainingProfile(
            sport = SportType.KABADDI,
            tagline = "Raider Toe-Touch Spring, Corner Ankle Holds & Multi-Defender Resistance",
            primaryQuality = "Explosive Lateral Spring & Kinetic Chain Defense",
            recommendedDrills = listOf(
                SportTrainingDrill(ExerciseType.SQUATS, "Rapid level change for defender tackle dives and raider sudden bonus-line lunges", "Deep knee bend and instant rebound", "Target: >55 reps", "Bonus Line Lunge Engine"),
                SportTrainingDrill(ExerciseType.VERTICAL_JUMP, "Explosive leaping over defender chain tackles (frog jump / lion jump evasions)", "Max vertical apex height", "Target: >62 cm (Pro Kabaddi Raider Standard)", "Chain Evasion Leaping"),
                SportTrainingDrill(ExerciseType.PLANK, "Maintaining cantilever core tension when resisting multi-defender chain tackle pulls", "Anti-piking rigid spine alignment", "Target: >160 sec", "Midline Drag Resistance"),
                SportTrainingDrill(ExerciseType.PUSHUPS, "Upper body hand thrust for hand touches and defender pushing duels", "Explosive chest push-off", "Target: >45 reps", "Raider Hand-Touch Power")
            ),
            gymCoachingTip = "Train full-depth squats to ensure rapid hip rebound when executing sudden escapes back across the midline."
        ),
        SportType.BADMINTON to SportTrainingProfile(
            sport = SportType.BADMINTON,
            tagline = "Jump Smash Apex Power, Court Lunge Recovery & Rotational Stability",
            primaryQuality = "Peak Vertical Hang-Time & Rapid Footwork Recovery",
            recommendedDrills = listOf(
                SportTrainingDrill(ExerciseType.VERTICAL_JUMP, "Dominating the rear-court with steep jump smashes and high contact point apex reach", "Flight hang-time for kinetic wind-up", "Target: >62 cm (Top 5% National Shuttler)", "Rear-Court Jump Smash"),
                SportTrainingDrill(ExerciseType.SQUATS, "Extreme single-leg deceleration in front-court lunges and rapid base recovery", "Deep hip mobility and ankle dorsiflexion", "Target: >48 reps", "Front-Court Lunge Recovery"),
                SportTrainingDrill(ExerciseType.PLANK, "Core anti-rotation to stabilize torso during high-velocity overhead slice/smash rotations", "Solid torso bracing without spine twisting", "Target: >130 sec", "Overhead Smash Stability"),
                SportTrainingDrill(ExerciseType.PUSHUPS, "Shoulder girdle stability to prevent rotator cuff overuse injuries during match play", "Controlled tempo with full range", "Target: >35 reps", "Rotator Cuff Injury Shield")
            ),
            gymCoachingTip = "Aim for maximum hang-time in vertical jumps to give your racket kinetic chain full wind-up time at the apex."
        ),
        SportType.BOXING to SportTrainingProfile(
            sport = SportType.BOXING,
            tagline = "Kinetic Chain Punch Drive, Torso Shielding & 12-Round Shoulder Stamina",
            primaryQuality = "Upper Body Muscular Endurance & Trunk Shock Absorption",
            recommendedDrills = listOf(
                SportTrainingDrill(ExerciseType.PUSHUPS, "High-cadence punch extension speed and shoulder endurance for continuous combinations", "Rapid cadence (>45 RPM) with full lockout", "Target: >55 reps / min", "Combination Punch Speed"),
                SportTrainingDrill(ExerciseType.SQUATS, "Leg drive generating 60%+ of knockout power kinetic chain from canvas to fist", "Explosive upward leg drive", "Target: >50 reps", "Kinetic Punch Power Drive"),
                SportTrainingDrill(ExerciseType.PLANK, "Absorbing heavy body shots and maintaining tight guard under championship fatigue", "Tight abdominal brace throughout", "Target: >170 sec", "Body Punch Shock Absorber"),
                SportTrainingDrill(ExerciseType.VERTICAL_JUMP, "Spring-loaded footwork for in-and-out slipping, pivots & rapid angle changes", "Elastic ankle and calf spring", "Target: >54 cm", "Ring Footwork Spring")
            ),
            gymCoachingTip = "Maintain high cadence (45+ RPM) in push-ups to build the fast-twitch endurance needed in championship rounds."
        ),
        SportType.ATHLETICS to SportTrainingProfile(
            sport = SportType.ATHLETICS,
            tagline = "Ground Reaction Force, Triple-Extension & Stride Frequency",
            primaryQuality = "Rate of Force Development & Explosive Elasticity",
            recommendedDrills = listOf(
                SportTrainingDrill(ExerciseType.VERTICAL_JUMP, "Direct indicator of ground reaction force (F = m·a) and sprint takeoff velocity", "Explosive triple extension (hip-knee-ankle)", "Target: >65 cm (Elite Sprinter/Jumper)", "Ground Reaction Velocity"),
                SportTrainingDrill(ExerciseType.SQUATS, "Maximum hip and knee extension power for sprint starting blocks & drive phase", "Parallel depth with maximal ascent velocity", "Target: >55 reps", "Drive Phase Acceleration"),
                SportTrainingDrill(ExerciseType.PLANK, "Eliminating torso energy leaks during maximum velocity upright sprinting", "Rigid neutral torso alignment", "Target: >160 sec", "Sprint Posture Integrity"),
                SportTrainingDrill(ExerciseType.PUSHUPS, "Arm drive momentum and upper-body counter-rotational balance during strides", "Symmetric arm lockout", "Target: >45 reps", "Arm Drive Counterbalance")
            ),
            gymCoachingTip = "Vertical jump hang-time directly correlates with sub-11s 100m sprint stride length and frequency."
        ),
        SportType.WEIGHTLIFTING to SportTrainingProfile(
            sport = SportType.WEIGHTLIFTING,
            tagline = "Olympic Squat Depth, Triple Extension & Rigid Spinal Lockout",
            primaryQuality = "Deep Hip Mobility & Maximum Isometric Core Bracing",
            recommendedDrills = listOf(
                SportTrainingDrill(ExerciseType.SQUATS, "Ass-to-grass (ATG) sub-80° knee flexion mobility for snatch and clean catch positions", "Full deep knee flexion with vertical spine", "Target: >60 reps (Perfect Deep Form)", "Olympic Clean Catch Foundation"),
                SportTrainingDrill(ExerciseType.PLANK, "Bracing intra-abdominal pressure and neutral spine alignment under heavy overhead loads", "Zero spinal flexion/extension variance", "Target: >200 sec (Spine Shield)", "Intra-Abdominal Pressure Brace"),
                SportTrainingDrill(ExerciseType.VERTICAL_JUMP, "Peak triple-extension (hip-knee-ankle) power during second pull of the snatch/clean", "Explosive takeoff acceleration", "Target: >60 cm", "Second-Pull Power Metric"),
                SportTrainingDrill(ExerciseType.PUSHUPS, "Upper body overhead pressing foundation and elbow lockout integrity", "Complete 180° arm lockout", "Target: >45 reps", "Overhead Lockout Integrity")
            ),
            gymCoachingTip = "Descend below parallel on squats with vertical chest alignment to master the Olympic catch."
        ),
        SportType.HOCKEY to SportTrainingProfile(
            sport = SportType.HOCKEY,
            tagline = "Low-Crouch Drag-Flick Power, Acceleration & Lateral Core Force",
            primaryQuality = "Sustained Low-Stance Endurance & Rotational Power",
            recommendedDrills = listOf(
                SportTrainingDrill(ExerciseType.SQUATS, "Maintaining prolonged semi-crouched dribbling and drag-flick posture without fatigue", "Sustained quad & hip endurance", "Target: >50 reps", "Low-Stance Stick Play"),
                SportTrainingDrill(ExerciseType.PLANK, "Transferring rotational torque from torso into high-speed drag flick shots", "Spine stabilization during torque", "Target: >140 sec", "Drag-Flick Torque Transfer"),
                SportTrainingDrill(ExerciseType.VERTICAL_JUMP, "Explosive counter-attack sprint acceleration from dead stops on turf", "Quick ground push-off", "Target: >56 cm", "Turf Breakaway Acceleration"),
                SportTrainingDrill(ExerciseType.PUSHUPS, "Forearm, wrist and tricep control for aerial passing and stick handling", "Consistent 90° depth", "Target: >38 reps", "Stick Control & Push Passing")
            ),
            gymCoachingTip = "Squat endurance prevents lower back fatigue during continuous low-center-of-gravity stick play."
        ),
        SportType.GENERAL to SportTrainingProfile(
            sport = SportType.GENERAL,
            tagline = "All-Round Olympic Tri-Power, Joint Integrity & Kinetic Balance",
            primaryQuality = "Full-Spectrum Biomechanical Balance",
            recommendedDrills = listOf(
                SportTrainingDrill(ExerciseType.PUSHUPS, "Upper body push strength & endurance", "90° elbow depth, straight spine", "Target: >40 reps", "Upper Body Base"),
                SportTrainingDrill(ExerciseType.SQUATS, "Lower body functional mobility & leg power", "Parallel knee depth (>90°)", "Target: >45 reps", "Lower Body Base"),
                SportTrainingDrill(ExerciseType.PLANK, "Core spine stabilization & endurance", "Neutral spine alignment", "Target: >120 sec", "Core Posture Anchor"),
                SportTrainingDrill(ExerciseType.VERTICAL_JUMP, "Explosive lower body force & hang-time", "Countermovement takeoff", "Target: >50 cm", "Explosive Power Metric")
            ),
            gymCoachingTip = "A balanced athletic foundation is the cornerstone of lifelong injury prevention and elite sports transition."
        )
    )

    fun getProfile(sport: SportType): SportTrainingProfile {
        return profiles[sport] ?: profiles[SportType.GENERAL]!!
    }
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

data class ProAthleteBenchmark(
    val name: String,
    val sport: SportType,
    val title: String,
    val achievement: String,
    val iconEmoji: String,
    val physicalArchetype: String,
    val pushupsScore: Int,
    val squatsScore: Int,
    val plankSeconds: Int,
    val verticalJumpCm: Float,
    val formPrecisionScore: Int,
    val signatureDrill: ExerciseType,
    val proAdviceQuote: String,
    val focusArea: String
)

object ProAthleteDataset {
    val athletes = listOf(
        ProAthleteBenchmark(
            name = "Neeraj Chopra",
            sport = SportType.ATHLETICS,
            title = "Olympic Javelin Champion",
            achievement = "Tokyo Olympic Gold & World Champion",
            iconEmoji = "🥇",
            physicalArchetype = "Maximal Ground Reaction Force & Kinetic Torque",
            pushupsScore = 60,
            squatsScore = 70,
            plankSeconds = 260,
            verticalJumpCm = 76.0f,
            formPrecisionScore = 99,
            signatureDrill = ExerciseType.VERTICAL_JUMP,
            proAdviceQuote = "Every centimeter of vertical spring translates directly into delivery stride braking force and javelin release speed.",
            focusArea = "Elastic Stride Plant & Explosive Ground Force"
        ),
        ProAthleteBenchmark(
            name = "Jasprit Bumrah",
            sport = SportType.CRICKET,
            title = "World #1 Fast Bowler",
            achievement = "ICC T20 World Champion & Test Spearhead",
            iconEmoji = "🏏",
            physicalArchetype = "Hyper-Elastic Stride Plant & Anti-Rotational Core",
            pushupsScore = 55,
            squatsScore = 65,
            plankSeconds = 240,
            verticalJumpCm = 68.0f,
            formPrecisionScore = 98,
            signatureDrill = ExerciseType.VERTICAL_JUMP,
            proAdviceQuote = "A rock-solid core protects the spine from the 8-10x bodyweight impact when you plant your front foot on the bowling crease.",
            focusArea = "Lumbar Core Protection & Release Acceleration"
        ),
        ProAthleteBenchmark(
            name = "Virat Kohli",
            sport = SportType.CRICKET,
            title = "Modern Cricket Legend",
            achievement = "ICC Player of the Decade & Fitness Icon",
            iconEmoji = "⚡",
            physicalArchetype = "High-Cadence Deceleration & Relentless Core Stamina",
            pushupsScore = 58,
            squatsScore = 68,
            plankSeconds = 260,
            verticalJumpCm = 64.0f,
            formPrecisionScore = 98,
            signatureDrill = ExerciseType.SQUATS,
            proAdviceQuote = "Consistent deep squat conditioning allows you to sprint 3 runs at 95% speed in the 48th over in 40°C heat.",
            focusArea = "Running Between Wickets & High-Endurance Stride"
        ),
        ProAthleteBenchmark(
            name = "Sunil Chhetri",
            sport = SportType.FOOTBALL,
            title = "Indian Football Captain & Icon",
            achievement = "4th Highest International Goalscorer in Football History",
            iconEmoji = "⚽",
            physicalArchetype = "Aerial Apex Hang-Time & 90-Min Deceleration Engine",
            pushupsScore = 50,
            squatsScore = 68,
            plankSeconds = 210,
            verticalJumpCm = 74.0f,
            formPrecisionScore = 97,
            signatureDrill = ExerciseType.VERTICAL_JUMP,
            proAdviceQuote = "Winning aerial headers is 70% explosive timing and vertical spring generated from the glutes and core.",
            focusArea = "Box Aerial Combat & Sprint Acceleration"
        ),
        ProAthleteBenchmark(
            name = "Bajrang Punia",
            sport = SportType.WRESTLING,
            title = "Olympic Wrestling Medalist",
            achievement = "Tokyo Olympic Bronze & 4x World Championship Medalist",
            iconEmoji = "🤼",
            physicalArchetype = "Isometric Core Fortress & Mat Takedown Engine",
            pushupsScore = 70,
            squatsScore = 75,
            plankSeconds = 300,
            verticalJumpCm = 62.0f,
            formPrecisionScore = 98,
            signatureDrill = ExerciseType.PLANK,
            proAdviceQuote = "On the mat, when opponents try to turn you, your plank stability is the difference between giving 2 points or escaping.",
            focusArea = "Parterre Defense & Leg Shot Rebounds"
        ),
        ProAthleteBenchmark(
            name = "PV Sindhu",
            sport = SportType.BADMINTON,
            title = "2x Olympic Medalist",
            achievement = "Rio Silver, Tokyo Bronze & BWF World Champion",
            iconEmoji = "🏸",
            physicalArchetype = "Rear-Court Smash Apex & Extreme Lunge Recovery",
            pushupsScore = 45,
            squatsScore = 62,
            plankSeconds = 200,
            verticalJumpCm = 70.0f,
            formPrecisionScore = 97,
            signatureDrill = ExerciseType.VERTICAL_JUMP,
            proAdviceQuote = "High apex vertical jumps give you steep angles on smashes that defenders simply cannot retrieve.",
            focusArea = "Apex Reach & Front-Court Lunge Deceleration"
        ),
        ProAthleteBenchmark(
            name = "Mary Kom",
            sport = SportType.BOXING,
            title = "6x World Boxing Champion",
            achievement = "Olympic Bronze & 6x World Amateur Boxing Champion",
            iconEmoji = "🥊",
            physicalArchetype = "High-Cadence Punch Drive & Torso Body-Armor",
            pushupsScore = 68,
            squatsScore = 65,
            plankSeconds = 250,
            verticalJumpCm = 58.0f,
            formPrecisionScore = 98,
            signatureDrill = ExerciseType.PUSHUPS,
            proAdviceQuote = "Your punches get their knockout power from the floor through deep legs and rapid arm extension.",
            focusArea = "Championship Round Cadence & Punch Shock Absorption"
        ),
        ProAthleteBenchmark(
            name = "Pardeep Narwal",
            sport = SportType.KABADDI,
            title = "Record Breaker 'Dubki King'",
            achievement = "Pro Kabaddi Highest Raid Points Record Holder",
            iconEmoji = "🤾",
            physicalArchetype = "Explosive Lateral Spring & Cantilever Core",
            pushupsScore = 58,
            squatsScore = 72,
            plankSeconds = 240,
            verticalJumpCm = 70.0f,
            formPrecisionScore = 96,
            signatureDrill = ExerciseType.SQUATS,
            proAdviceQuote = "Deep squats build the explosive knee recoil needed to slip under chain tackles in a split second.",
            focusArea = "Dubki Escape Rebound & Bonus Line Spring"
        ),
        ProAthleteBenchmark(
            name = "Mirabai Chanu",
            sport = SportType.WEIGHTLIFTING,
            title = "Olympic Weightlifting Silver Medalist",
            achievement = "Tokyo Olympic 49kg Silver & World Champion",
            iconEmoji = "🏋️",
            physicalArchetype = "Olympic ATG Deep Hip Mobility & Maximum Intra-Abdominal Rigidity",
            pushupsScore = 58,
            squatsScore = 80,
            plankSeconds = 320,
            verticalJumpCm = 66.0f,
            formPrecisionScore = 99,
            signatureDrill = ExerciseType.SQUATS,
            proAdviceQuote = "Full sub-80° squat depth with an upright spine is the absolute foundation of lifting 2x your bodyweight.",
            focusArea = "Olympic Clean Catch & Intra-Abdominal Rigidity"
        ),
        ProAthleteBenchmark(
            name = "Manpreet Singh",
            sport = SportType.HOCKEY,
            title = "Olympic Hockey Captain",
            achievement = "Tokyo Olympic Bronze & Asian Games Gold",
            iconEmoji = "🏑",
            physicalArchetype = "Low-Crouch Drag-Flick Torque & Turf Breakaway",
            pushupsScore = 52,
            squatsScore = 66,
            plankSeconds = 220,
            verticalJumpCm = 62.0f,
            formPrecisionScore = 97,
            signatureDrill = ExerciseType.SQUATS,
            proAdviceQuote = "Low posture quad stamina allows you to control the ball at full sprint without burning your lower back.",
            focusArea = "Sustained Low-Crouch & Counter-Attack Sprint"
        ),
        ProAthleteBenchmark(
            name = "Usain Bolt",
            sport = SportType.GENERAL,
            title = "8x Olympic Gold Sprint Legend",
            achievement = "100m (9.58s) & 200m World Record Holder",
            iconEmoji = "⚡",
            physicalArchetype = "Peak Ground Reaction Velocity & Elastic Stride Power",
            pushupsScore = 65,
            squatsScore = 72,
            plankSeconds = 280,
            verticalJumpCm = 82.0f,
            formPrecisionScore = 99,
            signatureDrill = ExerciseType.VERTICAL_JUMP,
            proAdviceQuote = "Sprint speed is all about producing maximum vertical and horizontal ground force in under 0.08 seconds per foot contact.",
            focusArea = "Rate of Force Development & Sprint Elasticity"
        )
    )

    fun getProForSport(sport: SportType): ProAthleteBenchmark {
        return athletes.find { it.sport == sport } ?: athletes.first()
    }
}

