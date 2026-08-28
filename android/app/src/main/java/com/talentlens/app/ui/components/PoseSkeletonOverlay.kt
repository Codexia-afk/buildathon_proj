package com.talentlens.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.PaintingStyle
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import com.talentlens.app.engine.Point2D
import com.talentlens.app.model.ExerciseType

val POSE_BONES = listOf(
    11 to 12, 11 to 13, 13 to 15, 12 to 14, 14 to 16,
    11 to 23, 12 to 24, 23 to 24,
    23 to 25, 25 to 27, 24 to 26, 26 to 28
)

@Composable
fun PoseSkeletonOverlay(
    landmarks: List<Point2D>,
    exerciseType: ExerciseType,
    primaryAngle: Float,
    isTargetDepthReached: Boolean,
    modifier: Modifier = Modifier
) {
    Canvas(modifier = modifier.fillMaxSize()) {
        if (landmarks.size < 33) return@Canvas

        val w = size.width
        val h = size.height

        // 1. Draw Skeleton Bone Lines
        for ((start, end) in POSE_BONES) {
            val p1 = landmarks[start]
            val p2 = landmarks[end]

            if (p1.visibility > 0.35f && p2.visibility > 0.35f) {
                val x1 = p1.x * w
                val y1 = p1.y * h
                val x2 = p2.x * w
                val y2 = p2.y * h

                val isPrimarySegment = when (exerciseType) {
                    ExerciseType.PUSHUPS -> (start == 12 && end == 14) || (start == 14 && end == 16) || (start == 11 && end == 13) || (start == 13 && end == 15)
                    ExerciseType.SQUATS -> (start == 24 && end == 26) || (start == 26 && end == 28) || (start == 23 && end == 25) || (start == 25 && end == 27)
                    ExerciseType.PLANK -> (start == 12 && end == 24) || (start == 24 && end == 28) || (start == 11 && end == 23) || (start == 23 && end == 27)
                    ExerciseType.VERTICAL_JUMP -> (start == 24 && end == 26) || (start == 26 && end == 28)
                }

                val strokeColor = if (isPrimarySegment) {
                    if (isTargetDepthReached) Color(0xFF10B981) else Color(0xFFFF4D00)
                } else {
                    Color(0xFF00F0FF).copy(alpha = 0.6f)
                }

                val strokeWidth = if (isPrimarySegment) 8f else 4f

                drawLine(
                    color = strokeColor,
                    start = Offset(x1, y1),
                    end = Offset(x2, y2),
                    strokeWidth = strokeWidth
                )
            }
        }

        // 2. Draw Landmark Joint Dots
        for (i in landmarks.indices) {
            if (i in 1..10) continue // Skip small facial keypoints
            val p = landmarks[i]
            if (p.visibility > 0.35f) {
                val x = p.x * w
                val y = p.y * h

                val isKeyVertex = (i == 14 || i == 13 || i == 26 || i == 25 || i == 24 || i == 23)

                drawCircle(
                    color = if (isKeyVertex) (if (isTargetDepthReached) Color(0xFF10B981) else Color(0xFFFF4D00)) else Color(0xFF00F0FF),
                    radius = if (isKeyVertex) 14f else 8f,
                    center = Offset(x, y)
                )
            }
        }

        // 3. Draw Angle Text Badge
        drawIntoCanvas { canvas ->
            val activeVertexIdx = when (exerciseType) {
                ExerciseType.PUSHUPS -> 14
                ExerciseType.SQUATS -> 26
                ExerciseType.PLANK -> 24
                ExerciseType.VERTICAL_JUMP -> 26
            }
            val vertex = landmarks.getOrNull(activeVertexIdx)
            if (vertex != null && vertex.visibility > 0.35f) {
                val vx = vertex.x * w + 20f
                val vy = vertex.y * h - 10f

                val paint = android.graphics.Paint().apply {
                    color = android.graphics.Color.WHITE
                    textSize = 42f
                    isFakeBoldText = true
                    setShadowLayer(8f, 0f, 0f, android.graphics.Color.BLACK)
                }

                canvas.nativeCanvas.drawText(
                    "${primaryAngle.toInt()}°",
                    vx,
                    vy,
                    paint
                )
            }
        }
    }
}
