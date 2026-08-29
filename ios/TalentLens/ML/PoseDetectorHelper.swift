//
//  PoseDetectorHelper.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import Foundation
import CoreGraphics
import SwiftUI

public class PoseDetectorHelper: ObservableObject {
    @Published public var simulatedLandmarks: [Point2D] = []
    private var simulationTimer: Timer?
    private var frameCount: Int = 0
    
    public init() {}
    
    public func startSimulation(for exercise: ExerciseType, onFrame: @escaping ([Point2D]) -> Void) {
        stopSimulation()
        frameCount = 0
        
        simulationTimer = Timer.scheduledTimer(withTimeInterval: 0.033, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.frameCount += 1
            let t = Float(self.frameCount) * 0.05
            
            var fake = Array(repeating: Point2D(x: 0.5, y: 0.5, visibility: 0.95), count: 33)
            
            switch exercise {
            case .pushups:
                let progress = (sin(t * 2.5) + 1.0) / 2.0
                let shoulderY = CGFloat(0.55 - progress * 0.15)
                let hipY = CGFloat(0.52 - progress * 0.14)
                fake[12] = Point2D(x: 0.35, y: shoulderY, visibility: 0.99)
                fake[14] = Point2D(x: CGFloat(0.38 - (1.0 - progress) * 0.05), y: CGFloat(0.52 + (1.0 - progress) * 0.04), visibility: 0.99)
                fake[16] = Point2D(x: 0.36, y: 0.68, visibility: 0.99)
                fake[24] = Point2D(x: 0.58, y: hipY, visibility: 0.99)
                fake[26] = Point2D(x: 0.72, y: hipY + 0.05, visibility: 0.98)
                fake[28] = Point2D(x: 0.84, y: 0.70, visibility: 0.99)
                
            case .squats:
                let progress = (sin(t * 2.2) + 1.0) / 2.0
                let hipY = CGFloat(0.62 - progress * 0.22)
                fake[12] = Point2D(x: 0.48, y: hipY - 0.25, visibility: 0.99)
                fake[24] = Point2D(x: 0.50, y: hipY, visibility: 0.99)
                fake[26] = Point2D(x: CGFloat(0.48 + (1.0 - progress) * 0.04), y: 0.65, visibility: 0.99)
                fake[28] = Point2D(x: 0.50, y: 0.88, visibility: 0.99)
                
            case .plank:
                fake[12] = Point2D(x: 0.32, y: 0.50, visibility: 0.99)
                fake[14] = Point2D(x: 0.32, y: 0.65, visibility: 0.99)
                fake[16] = Point2D(x: 0.38, y: 0.65, visibility: 0.99)
                fake[24] = Point2D(x: 0.56, y: 0.51, visibility: 0.99)
                fake[26] = Point2D(x: 0.70, y: 0.53, visibility: 0.98)
                fake[28] = Point2D(x: 0.84, y: 0.55, visibility: 0.99)
                
            case .verticalJump:
                let cycle = fmod(t, 4.0)
                let hipY: CGFloat
                let ankleY: CGFloat
                if cycle < 1.5 {
                    hipY = 0.48
                    ankleY = 0.85
                } else if cycle < 2.3 {
                    hipY = 0.62
                    ankleY = 0.85
                } else if cycle < 3.0 {
                    let jumpOffset = CGFloat(sin((cycle - 2.3) / 0.7 * .pi) * 0.22)
                    hipY = 0.48 - jumpOffset
                    ankleY = 0.85 - jumpOffset
                } else {
                    hipY = 0.48
                    ankleY = 0.85
                }
                fake[12] = Point2D(x: 0.50, y: hipY - 0.25, visibility: 0.99)
                fake[24] = Point2D(x: 0.50, y: hipY, visibility: 0.99)
                fake[26] = Point2D(x: 0.50, y: 0.68, visibility: 0.99)
                fake[28] = Point2D(x: 0.50, y: ankleY, visibility: 0.99)
            }
            
            self.simulatedLandmarks = fake
            onFrame(fake)
        }
    }
    
    public func stopSimulation() {
        simulationTimer?.invalidate()
        simulationTimer = nil
    }
}
