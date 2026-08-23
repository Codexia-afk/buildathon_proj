import { useState, useEffect, useRef, useCallback } from 'react';
import { FilesetResolver, PoseLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface PoseDetectionState {
  isModelLoading: boolean;
  modelError: string | null;
  hasCameraPermission: boolean | null;
  landmarks: NormalizedLandmark[] | null;
  cameraActive: boolean;
  fps: number;
}

export function usePoseDetection(videoRef: React.RefObject<HTMLVideoElement>) {
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null);
  const [fps, setFps] = useState<number>(0);

  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const requestAnimationRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(Date.now());
  const isSimulatingRef = useRef<boolean>(false);

  // Initialize MediaPipe PoseLandmarker
  useEffect(() => {
    let isMounted = true;

    async function initPoseLandmarker() {
      try {
        setIsModelLoading(true);
        setModelError(null);

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );

        if (!isMounted) return;

        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        if (!isMounted) return;

        poseLandmarkerRef.current = landmarker;
        setIsModelLoading(false);
      } catch (err) {
        console.error("Failed to load MediaPipe Pose Landmarker:", err);
        if (isMounted) {
          setModelError("Could not load AI vision model. Please check internet connection or switch to simulation mode.");
          setIsModelLoading(false);
        }
      }
    }

    initPoseLandmarker();

    return () => {
      isMounted = false;
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
      poseLandmarkerRef.current?.close();
    };
  }, []);

  // Frame processing loop
  const processVideoFrame = useCallback(() => {
    const video = videoRef.current;
    const landmarker = poseLandmarkerRef.current;

    if (
      video &&
      landmarker &&
      video.readyState >= 2 &&
      !video.paused &&
      !video.ended &&
      !isSimulatingRef.current
    ) {
      const currentTime = video.currentTime;
      if (currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = currentTime;

        try {
          const startTimeMs = performance.now();
          const results = landmarker.detectForVideo(video, startTimeMs);

          if (results && results.landmarks && results.landmarks.length > 0) {
            setLandmarks(results.landmarks[0]);
          } else {
            setLandmarks(null);
          }

          // Calculate FPS
          frameCountRef.current += 1;
          const now = Date.now();
          if (now - lastFpsUpdateRef.current >= 1000) {
            setFps(frameCountRef.current);
            frameCountRef.current = 0;
            lastFpsUpdateRef.current = now;
          }
        } catch (e) {
          // Frame skip or timestamp error
        }
      }
    }

    requestAnimationRef.current = requestAnimationFrame(processVideoFrame);
  }, [videoRef]);

  // Start webcam
  const startCamera = useCallback(async () => {
    try {
      setHasCameraPermission(null);
      isSimulatingRef.current = false;

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        setHasCameraPermission(true);

        if (requestAnimationRef.current) {
          cancelAnimationFrame(requestAnimationRef.current);
        }
        requestAnimationRef.current = requestAnimationFrame(processVideoFrame);
      }
    } catch (err: unknown) {
      console.warn("Camera access denied or unavailable:", err);
      setHasCameraPermission(false);
      setCameraActive(false);
    }
  }, [processVideoFrame, videoRef]);

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (requestAnimationRef.current) {
      cancelAnimationFrame(requestAnimationRef.current);
    }
    setCameraActive(false);
    setLandmarks(null);
    isSimulatingRef.current = false;
  }, [videoRef]);

  // Synthetic Landmark Simulation Runner (for instant testing or devices without camera)
  const startSimulation = useCallback(() => {
    stopCamera();
    isSimulatingRef.current = true;
    setCameraActive(true);
    setHasCameraPermission(true);

    let progress = 0; // 0 (up) -> 1 (down) -> 2 (back up)
    let repCycleSpeed = 0.025;

    const simulateLoop = () => {
      if (!isSimulatingRef.current) return;

      progress += repCycleSpeed;
      if (progress >= 2) {
        progress = 0;
      }

      // Harmonic oscillation between up (elbow 165 deg) and down (elbow 75 deg)
      const phase = progress <= 1 ? progress : 2 - progress;
      // y-offset for chest/head descending
      const chestY = 0.45 + phase * 0.18;
      const headY = 0.35 + phase * 0.18;
      const shoulderY = 0.48 + phase * 0.18;
      const elbowX = 0.42 + phase * 0.08;
      const elbowY = 0.58 + phase * 0.06;

      // Synthetic 33 MediaPipe pose landmarks
      const mockLandmarks: NormalizedLandmark[] = Array(33).fill(null).map((_, i) => ({
        x: 0.5,
        y: 0.5,
        z: 0,
        visibility: 0.95,
      }));

      // Key landmarks for pushup side profile (right side)
      mockLandmarks[0] = { x: 0.28, y: headY, z: 0, visibility: 0.98 }; // Nose
      mockLandmarks[12] = { x: 0.38, y: shoulderY, z: 0, visibility: 0.98 }; // Right Shoulder
      mockLandmarks[14] = { x: elbowX, y: elbowY, z: 0, visibility: 0.98 }; // Right Elbow
      mockLandmarks[16] = { x: 0.40, y: 0.72, z: 0, visibility: 0.98 }; // Right Wrist
      mockLandmarks[24] = { x: 0.58, y: 0.52 + phase * 0.12, z: 0, visibility: 0.98 }; // Right Hip
      mockLandmarks[26] = { x: 0.70, y: 0.62 + phase * 0.06, z: 0, visibility: 0.98 }; // Right Knee
      mockLandmarks[28] = { x: 0.82, y: 0.72, z: 0, visibility: 0.98 }; // Right Ankle

      // Left side mirrored slightly
      mockLandmarks[11] = { x: 0.36, y: shoulderY, z: 0.05, visibility: 0.85 };
      mockLandmarks[13] = { x: elbowX - 0.02, y: elbowY, z: 0.05, visibility: 0.85 };
      mockLandmarks[15] = { x: 0.38, y: 0.72, z: 0.05, visibility: 0.85 };
      mockLandmarks[23] = { x: 0.56, y: 0.52 + phase * 0.12, z: 0.05, visibility: 0.85 };
      mockLandmarks[25] = { x: 0.68, y: 0.62 + phase * 0.06, z: 0.05, visibility: 0.85 };
      mockLandmarks[27] = { x: 0.80, y: 0.72, z: 0.05, visibility: 0.85 };

      setLandmarks(mockLandmarks);
      setFps(30);

      requestAnimationRef.current = requestAnimationFrame(simulateLoop);
    };

    requestAnimationRef.current = requestAnimationFrame(simulateLoop);
  }, [stopCamera]);

  return {
    isModelLoading,
    modelError,
    hasCameraPermission,
    cameraActive,
    landmarks,
    fps,
    startCamera,
    stopCamera,
    startSimulation,
    isSimulating: isSimulatingRef.current,
  };
}
