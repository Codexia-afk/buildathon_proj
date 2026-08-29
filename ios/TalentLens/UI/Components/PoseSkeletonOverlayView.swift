//
//  PoseSkeletonOverlayView.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import SwiftUI

public let POSE_BONES: [(Int, Int)] = [
    (11, 12), (11, 13), (13, 15), (12, 14), (14, 16),
    (11, 23), (12, 24), (23, 24),
    (23, 25), (25, 27), (24, 26), (26, 28)
]

public struct PoseSkeletonOverlayView: View {
    public let landmarks: [Point2D]
    public let exerciseType: ExerciseType
    public let primaryAngle: Float
    public let isTargetDepthReached: Bool
    
    public init(
        landmarks: [Point2D],
        exerciseType: ExerciseType,
        primaryAngle: Float,
        isTargetDepthReached: Bool
    ) {
        self.landmarks = landmarks
        self.exerciseType = exerciseType
        self.primaryAngle = primaryAngle
        self.isTargetDepthReached = isTargetDepthReached
    }
    
    public var body: some View {
        Canvas { context, size in
            guard landmarks.count >= 33 else { return }
            
            let w = size.width
            let h = size.height
            
            // 1. Draw Skeleton Bone Segments
            for (start, end) in POSE_BONES {
                let p1 = landmarks[start]
                let p2 = landmarks[end]
                
                if p1.visibility > 0.35 && p2.visibility > 0.35 {
                    let pt1 = CGPoint(x: p1.x * w, y: p1.y * h)
                    let pt2 = CGPoint(x: p2.x * w, y: p2.y * h)
                    
                    let isPrimarySegment: Bool
                    switch exerciseType {
                    case .pushups:
                        isPrimarySegment = (start == 12 && end == 14) || (start == 14 && end == 16) || (start == 11 && end == 13) || (start == 13 && end == 15)
                    case .squats:
                        isPrimarySegment = (start == 24 && end == 26) || (start == 26 && end == 28) || (start == 23 && end == 25) || (start == 25 && end == 27)
                    case .plank:
                        isPrimarySegment = (start == 12 && end == 24) || (start == 24 && end == 28) || (start == 11 && end == 23) || (start == 23 && end == 27)
                    case .verticalJump:
                        isPrimarySegment = (start == 24 && end == 26) || (start == 26 && end == 28)
                    }
                    
                    let strokeColor = isPrimarySegment ? (isTargetDepthReached ? TLTheme.verifiedEmerald : TLTheme.brandOrange) : TLTheme.cyberCyan.opacity(0.6)
                    let strokeWidth: CGFloat = isPrimarySegment ? 4.5 : 2.5
                    
                    var path = Path()
                    path.move(to: pt1)
                    path.addLine(to: pt2)
                    
                    context.stroke(path, with: .color(strokeColor), lineWidth: strokeWidth)
                }
            }
            
            // 2. Draw Landmark Joint Nodes
            for i in 0..<landmarks.count {
                if i >= 1 && i <= 10 { continue } // Skip small facial keypoints
                let p = landmarks[i]
                if p.visibility > 0.35 {
                    let pt = CGPoint(x: p.x * w, y: p.y * h)
                    let isKeyVertex = (i == 14 || i == 13 || i == 26 || i == 25 || i == 24 || i == 23)
                    let radius: CGFloat = isKeyVertex ? 7.0 : 4.0
                    let color = isKeyVertex ? (isTargetDepthReached ? TLTheme.verifiedEmerald : TLTheme.brandOrange) : TLTheme.cyberCyan
                    
                    let circleRect = CGRect(x: pt.x - radius, y: pt.y - radius, width: radius * 2, height: radius * 2)
                    context.fill(Path(ellipseIn: circleRect), with: .color(color))
                    context.stroke(Path(ellipseIn: circleRect), with: .color(.white.opacity(0.8)), lineWidth: 1.0)
                }
            }
            
            // 3. Draw Angle Indicator at Active Joint Vertex
            let activeVertexIdx: Int
            switch exerciseType {
            case .pushups: activeVertexIdx = 14
            case .squats: activeVertexIdx = 26
            case .plank: activeVertexIdx = 24
            case .verticalJump: activeVertexIdx = 26
            }
            
            if activeVertexIdx < landmarks.count {
                let vertex = landmarks[activeVertexIdx]
                if vertex.visibility > 0.35 {
                    let vx = vertex.x * w + 16
                    let vy = vertex.y * h - 10
                    
                    let text = Text("\(Int(primaryAngle))°")
                        .font(.system(size: 18, weight: .black, design: .monospaced))
                        .foregroundColor(.white)
                    
                    context.draw(text, at: CGPoint(x: vx, y: vy))
                }
            }
        }
    }
}
