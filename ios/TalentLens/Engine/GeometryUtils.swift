//
//  GeometryUtils.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import Foundation
import CoreGraphics

public struct GeometryUtils {
    
    /// Calculates the angle (in degrees, 0..180) formed at vertex B by line segments AB and BC.
    public static func calculateJointAngle(a: Point2D, b: Point2D, c: Point2D) -> Float {
        let radians = atan2(c.y - b.y, c.x - b.x) - atan2(a.y - b.y, a.x - b.x)
        var angle = abs(Float(radians * 180.0 / .pi))
        
        if angle > 180.0 {
            angle = 360.0 - angle
        }
        
        return (angle * 10).rounded() / 10
    }
    
    /// Calculates trunk / spine alignment angle (Shoulder -> Hip -> Ankle).
    public static func calculatePlankAlignment(shoulder: Point2D, hip: Point2D, ankle: Point2D) -> Float {
        return calculateJointAngle(a: shoulder, b: hip, c: ankle)
    }
    
    /// Calculates knee flexion angle (Hip -> Knee -> Ankle).
    public static func calculateKneeFlexion(hip: Point2D, knee: Point2D, ankle: Point2D) -> Float {
        return calculateJointAngle(a: hip, b: knee, c: ankle)
    }
    
    /// Calculates hip flexion angle (Shoulder -> Hip -> Knee).
    public static func calculateHipFlexion(shoulder: Point2D, hip: Point2D, knee: Point2D) -> Float {
        return calculateJointAngle(a: shoulder, b: hip, c: knee)
    }
    
    /// Calculate vertical jump height in cm from flight hang time in seconds:
    /// h = (g * t^2) / 8 * 100
    public static func calculateJumpHeightFromFlightTime(flightTimeSec: Float) -> Float {
        let g: Float = 9.80665
        let heightMeters = (g * pow(flightTimeSec, 2)) / 8.0
        let heightCm = heightMeters * 100.0
        return (heightCm * 10).rounded() / 10
    }
    
    /// Exponential Moving Average (EMA) for joint jitter reduction.
    public static func smoothAngle(current: Float, previous: Float, alpha: Float = 0.35) -> Float {
        if previous == 0 { return current }
        return (alpha * current + (1.0 - alpha) * previous)
    }
}
