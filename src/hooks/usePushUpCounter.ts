import { useState, useEffect, useRef } from 'react';
import { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { calculateJointAngle, calculatePlankAlignment } from '../utils/geometry';
import { soundFx } from '../services/audioService';
import { PushUpBiomechanics } from '../types';

export type WorkoutState = 'idle' | 'calibrating' | 'ready' | 'going_down' | 'bottom_reached' | 'going_up' | 'paused' | 'completed';

export interface PushUpCounterHook {
  workoutState: WorkoutState;
  repCount: number;
  incompleteCount: number;
  currentElbowAngle: number;
  currentPlankAngle: number;
  depthProgress: number; // 0-100%
  feedbackMessage: string;
  feedbackType: 'info' | 'success' | 'warning' | 'error';
  elapsedSeconds: number;
  cadenceRpm: number;
  formScore: number;
  activeSide: 'left' | 'right' | 'none';
  startWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  finishWorkout: () => PushUpBiomechanics;
  resetWorkout: () => void;
}

const UP_ANGLE_THRESHOLD = 155; // Arm extension
const DOWN_ANGLE_THRESHOLD = 90; // Chest depth
const WARNING_COOLDOWN_MS = 2500;

export function usePushUpCounter(landmarks: NormalizedLandmark[] | null): PushUpCounterHook {
  const [workoutState, setWorkoutState] = useState<WorkoutState>('idle');
  const [repCount, setRepCount] = useState<number>(0);
  const [incompleteCount, setIncompleteCount] = useState<number>(0);
  const [currentElbowAngle, setCurrentElbowAngle] = useState<number>(180);
  const [currentPlankAngle, setCurrentPlankAngle] = useState<number>(180);
  const [depthProgress, setDepthProgress] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Align your body sideways in view to begin');
  const [feedbackType, setFeedbackType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [cadenceRpm, setCadenceRpm] = useState<number>(0);
  const [formScore, setFormScore] = useState<number>(100);
  const [activeSide, setActiveSide] = useState<'left' | 'right' | 'none'>('none');

  // Internal tracking refs
  const stateRef = useRef<WorkoutState>('idle');
  const repCountRef = useRef<number>(0);
  const incompleteCountRef = useRef<number>(0);
  const minAngleInCurrentRepRef = useRef<number>(180);
  const repStartTimeRef = useRef<number>(Date.now());
  const repDurationsRef = useRef<number[]>([]);
  const elbowAnglesRecordRef = useRef<number[]>([]);
  const plankAnglesRecordRef = useRef<number[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastWarningTimeRef = useRef<number>(0);
  const isDownReachedRef = useRef<boolean>(false);

  // Sync ref with state
  useEffect(() => {
    stateRef.current = workoutState;
  }, [workoutState]);

  // Timer runner
  useEffect(() => {
    if (workoutState !== 'idle' && workoutState !== 'paused' && workoutState !== 'completed') {
      if (!timerIntervalRef.current) {
        timerIntervalRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      }
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [workoutState]);

  // Update cadence
  useEffect(() => {
    if (elapsedSeconds > 5 && repCount > 0) {
      const rpm = Math.round((repCount / (elapsedSeconds / 60)) * 10) / 10;
      setCadenceRpm(rpm);
    }
  }, [elapsedSeconds, repCount]);

  // Biomechanics evaluation loop
  useEffect(() => {
    if (workoutState === 'idle' || workoutState === 'paused' || workoutState === 'completed') {
      return;
    }

    if (!landmarks || landmarks.length < 33) {
      setFeedbackMessage('Athlete not detected. Move into camera view.');
      setFeedbackType('warning');
      setActiveSide('none');
      return;
    }

    // MediaPipe Pose indices:
    // Left: shoulder=11, elbow=13, wrist=15, hip=23, knee=25, ankle=27
    // Right: shoulder=12, elbow=14, wrist=16, hip=24, knee=26, ankle=28
    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftWrist = landmarks[15];
    const leftHip = landmarks[23];
    const leftAnkle = landmarks[27];

    const rightShoulder = landmarks[12];
    const rightElbow = landmarks[14];
    const rightWrist = landmarks[16];
    const rightHip = landmarks[24];
    const rightAnkle = landmarks[28];

    // Check visibility confidence
    const leftVisibility = (leftShoulder.visibility || 0) + (leftElbow.visibility || 0) + (leftWrist.visibility || 0);
    const rightVisibility = (rightShoulder.visibility || 0) + (rightElbow.visibility || 0) + (rightWrist.visibility || 0);

    const side = rightVisibility >= leftVisibility ? 'right' : 'left';
    setActiveSide(side);

    const shoulder = side === 'right' ? rightShoulder : leftShoulder;
    const elbow = side === 'right' ? rightElbow : leftElbow;
    const wrist = side === 'right' ? rightWrist : leftWrist;
    const hip = side === 'right' ? rightHip : leftHip;
    const ankle = side === 'right' ? rightAnkle : leftAnkle;

    const elbowAngle = calculateJointAngle(shoulder, elbow, wrist);
    const plankAngle = calculatePlankAlignment(shoulder, hip, ankle);

    setCurrentElbowAngle(elbowAngle);
    setCurrentPlankAngle(plankAngle);

    // Track minimum elbow angle reached in current rep
    if (elbowAngle < minAngleInCurrentRepRef.current) {
      minAngleInCurrentRepRef.current = elbowAngle;
    }

    // Record data for final biomechanics report
    elbowAnglesRecordRef.current.push(elbowAngle);
    plankAnglesRecordRef.current.push(plankAngle);

    // Calculate depth progress (180 deg = 0%, 90 deg = 100%)
    const rawProgress = Math.max(0, Math.min(100, Math.round(((UP_ANGLE_THRESHOLD - elbowAngle) / (UP_ANGLE_THRESHOLD - DOWN_ANGLE_THRESHOLD)) * 100)));
    setDepthProgress(rawProgress);

    // Check plank alignment (hip sag / pike warning)
    const now = Date.now();
    if (plankAngle < 145 || plankAngle > 200) {
      if (now - lastWarningTimeRef.current > WARNING_COOLDOWN_MS) {
        soundFx.playFormWarning();
        lastWarningTimeRef.current = now;
      }
      setFeedbackMessage('⚠️ Keep your back straight (avoid hip sag)');
      setFeedbackType('warning');
    }

    // State Machine Transitions
    const currentState = stateRef.current;

    if (currentState === 'calibrating') {
      if (elbowAngle >= UP_ANGLE_THRESHOLD - 5) {
        setWorkoutState('ready');
        setFeedbackMessage('Plank locked! Lower your chest to begin.');
        setFeedbackType('success');
        minAngleInCurrentRepRef.current = 180;
        isDownReachedRef.current = false;
      } else {
        setFeedbackMessage('Lock arms straight in plank position (> 155°)');
        setFeedbackType('info');
      }
      return;
    }

    if (currentState === 'ready') {
      if (elbowAngle < 140) {
        setWorkoutState('going_down');
        setFeedbackMessage('Going down... Aim for 90° elbow bend');
        setFeedbackType('info');
        repStartTimeRef.current = Date.now();
      }
      return;
    }

    if (currentState === 'going_down') {
      if (elbowAngle <= DOWN_ANGLE_THRESHOLD) {
        setWorkoutState('bottom_reached');
        isDownReachedRef.current = true;
        soundFx.playBottomReach();
        setFeedbackMessage('✓ Target depth reached! Now push up!');
        setFeedbackType('success');
      } else if (elbowAngle > 150) {
        // User aborted rep halfway without going down
        setWorkoutState('ready');
        incompleteCountRef.current += 1;
        setIncompleteCount(incompleteCountRef.current);
        setFeedbackMessage('Rep incomplete: did not reach 90° depth');
        setFeedbackType('warning');
      }
      return;
    }

    if (currentState === 'bottom_reached') {
      if (elbowAngle > 105) {
        setWorkoutState('going_up');
        setFeedbackMessage('Pushing up! Extend arms fully');
        setFeedbackType('info');
      }
      return;
    }

    if (currentState === 'going_up') {
      if (elbowAngle >= UP_ANGLE_THRESHOLD) {
        // Rep successfully completed!
        repCountRef.current += 1;
        setRepCount(repCountRef.current);
        soundFx.playRepCounted();

        const duration = (Date.now() - repStartTimeRef.current) / 1000;
        repDurationsRef.current.push(duration);

        // Calculate running form quality score
        const formDeductions = Math.min(30, incompleteCountRef.current * 5);
        const newScore = Math.max(70, Math.round(100 - formDeductions));
        setFormScore(newScore);

        setWorkoutState('ready');
        setFeedbackMessage(`Rep ${repCountRef.current} counted! Keep the pace.`);
        setFeedbackType('success');
        minAngleInCurrentRepRef.current = 180;
        isDownReachedRef.current = false;
      }
    }
  }, [landmarks, workoutState]);

  const startWorkout = () => {
    setWorkoutState('calibrating');
    setRepCount(0);
    setIncompleteCount(0);
    setElapsedSeconds(0);
    setCadenceRpm(0);
    setFormScore(100);
    repCountRef.current = 0;
    incompleteCountRef.current = 0;
    repDurationsRef.current = [];
    elbowAnglesRecordRef.current = [];
    plankAnglesRecordRef.current = [];
    minAngleInCurrentRepRef.current = 180;
    setFeedbackMessage('Starting calibration... Assume push-up position');
    setFeedbackType('info');
  };

  const pauseWorkout = () => {
    setWorkoutState('paused');
    setFeedbackMessage('Workout paused');
    setFeedbackType('info');
  };

  const resumeWorkout = () => {
    setWorkoutState('ready');
    setFeedbackMessage('Resumed. Lower down for next rep.');
    setFeedbackType('info');
  };

  const resetWorkout = () => {
    setWorkoutState('idle');
    setRepCount(0);
    setIncompleteCount(0);
    setElapsedSeconds(0);
    setCadenceRpm(0);
    setDepthProgress(0);
    setFeedbackMessage('Align your body sideways in view to begin');
    setFeedbackType('info');
    repCountRef.current = 0;
    incompleteCountRef.current = 0;
  };

  const finishWorkout = (): PushUpBiomechanics => {
    setWorkoutState('completed');
    soundFx.playCompletionFanfare();

    const avgElbow = elbowAnglesRecordRef.current.length > 0
      ? Math.round(elbowAnglesRecordRef.current.reduce((a, b) => a + b, 0) / elbowAnglesRecordRef.current.length)
      : 80;

    const avgPlank = plankAnglesRecordRef.current.length > 0
      ? Math.round(plankAnglesRecordRef.current.reduce((a, b) => a + b, 0) / plankAnglesRecordRef.current.length)
      : 172;

    const fastestRep = repDurationsRef.current.length > 0
      ? Math.min(...repDurationsRef.current)
      : 1.2;

    const finalRpm = elapsedSeconds > 0 ? Math.round((repCountRef.current / (elapsedSeconds / 60)) * 10) / 10 : 0;
    const finalFormScore = Math.max(60, Math.round(100 - (incompleteCountRef.current * 6)));

    return {
      averageElbowFlexion: avgElbow,
      averageTrunkAlignment: avgPlank,
      formScore: finalFormScore,
      incompletedReps: incompleteCountRef.current,
      cadenceRepsPerMin: finalRpm,
      peakSpeedSec: Math.round(fastestRep * 100) / 100,
    };
  };

  return {
    workoutState,
    repCount,
    incompleteCount,
    currentElbowAngle,
    currentPlankAngle,
    depthProgress,
    feedbackMessage,
    feedbackType,
    elapsedSeconds,
    cadenceRpm,
    formScore,
    activeSide,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    finishWorkout,
    resetWorkout,
  };
}
