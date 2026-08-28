package com.talentlens.app.engine

import com.talentlens.app.model.BiomechanicsData
import com.talentlens.app.model.ExerciseType
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

enum class FSMWorkoutState {
    IDLE,
    CALIBRATING,
    READY,
    GOING_DOWN,
    BOTTOM_REACHED,
    GOING_UP,
    HOLDING,
    JUMPING,
    PAUSED,
    COMPLETED
}

class ExerciseStateEngine(
    var exerciseType: ExerciseType = ExerciseType.PUSHUPS,
    private val onRepCounted: (Int) -> Unit = {},
    private val onDepthReached: () -> Unit = {},
    private val onFormWarning: (String) -> Unit = {},
    private val onJumpCompleted: (Float) -> Unit = {}
) {
    var state: FSMWorkoutState = FSMWorkoutState.IDLE
        private set

    var score: Int = 0
        private set

    var incompleteCount: Int = 0
        private set

    var currentPrimaryAngle: Float = 180f
        private set

    var currentSecondaryAngle: Float = 180f
        private set

    var depthProgressPercent: Int = 0
        private set

    var formScore: Int = 100
        private set

    var activeSide: String = "right"
        private set

    var peakJumpCm: Float = 0f
        private set

    private var startTimeMs: Long = 0
    private var lastWarningTimeMs: Long = 0
    private val primaryAnglesHistory = mutableListOf<Float>()
    private val secondaryAnglesHistory = mutableListOf<Float>()
    private val repDurationsSec = mutableListOf<Float>()
    private var repStartTimeMs: Long = 0
    private var minAngleInCurrentRep: Float = 180f

    // Jump tracking
    private var jumpTakeoffTimeMs: Long = 0
    private var baselineAnkleY: Float? = null

    // Plank tracking
    private var plankTotalFrames: Int = 0
    private var plankGoodFrames: Int = 0

    fun start() {
        state = FSMWorkoutState.CALIBRATING
        score = 0
        incompleteCount = 0
        formScore = 100
        peakJumpCm = 0f
        startTimeMs = System.currentTimeMillis()
        repStartTimeMs = startTimeMs
        primaryAnglesHistory.clear()
        secondaryAnglesHistory.clear()
        repDurationsSec.clear()
        minAngleInCurrentRep = 180f
        baselineAnkleY = null
        plankTotalFrames = 0
        plankGoodFrames = 0
    }

    fun pause() {
        state = FSMWorkoutState.PAUSED
    }

    fun resume() {
        state = FSMWorkoutState.READY
    }

    fun reset() {
        state = FSMWorkoutState.IDLE
        score = 0
        incompleteCount = 0
        depthProgressPercent = 0
        currentPrimaryAngle = 180f
        currentSecondaryAngle = 180f
    }

    fun finish(elapsedSeconds: Int): BiomechanicsData {
        state = FSMWorkoutState.COMPLETED
        val avgPrimary = if (primaryAnglesHistory.isNotEmpty()) primaryAnglesHistory.average().toFloat() else 85f
        val avgSecondary = if (secondaryAnglesHistory.isNotEmpty()) secondaryAnglesHistory.average().toFloat() else 174f
        val fastestRep = if (repDurationsSec.isNotEmpty()) repDurationsSec.minOrNull() ?: 1.0f else 1.0f
        val finalRpm = if (elapsedSeconds > 0) (score.toFloat() / (elapsedSeconds / 60f)) else 0f
        val finalForm = max(60, 100 - (incompleteCount * 5))

        return BiomechanicsData(
            averageElbowFlexion = if (exerciseType == ExerciseType.PUSHUPS) avgPrimary else 80f,
            averageKneeFlexion = if (exerciseType == ExerciseType.SQUATS) avgPrimary else 85f,
            averageTrunkAlignment = avgSecondary,
            formScore = finalForm,
            incompletedReps = incompleteCount,
            cadenceRpm = finalRpm,
            peakSpeedSec = fastestRep,
            jumpHeightCm = peakJumpCm
        )
    }

    fun processFrame(landmarks: List<Point2D>) {
        if (state == FSMWorkoutState.IDLE || state == FSMWorkoutState.PAUSED || state == FSMWorkoutState.COMPLETED) {
            return
        }
        if (landmarks.size < 33) return

        val leftShoulder = landmarks[11]
        val leftElbow = landmarks[13]
        val leftWrist = landmarks[15]
        val leftHip = landmarks[23]
        val leftKnee = landmarks[25]
        val leftAnkle = landmarks[27]

        val rightShoulder = landmarks[12]
        val rightElbow = landmarks[14]
        val rightWrist = landmarks[16]
        val rightHip = landmarks[24]
        val rightKnee = landmarks[26]
        val rightAnkle = landmarks[28]

        val leftVis = leftShoulder.visibility + leftHip.visibility + leftAnkle.visibility
        val rightVis = rightShoulder.visibility + rightHip.visibility + rightAnkle.visibility

        activeSide = if (rightVis >= leftVis) "right" else "left"

        val shoulder = if (activeSide == "right") rightShoulder else leftShoulder
        val elbow = if (activeSide == "right") rightElbow else leftElbow
        val wrist = if (activeSide == "right") rightWrist else leftWrist
        val hip = if (activeSide == "right") rightHip else leftHip
        val knee = if (activeSide == "right") rightKnee else leftKnee
        val ankle = if (activeSide == "right") rightAnkle else leftAnkle

        val now = System.currentTimeMillis()

        when (exerciseType) {
            // 1. Push-ups
            ExerciseType.PUSHUPS -> {
                val elbowAngle = GeometryUtils.calculateJointAngle(shoulder, elbow, wrist)
                val plankAngle = GeometryUtils.calculatePlankAlignment(shoulder, hip, ankle)

                currentPrimaryAngle = GeometryUtils.smoothAngle(elbowAngle, currentPrimaryAngle)
                currentSecondaryAngle = plankAngle

                primaryAnglesHistory.add(currentPrimaryAngle)
                secondaryAnglesHistory.add(plankAngle)

                val progress = max(0, min(100, (((155f - currentPrimaryAngle) / (155f - 90f)) * 100f).roundToInt()))
                depthProgressPercent = progress

                if (plankAngle < 145f || plankAngle > 200f) {
                    if (now - lastWarningTimeMs > 2500) {
                        onFormWarning("Keep your back straight")
                        lastWarningTimeMs = now
                    }
                }

                when (state) {
                    FSMWorkoutState.CALIBRATING -> {
                        if (currentPrimaryAngle >= 150f) {
                            state = FSMWorkoutState.READY
                        }
                    }
                    FSMWorkoutState.READY -> {
                        if (currentPrimaryAngle < 140f) {
                            state = FSMWorkoutState.GOING_DOWN
                            repStartTimeMs = now
                        }
                    }
                    FSMWorkoutState.GOING_DOWN -> {
                        if (currentPrimaryAngle <= 90f) {
                            state = FSMWorkoutState.BOTTOM_REACHED
                            onDepthReached()
                        } else if (currentPrimaryAngle > 150f) {
                            state = FSMWorkoutState.READY
                            incompleteCount++
                        }
                    }
                    FSMWorkoutState.BOTTOM_REACHED -> {
                        if (currentPrimaryAngle > 105f) {
                            state = FSMWorkoutState.GOING_UP
                        }
                    }
                    FSMWorkoutState.GOING_UP -> {
                        if (currentPrimaryAngle >= 155f) {
                            score++
                            val durSec = (now - repStartTimeMs) / 1000f
                            repDurationsSec.add(durSec)
                            onRepCounted(score)
                            state = FSMWorkoutState.READY
                        }
                    }
                    else -> {}
                }
            }

            // 2. Squats
            ExerciseType.SQUATS -> {
                val kneeAngle = GeometryUtils.calculateKneeFlexion(hip, knee, ankle)
                val hipAngle = GeometryUtils.calculateHipFlexion(shoulder, hip, knee)

                currentPrimaryAngle = GeometryUtils.smoothAngle(kneeAngle, currentPrimaryAngle)
                currentSecondaryAngle = hipAngle

                primaryAnglesHistory.add(currentPrimaryAngle)
                secondaryAnglesHistory.add(hipAngle)

                val progress = max(0, min(100, (((160f - currentPrimaryAngle) / (160f - 90f)) * 100f).roundToInt()))
                depthProgressPercent = progress

                when (state) {
                    FSMWorkoutState.CALIBRATING -> {
                        if (currentPrimaryAngle >= 155f) {
                            state = FSMWorkoutState.READY
                        }
                    }
                    FSMWorkoutState.READY -> {
                        if (currentPrimaryAngle < 145f) {
                            state = FSMWorkoutState.GOING_DOWN
                            repStartTimeMs = now
                        }
                    }
                    FSMWorkoutState.GOING_DOWN -> {
                        if (currentPrimaryAngle <= 90f) {
                            state = FSMWorkoutState.BOTTOM_REACHED
                            onDepthReached()
                        } else if (currentPrimaryAngle > 155f) {
                            state = FSMWorkoutState.READY
                            incompleteCount++
                        }
                    }
                    FSMWorkoutState.BOTTOM_REACHED -> {
                        if (currentPrimaryAngle > 105f) {
                            state = FSMWorkoutState.GOING_UP
                        }
                    }
                    FSMWorkoutState.GOING_UP -> {
                        if (currentPrimaryAngle >= 160f) {
                            score++
                            val durSec = (now - repStartTimeMs) / 1000f
                            repDurationsSec.add(durSec)
                            onRepCounted(score)
                            state = FSMWorkoutState.READY
                        }
                    }
                    else -> {}
                }
            }

            // 3. Plank Hold
            ExerciseType.PLANK -> {
                val plankAngle = GeometryUtils.calculatePlankAlignment(shoulder, hip, ankle)
                currentPrimaryAngle = plankAngle
                primaryAnglesHistory.add(plankAngle)

                plankTotalFrames++
                val isGood = plankAngle in 155f..185f
                if (isGood) plankGoodFrames++

                formScore = if (plankTotalFrames > 0) ((plankGoodFrames.toFloat() / plankTotalFrames) * 100).roundToInt() else 100

                when (state) {
                    FSMWorkoutState.CALIBRATING -> {
                        if (isGood) state = FSMWorkoutState.HOLDING
                    }
                    FSMWorkoutState.HOLDING -> {
                        if (!isGood && now - lastWarningTimeMs > 2500) {
                            onFormWarning(if (plankAngle < 155f) "Hips sagging! Lift core" else "Hips too high")
                            lastWarningTimeMs = now
                        }
                    }
                    else -> {}
                }
            }

            // 4. Vertical Jump
            ExerciseType.VERTICAL_JUMP -> {
                val kneeAngle = GeometryUtils.calculateKneeFlexion(hip, knee, ankle)
                currentPrimaryAngle = kneeAngle

                val ankleY = (leftAnkle.y + rightAnkle.y) / 2f

                when (state) {
                    FSMWorkoutState.CALIBRATING -> {
                        baselineAnkleY = ankleY
                        state = FSMWorkoutState.READY
                    }
                    FSMWorkoutState.READY -> {
                        if (kneeAngle < 125f) {
                            state = FSMWorkoutState.GOING_DOWN
                        }
                    }
                    FSMWorkoutState.GOING_DOWN -> {
                        val base = baselineAnkleY ?: ankleY
                        if (ankleY < base - 0.04f) {
                            state = FSMWorkoutState.JUMPING
                            jumpTakeoffTimeMs = now
                        }
                    }
                    FSMWorkoutState.JUMPING -> {
                        val base = baselineAnkleY ?: ankleY
                        if (ankleY >= base - 0.02f && jumpTakeoffTimeMs > 0) {
                            val flightTime = (now - jumpTakeoffTimeMs) / 1000f
                            if (flightTime in 0.2f..1.0f) {
                                val height = GeometryUtils.calculateJumpHeightFromFlightTime(flightTime)
                                if (height > peakJumpCm) {
                                    peakJumpCm = height
                                    score = height.roundToInt()
                                }
                                onJumpCompleted(height)
                            }
                            state = FSMWorkoutState.READY
                            jumpTakeoffTimeMs = 0
                        }
                    }
                    else -> {}
                }
            }
        }
    }
}
