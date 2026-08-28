package com.talentlens.app.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Matrix
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.talentlens.app.audio.VoiceCoachService
import com.talentlens.app.data.AthleteRepository
import com.talentlens.app.engine.*
import com.talentlens.app.ml.PoseDetectorHelper
import com.talentlens.app.model.*
import com.talentlens.app.ui.components.PoseSkeletonOverlay
import com.talentlens.app.ui.components.ProfileSetupDialog
import com.talentlens.app.ui.theme.*
import java.util.concurrent.Executors
import kotlin.math.max
import kotlin.math.sin

@Composable
fun WorkoutScreen(
    athlete: AthleteProfile,
    onProfileChange: (AthleteProfile) -> Unit,
    onFinishWorkout: (AssessmentResult) -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
        )
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasCameraPermission = granted
    }

    LaunchedEffect(Unit) {
        if (!hasCameraPermission) {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    // Audio & Voice Coach
    val voiceCoach = remember { VoiceCoachService(context) }
    DisposableEffect(Unit) {
        onDispose { voiceCoach.shutdown() }
    }

    var selectedExercise by remember { mutableStateOf(ExerciseType.PUSHUPS) }
    var landmarks by remember { mutableStateOf<List<Point2D>>(emptyList()) }
    var isFrontCamera by remember { mutableStateOf(true) }
    var elapsedSeconds by remember { mutableStateOf(0) }
    var isTimerRunning by remember { mutableStateOf(false) }
    var isSimulating by remember { mutableStateOf(false) }
    var showProfileDialog by remember { mutableStateOf(false) }

    // Biomechanical FSM Engine
    val engine = remember(selectedExercise) {
        ExerciseStateEngine(
            exerciseType = selectedExercise,
            onRepCounted = { rep ->
                voiceCoach.playRepCountBeep()
                voiceCoach.speak("$rep")
            },
            onDepthReached = {
                voiceCoach.playDepthBeep()
            },
            onFormWarning = { warning ->
                voiceCoach.playWarningBeep()
                voiceCoach.speak(warning)
            },
            onJumpCompleted = { height ->
                voiceCoach.playRepCountBeep()
                voiceCoach.speak("${height.toInt()} centimeters!")
            }
        )
    }

    // Timer runner
    LaunchedEffect(isTimerRunning) {
        while (isTimerRunning) {
            kotlinx.coroutines.delay(1000)
            elapsedSeconds++
        }
    }

    // AI Simulation Generator for Testing / Headless environments
    LaunchedEffect(isSimulating, selectedExercise) {
        var frame = 0
        while (isSimulating) {
            kotlinx.coroutines.delay(33)
            frame++
            val t = frame * 0.05f

            val fake = MutableList(33) { Point2D(0.5f, 0.5f, 0.95f) }

            when (selectedExercise) {
                ExerciseType.PUSHUPS -> {
                    val progress = (sin(t * 2.5f) + 1f) / 2f
                    val shoulderY = 0.55f - progress * 0.15f
                    val hipY = 0.52f - progress * 0.14f
                    fake[12] = Point2D(0.35f, shoulderY, 0.99f)
                    fake[14] = Point2D(0.38f - (1f - progress) * 0.05f, 0.52f + (1f - progress) * 0.04f, 0.99f)
                    fake[16] = Point2D(0.36f, 0.68f, 0.99f)
                    fake[24] = Point2D(0.58f, hipY, 0.99f)
                    fake[26] = Point2D(0.72f, hipY + 0.05f, 0.98f)
                    fake[28] = Point2D(0.84f, 0.70f, 0.99f)
                }
                ExerciseType.SQUATS -> {
                    val progress = (sin(t * 2.2f) + 1f) / 2f
                    val hipY = 0.62f - progress * 0.22f
                    fake[12] = Point2D(0.48f, hipY - 0.25f, 0.99f)
                    fake[24] = Point2D(0.50f, hipY, 0.99f)
                    fake[26] = Point2D(0.48f + (1f - progress) * 0.04f, 0.65f, 0.99f)
                    fake[28] = Point2D(0.50f, 0.88f, 0.99f)
                }
                ExerciseType.PLANK -> {
                    fake[12] = Point2D(0.32f, 0.50f, 0.99f)
                    fake[14] = Point2D(0.32f, 0.65f, 0.99f)
                    fake[16] = Point2D(0.38f, 0.65f, 0.99f)
                    fake[24] = Point2D(0.56f, 0.51f, 0.99f)
                    fake[26] = Point2D(0.70f, 0.53f, 0.98f)
                    fake[28] = Point2D(0.84f, 0.55f, 0.99f)
                }
                ExerciseType.VERTICAL_JUMP -> {
                    val cycle = t % 4.0f
                    val hipY = if (cycle < 1.5f) 0.48f else if (cycle < 2.3f) 0.62f else 0.48f - (sin((cycle - 2.3f) / 0.7f * Math.PI.toFloat()) * 0.22f)
                    val ankleY = if (cycle in 2.3f..3.0f) 0.85f - (sin((cycle - 2.3f) / 0.7f * Math.PI.toFloat()) * 0.22f) else 0.85f
                    fake[12] = Point2D(0.50f, hipY - 0.25f, 0.99f)
                    fake[24] = Point2D(0.50f, hipY, 0.99f)
                    fake[26] = Point2D(0.50f, 0.68f, 0.99f)
                    fake[28] = Point2D(0.50f, ankleY, 0.99f)
                }
            }

            landmarks = fake
            engine.processFrame(fake)
        }
    }

    // Pose detector
    val cameraExecutor = remember { Executors.newSingleThreadExecutor() }
    val poseDetector = remember {
        PoseDetectorHelper(
            context = context,
            onResults = { detectedLandmarks, _ ->
                if (!isSimulating) {
                    landmarks = detectedLandmarks
                    engine.processFrame(detectedLandmarks)
                }
            },
            onError = { /* Log */ }
        )
    }

    DisposableEffect(Unit) {
        onDispose {
            poseDetector.clear()
            cameraExecutor.shutdown()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Exercise Selector Carousel & Edit Profile Button
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.weight(1f)
            ) {
                items(ExerciseType.values()) { ex ->
                    val isSelected = ex == selectedExercise
                    Surface(
                        color = if (isSelected) CardBackground else CardBackground.copy(alpha = 0.5f),
                        shape = RoundedCornerShape(16.dp),
                        border = androidx.compose.foundation.BorderStroke(
                            if (isSelected) 1.5.dp else 1.dp,
                            if (isSelected) BrandOrange else CardBorder
                        ),
                        modifier = Modifier.clickable(enabled = engine.state == FSMWorkoutState.IDLE) {
                            selectedExercise = ex
                            engine.reset()
                            elapsedSeconds = 0
                        }
                    ) {
                        Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)) {
                            Text(ex.category.uppercase(), color = if (isSelected) BrandOrange else TextSecondary, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            Text(ex.shortName, color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            IconButton(
                onClick = { showProfileDialog = true },
                modifier = Modifier.background(CardBackground, CircleShape)
            ) {
                Icon(Icons.Default.Person, contentDescription = "Edit Profile", tint = BrandOrange)
            }
        }

        // Camera Preview & Canvas Container
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .clip(RoundedCornerShape(24.dp))
                .background(Color.Black)
                .border(2.dp, CardBorder, RoundedCornerShape(24.dp))
        ) {
            if (hasCameraPermission && !isSimulating) {
                AndroidView(
                    factory = { ctx ->
                        val previewView = PreviewView(ctx)
                        val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)

                        cameraProviderFuture.addListener({
                            val cameraProvider = cameraProviderFuture.get()
                            val preview = Preview.Builder().build().also {
                                it.setSurfaceProvider(previewView.surfaceProvider)
                            }

                            val imageAnalysis = ImageAnalysis.Builder()
                                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                                .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
                                .build()
                                .also {
                                    it.setAnalyzer(cameraExecutor) { imageProxy ->
                                        val bitmap = imageProxy.toBitmap()
                                        val matrix = Matrix().apply {
                                            postRotate(imageProxy.imageInfo.rotationDegrees.toFloat())
                                            if (isFrontCamera) postScale(-1f, 1f)
                                        }
                                        val rotatedBitmap = Bitmap.createBitmap(
                                            bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true
                                        )
                                        poseDetector.detectLiveStream(rotatedBitmap, isFrontCamera)
                                        imageProxy.close()
                                    }
                                }

                            val cameraSelector = if (isFrontCamera) CameraSelector.DEFAULT_FRONT_CAMERA else CameraSelector.DEFAULT_BACK_CAMERA

                            try {
                                cameraProvider.unbindAll()
                                cameraProvider.bindToLifecycle(
                                    lifecycleOwner,
                                    cameraSelector,
                                    preview,
                                    imageAnalysis
                                )
                            } catch (exc: Exception) {
                                // Handle error
                            }
                        }, ContextCompat.getMainExecutor(ctx))

                        previewView
                    },
                    modifier = Modifier.fillMaxSize()
                )
            }

            // Pose Skeleton Canvas Overlay
            PoseSkeletonOverlay(
                landmarks = landmarks,
                exerciseType = selectedExercise,
                primaryAngle = engine.currentPrimaryAngle,
                isTargetDepthReached = engine.depthProgressPercent >= 100
            )

            // Top HUD Controls
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Live Timer Badge
                Surface(
                    color = BackgroundDark.copy(alpha = 0.85f),
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Box(modifier = Modifier.size(8.dp).background(if (isTimerRunning) Color.Red else TextSecondary, CircleShape))
                        val mins = elapsedSeconds / 60
                        val secs = elapsedSeconds % 60
                        Text(
                            String.format("%02d:%02d", mins, secs),
                            color = TextPrimary,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                // Camera Flip & Voice Coach Mute & AI Simulation Toggle
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(
                        onClick = { isSimulating = !isSimulating },
                        modifier = Modifier.background(if (isSimulating) CyberCyan.copy(alpha = 0.3f) else BackgroundDark.copy(alpha = 0.8f), CircleShape)
                    ) {
                        Icon(Icons.Default.SmartToy, contentDescription = "Simulate AI", tint = if (isSimulating) CyberCyan else TextPrimary)
                    }
                    IconButton(
                        onClick = { isFrontCamera = !isFrontCamera },
                        modifier = Modifier.background(BackgroundDark.copy(alpha = 0.8f), CircleShape)
                    ) {
                        Icon(Icons.Default.FlipCameraAndroid, contentDescription = "Flip Camera", tint = TextPrimary)
                    }
                    IconButton(
                        onClick = { voiceCoach.setMuted(!voiceCoach.isMuted()) },
                        modifier = Modifier.background(BackgroundDark.copy(alpha = 0.8f), CircleShape)
                    ) {
                        Icon(if (voiceCoach.isMuted()) Icons.Default.VolumeOff else Icons.Default.VolumeUp, contentDescription = "Voice Coach", tint = TextPrimary)
                    }
                }
            }

            // Bottom Big Score Badge
            Column(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Surface(
                    color = BackgroundDark.copy(alpha = 0.9f),
                    shape = RoundedCornerShape(20.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 24.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.Bottom,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text("${engine.score}", color = TextPrimary, fontSize = 48.sp, fontWeight = FontWeight.Black)
                        Text(selectedExercise.metricUnit.uppercase(), color = BrandOrange, fontSize = 14.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                    }
                }
            }
        }

        // Action Controls (Start / Pause / Finish)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            if (engine.state == FSMWorkoutState.IDLE) {
                Button(
                    onClick = {
                        engine.start()
                        isTimerRunning = true
                        voiceCoach.speak("Assume position to begin ${selectedExercise.shortName}")
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandOrange),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth().height(54.dp)
                ) {
                    Icon(Icons.Default.PlayArrow, contentDescription = null)
                    Spacer(Modifier.width(8.dp))
                    Text("Start ${selectedExercise.shortName} Test", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                }
            } else {
                Button(
                    onClick = {
                        if (engine.state == FSMWorkoutState.PAUSED) {
                            engine.resume()
                            isTimerRunning = true
                        } else {
                            engine.pause()
                            isTimerRunning = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CardBackground),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.weight(1f).height(54.dp)
                ) {
                    Text(if (engine.state == FSMWorkoutState.PAUSED) "Resume" else "Pause", color = TextPrimary, fontWeight = FontWeight.Bold)
                }

                Button(
                    onClick = {
                        isTimerRunning = false
                        isSimulating = false
                        val biomechanics = engine.finish(elapsedSeconds)
                        val calc = PercentileEngine.calculate(
                            score = engine.score,
                            age = athlete.age,
                            gender = athlete.gender,
                            exerciseType = selectedExercise
                        )
                        val hash = "TL-${calc.percentileRounded}-${athlete.state.take(3).uppercase()}-${(1000..9999).random()}"

                        val result = AssessmentResult(
                            athleteId = athlete.id,
                            athleteName = athlete.fullName,
                            age = athlete.age,
                            gender = athlete.gender,
                            state = athlete.state,
                            district = athlete.district,
                            sport = athlete.primarySport,
                            exerciseType = selectedExercise,
                            score = engine.score,
                            durationSeconds = max(1, elapsedSeconds),
                            percentile = calc.percentile,
                            talentTier = calc.talentTier,
                            biomechanics = biomechanics,
                            verificationHash = hash
                        )
                        AthleteRepository.saveAssessment(result)
                        voiceCoach.speak("Assessment verified! ${calc.talentTier.displayName}", true)
                        onFinishWorkout(result)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandOrange),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.weight(1.5f).height(54.dp)
                ) {
                    Icon(Icons.Default.Check, contentDescription = null)
                    Spacer(Modifier.width(6.dp))
                    Text("Finish & Verify", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                }
            }
        }
    }

    if (showProfileDialog) {
        ProfileSetupDialog(
            initialProfile = athlete,
            onDismiss = { showProfileDialog = false },
            onSave = { updated ->
                onProfileChange(updated)
                showProfileDialog = false
            }
        )
    }
}
