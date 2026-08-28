package com.talentlens.app.engine

import kotlin.math.abs
import kotlin.math.atan2
import kotlin.math.pow
import kotlin.math.roundToInt
import kotlin.math.sqrt

data class Point2D(
    val x: Float,
    val y: Float,
    val visibility: Float = 1.0f
)

object GeometryUtils {

    /**
     * Calculates the angle (in degrees, 0..180) formed at vertex B by line segments AB and BC.
     */
    fun calculateJointAngle(a: Point2D, b: Point2D, c: Point2D): Float {
        val radians = atan2(c.y - b.y, c.x - b.x) - atan2(a.y - b.y, a.x - b.x)
        var angle = abs((radians * 180.0 / Math.PI).toFloat())

        if (angle > 180.0f) {
            angle = 360.0f - angle
        }

        return (angle * 10f).roundToInt() / 10f
    }

    /**
     * Calculates trunk / spine alignment angle (Shoulder -> Hip -> Ankle).
     */
    fun calculatePlankAlignment(shoulder: Point2D, hip: Point2D, ankle: Point2D): Float {
        return calculateJointAngle(shoulder, hip, ankle)
    }

    /**
     * Calculates knee flexion angle (Hip -> Knee -> Ankle).
     */
    fun calculateKneeFlexion(hip: Point2D, knee: Point2D, ankle: Point2D): Float {
        return calculateJointAngle(hip, knee, ankle)
    }

    /**
     * Calculates hip flexion angle (Shoulder -> Hip -> Knee).
     */
    fun calculateHipFlexion(shoulder: Point2D, hip: Point2D, knee: Point2D): Float {
        return calculateJointAngle(shoulder, hip, knee)
    }

    /**
     * Calculate vertical jump height in cm from flight hang time in seconds:
     * h = (g * t^2) / 8 * 100
     */
    fun calculateJumpHeightFromFlightTime(flightTimeSec: Float): Float {
        val g = 9.80665f
        val heightMeters = (g * flightTimeSec.pow(2)) / 8f
        val heightCm = heightMeters * 100f
        return (heightCm * 10f).roundToInt() / 10f
    }

    /**
     * Exponential Moving Average (EMA) for joint jitter reduction.
     */
    fun smoothAngle(current: Float, previous: Float, alpha: Float = 0.35f): Float {
        if (previous == 0f) return current
        return (alpha * current + (1f - alpha) * previous)
    }
}
