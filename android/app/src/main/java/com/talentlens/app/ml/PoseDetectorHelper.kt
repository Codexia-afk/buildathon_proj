package com.talentlens.app.ml

import android.content.Context
import android.graphics.Bitmap
import android.os.SystemClock
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.core.Delegate
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.poselandmarker.PoseLandmarker
import com.google.mediapipe.tasks.vision.poselandmarker.PoseLandmarkerResult
import com.talentlens.app.engine.Point2D

class PoseDetectorHelper(
    private val context: Context,
    private val onResults: (List<Point2D>, Long) -> Unit,
    private val onError: (String) -> Unit
) {
    private var poseLandmarker: PoseLandmarker? = null

    init {
        setupPoseLandmarker()
    }

    fun setupPoseLandmarker() {
        try {
            val baseOptions = BaseOptions.builder()
                .setDelegate(Delegate.GPU)
                .setModelAssetPath("pose_landmarker_lite.task")
                .build()

            val options = PoseLandmarker.PoseLandmarkerOptions.builder()
                .setBaseOptions(baseOptions)
                .setMinPoseDetectionConfidence(0.5f)
                .setMinTrackingConfidence(0.5f)
                .setMinPosePresenceConfidence(0.5f)
                .setRunningMode(RunningMode.LIVE_STREAM)
                .setResultListener { result: PoseLandmarkerResult, inputImage: MPImage ->
                    val inferenceTime = SystemClock.uptimeMillis() - inputImage.timestamp
                    val landmarksList = mutableListOf<Point2D>()

                    if (result.landmarks().isNotEmpty()) {
                        val firstPose = result.landmarks()[0]
                        for (landmark in firstPose) {
                            landmarksList.add(
                                Point2D(
                                    x = landmark.x(),
                                    y = landmark.y(),
                                    visibility = landmark.visibility().orElse(1.0f)
                                )
                            )
                        }
                    }
                    onResults(landmarksList, inferenceTime)
                }
                .setErrorListener { error ->
                    onError(error.message ?: "Unknown MediaPipe error")
                }
                .build()

            poseLandmarker = PoseLandmarker.createFromOptions(context, options)
        } catch (e: Exception) {
            onError("Failed to initialize MediaPipe Pose: ${e.message}")
        }
    }

    fun detectLiveStream(bitmap: Bitmap, isFrontCamera: Boolean) {
        val frameTime = SystemClock.uptimeMillis()
        val mpImage = BitmapImageBuilder(bitmap).build()
        poseLandmarker?.detectAsync(mpImage, frameTime)
    }

    fun clear() {
        poseLandmarker?.close()
        poseLandmarker = null
    }
}
