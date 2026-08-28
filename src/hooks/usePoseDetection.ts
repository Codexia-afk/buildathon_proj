import { useState, useEffect, useRef, useCallback } from 'react';
import { FilesetResolver, PoseLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { TestType } from '../types';

export interface PoseDetectionState {
  isModelLoading: boolean;
  modelError: string | null;
  hasCameraPermission: boolean | null;
  landmarks: NormalizedLandmark[] | null;
  cameraActive: boolean;
  fps: number;
  facingMode: 'user' | 'environment';
}

export function usePoseDetection(videoRef: React.RefObject<HTMLVideoElement>) {
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const requestAnimationRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(Date.now());
  const isSimulatingRef = useRef<boolean>(false);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
          setModelError("Could not load AI vision model. Please check internet connection or switch to AI simulation mode.");
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
          console.warn("Inference error:", e);
        }
      }
    }

    if (!isSimulatingRef.current) {
      requestAnimationRef.current = requestAnimationFrame(processVideoFrame);
    }
  }, [videoRef]);

  // Start Camera Stream
  const startCamera = useCallback(async (desiredFacingMode: 'user' | 'environment' = facingMode) => {
    try {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
      isSimulatingRef.current = false;
      setIsSimulating(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: desiredFacingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraActive(true);
          setHasCameraPermission(true);
          requestAnimationRef.current = requestAnimationFrame(processVideoFrame);
        };
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      setHasCameraPermission(false);
      setCameraActive(false);
    }
  }, [processVideoFrame, videoRef, facingMode]);

  // Stop Camera Stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (requestAnimationRef.current) {
      cancelAnimationFrame(requestAnimationRef.current);
      requestAnimationRef.current = null;
    }
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setCameraActive(false);
    setLandmarks(null);
  }, [videoRef]);

  // Flip Camera between front & rear
  const toggleFacingMode = useCallback(() => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (cameraActive) {
      startCamera(nextMode);
    }
  }, [facingMode, cameraActive, startCamera]);

  // Multi-Exercise AI Simulation Engine
  const startSimulation = useCallback((activeTestType: TestType = 'pushups_standard') => {
    stopCamera();
    isSimulatingRef.current = true;
    setIsSimulating(true);
    setCameraActive(true);
    setHasCameraPermission(true);
    setFps(30);

    let frame = 0;

    simulationIntervalRef.current = setInterval(() => {
      frame += 1;
      const t = frame * 0.05; // time progression

      const fakeLandmarks: NormalizedLandmark[] = Array.from({ length: 33 }, () => ({
        x: 0.5,
        y: 0.5,
        z: 0,
        visibility: 0.95,
      }));

      // Head
      fakeLandmarks[0] = { x: 0.28, y: 0.42, z: 0, visibility: 0.98 };

      if (activeTestType === 'pushups_standard') {
        // Push-up cycle (period ~2.5 seconds)
        const progress = (Math.sin(t * 2.5) + 1) / 2; // 0 (bottom) to 1 (top)
        const shoulderY = 0.55 - progress * 0.15; // 0.40 (top) to 0.55 (bottom)
        const hipY = 0.52 - progress * 0.14;
        const elbowX = 0.38 - (1 - progress) * 0.05;
        const elbowY = 0.52 + (1 - progress) * 0.04;

        fakeLandmarks[12] = { x: 0.35, y: shoulderY, z: 0, visibility: 0.99 }; // Right shoulder
        fakeLandmarks[14] = { x: elbowX, y: elbowY, z: 0, visibility: 0.99 };  // Right elbow
        fakeLandmarks[16] = { x: 0.36, y: 0.68, z: 0, visibility: 0.99 };     // Right wrist
        fakeLandmarks[24] = { x: 0.58, y: hipY, z: 0, visibility: 0.99 };      // Right hip
        fakeLandmarks[26] = { x: 0.72, y: hipY + 0.05, z: 0, visibility: 0.98 }; // Right knee
        fakeLandmarks[28] = { x: 0.84, y: 0.70, z: 0, visibility: 0.99 };     // Right ankle
      } 
      else if (activeTestType === 'squats_standard') {
        // Squat cycle (period ~2.8 seconds)
        const progress = (Math.sin(t * 2.2) + 1) / 2; // 0 (bottom parallel) to 1 (standing)
        const hipY = 0.62 - progress * 0.22; // 0.40 (standing) to 0.62 (squat depth)
        const shoulderY = hipY - 0.25;
        const kneeY = 0.65;
        const kneeX = 0.48 + (1 - progress) * 0.04;

        fakeLandmarks[12] = { x: 0.48, y: shoulderY, z: 0, visibility: 0.99 };
        fakeLandmarks[14] = { x: 0.42, y: shoulderY + 0.1, z: 0, visibility: 0.99 };
        fakeLandmarks[16] = { x: 0.45, y: shoulderY + 0.2, z: 0, visibility: 0.99 };
        fakeLandmarks[24] = { x: 0.50, y: hipY, z: 0, visibility: 0.99 };
        fakeLandmarks[26] = { x: kneeX, y: kneeY, z: 0, visibility: 0.99 };
        fakeLandmarks[28] = { x: 0.50, y: 0.88, z: 0, visibility: 0.99 };
      }
      else if (activeTestType === 'plank_hold') {
        // Plank hold: solid steady straight line with minor natural breathing oscillation
        const breath = Math.sin(t * 1.2) * 0.004;
        fakeLandmarks[12] = { x: 0.32, y: 0.50 + breath, z: 0, visibility: 0.99 };
        fakeLandmarks[14] = { x: 0.32, y: 0.65, z: 0, visibility: 0.99 };
        fakeLandmarks[16] = { x: 0.38, y: 0.65, z: 0, visibility: 0.99 };
        fakeLandmarks[24] = { x: 0.56, y: 0.51 + breath, z: 0, visibility: 0.99 };
        fakeLandmarks[26] = { x: 0.70, y: 0.53 + breath, z: 0, visibility: 0.98 };
        fakeLandmarks[28] = { x: 0.84, y: 0.55, z: 0, visibility: 0.99 };
      }
      else if (activeTestType === 'vertical_jump') {
        // Vertical jump cycle: stand (2s) -> dip (1s) -> explode airborne (0.6s) -> land
        const cycle = (t % 4.0);
        let hipY = 0.50;
        let ankleY = 0.85;
        let kneeY = 0.68;

        if (cycle < 1.5) {
          // Standing ready
          hipY = 0.48;
          ankleY = 0.85;
          kneeY = 0.67;
        } else if (cycle < 2.3) {
          // Squat dip
          hipY = 0.62;
          ankleY = 0.85;
          kneeY = 0.70;
        } else if (cycle < 3.0) {
          // Airborne jump
          const jumpPhase = (cycle - 2.3) / 0.7; // 0 to 1
          const jumpOffset = Math.sin(jumpPhase * Math.PI) * 0.22;
          hipY = 0.48 - jumpOffset;
          kneeY = 0.67 - jumpOffset;
          ankleY = 0.85 - jumpOffset;
        } else {
          // Landed
          hipY = 0.52;
          ankleY = 0.85;
          kneeY = 0.68;
        }

        fakeLandmarks[12] = { x: 0.50, y: hipY - 0.25, z: 0, visibility: 0.99 };
        fakeLandmarks[14] = { x: 0.45, y: hipY - 0.15, z: 0, visibility: 0.99 };
        fakeLandmarks[16] = { x: 0.48, y: hipY, z: 0, visibility: 0.99 };
        fakeLandmarks[24] = { x: 0.50, y: hipY, z: 0, visibility: 0.99 };
        fakeLandmarks[26] = { x: 0.50, y: kneeY, z: 0, visibility: 0.99 };
        fakeLandmarks[28] = { x: 0.50, y: ankleY, z: 0, visibility: 0.99 };
      }

      setLandmarks(fakeLandmarks);
    }, 33);
  }, [stopCamera]);

  return {
    isModelLoading,
    modelError,
    hasCameraPermission,
    cameraActive,
    landmarks,
    fps,
    isSimulating,
    facingMode,
    startCamera,
    stopCamera,
    toggleFacingMode,
    startSimulation,
  };
}
