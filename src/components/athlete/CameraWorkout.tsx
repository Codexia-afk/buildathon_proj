import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, AlertCircle, RefreshCw, UserCheck, ShieldCheck, Play, MonitorPlay } from 'lucide-react';
import { AthleteProfile, AssessmentResult } from '../../types';
import { usePoseDetection } from '../../hooks/usePoseDetection';
import { usePushUpCounter } from '../../hooks/usePushUpCounter';
import { PoseSkeletonCanvas } from './PoseSkeletonCanvas';
import { LiveFormHUD } from './LiveFormHUD';
import { VerifiedResultCard } from './VerifiedResultCard';
import { calculatePercentile } from '../../services/percentileEngine';
import { saveAssessment } from '../../services/dataService';
import { Button } from '../common/Button';

interface CameraWorkoutProps {
  athlete: AthleteProfile;
  onProfileEdit: () => void;
}

export const CameraWorkout: React.FC<CameraWorkoutProps> = ({
  athlete,
  onProfileEdit,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [completedAssessment, setCompletedAssessment] = useState<AssessmentResult | null>(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });

  const {
    isModelLoading,
    modelError,
    hasCameraPermission,
    cameraActive,
    landmarks,
    fps,
    startCamera,
    stopCamera,
    startSimulation,
    isSimulating,
  } = usePoseDetection(videoRef);

  const {
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
  } = usePushUpCounter(landmarks);

  // Auto-start camera when mounting
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Handle video loaded metadata to adapt canvas
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDimensions({
        width: videoRef.current.videoWidth || 640,
        height: videoRef.current.videoHeight || 480,
      });
    }
  };

  // Finish workout & construct verified result
  const handleFinishWorkout = async () => {
    const biomechanics = finishWorkout();
    
    // Calculate final percentile
    const percentileData = calculatePercentile(
      repCount,
      athlete.age,
      athlete.gender
    );

    const verificationHash = `TL-${percentileData.percentileRounded}-${athlete.state.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const assessment: AssessmentResult = {
      id: `ass_${Date.now()}`,
      athleteId: athlete.id,
      athleteName: athlete.fullName,
      age: athlete.age,
      gender: athlete.gender,
      state: athlete.state,
      district: athlete.district,
      sport: athlete.primarySport,
      testType: 'pushups_standard',
      repsCount: repCount,
      durationSeconds: Math.max(1, elapsedSeconds),
      percentile: percentileData.percentile,
      talentTier: percentileData.talentTier,
      biomechanics,
      verificationHash,
      verifiedAt: new Date().toISOString(),
      status: 'verified',
      scoutNotes: [],
      shortlistedBy: [],
    };

    // Auto-save to Firestore / local realtime
    await saveAssessment(assessment);
    setCompletedAssessment(assessment);
  };

  const handleRetest = () => {
    setCompletedAssessment(null);
    resetWorkout();
    startCamera();
  };

  // If workout is completed, show the Verified Result Card!
  if (completedAssessment) {
    return (
      <VerifiedResultCard
        athlete={athlete}
        assessment={completedAssessment}
        onRetest={handleRetest}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Athlete Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-card-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">{athlete.fullName}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {athlete.age}y • {athlete.gender}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {athlete.primarySport} • {athlete.state} ({athlete.district})
            </p>
          </div>
        </div>

        <button
          onClick={onProfileEdit}
          className="text-xs font-semibold text-brand hover:text-brand-400 underline underline-offset-4 transition-colors"
        >
          Edit Profile Details
        </button>
      </div>

      {/* Main Camera Assessment Frame */}
      <div className="relative aspect-video w-full max-h-[680px] bg-slate-950 rounded-3xl border-2 border-card-border overflow-hidden shadow-2xl flex items-center justify-center">
        
        {/* Realtime Video Stream */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          onLoadedMetadata={handleLoadedMetadata}
          className={`w-full h-full object-cover transform -scale-x-100 ${
            !cameraActive ? 'hidden' : 'block'
          }`}
        />

        {/* AI MediaPipe Landmark Skeleton Canvas */}
        {cameraActive && (
          <PoseSkeletonCanvas
            landmarks={landmarks}
            currentElbowAngle={currentElbowAngle}
            currentPlankAngle={currentPlankAngle}
            activeSide={activeSide}
            targetDepthReached={currentElbowAngle <= 90}
            videoWidth={videoDimensions.width}
            videoHeight={videoDimensions.height}
          />
        )}

        {/* Live Form HUD Overlay */}
        {cameraActive && (
          <LiveFormHUD
            workoutState={workoutState}
            repCount={repCount}
            incompleteCount={incompleteCount}
            currentElbowAngle={currentElbowAngle}
            currentPlankAngle={currentPlankAngle}
            depthProgress={depthProgress}
            feedbackMessage={feedbackMessage}
            feedbackType={feedbackType}
            elapsedSeconds={elapsedSeconds}
            cadenceRpm={cadenceRpm}
            formScore={formScore}
            fps={fps}
            isSimulating={isSimulating}
            onStart={startWorkout}
            onPause={pauseWorkout}
            onResume={resumeWorkout}
            onFinish={handleFinishWorkout}
            onReset={resetWorkout}
            onToggleSimulation={() => {
              if (isSimulating) {
                startCamera();
              } else {
                startSimulation();
              }
            }}
          />
        )}

        {/* Loading MediaPipe Vision Model State */}
        {isModelLoading && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-30">
            <div className="w-12 h-12 rounded-2xl border-4 border-brand border-t-transparent animate-spin" />
            <div>
              <h4 className="text-lg font-bold text-white">Initializing AI Pose Engine</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Loading client-side MediaPipe Tasks Vision model directly into your browser...
              </p>
            </div>
          </div>
        )}

        {/* Camera Permission Denied / No Webcam State */}
        {!isModelLoading && hasCameraPermission === false && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center space-y-6 z-30">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CameraOff className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-2">
              <h4 className="text-xl font-bold text-white">Camera Access Required</h4>
              <p className="text-sm text-slate-400">
                To perform real-time push-up counting and biomechanics verification, please allow camera permissions in your browser.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={startCamera}
                variant="primary"
                size="md"
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Retry Camera Access
              </Button>

              <Button
                onClick={startSimulation}
                variant="secondary"
                size="md"
                leftIcon={<MonitorPlay className="w-4 h-4" />}
              >
                Run AI Push-Up Simulation Demo
              </Button>
            </div>
          </div>
        )}

        {/* Model Error Fallback */}
        {modelError && (
          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-amber-950/90 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between z-30">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{modelError}</span>
            </div>
            <button
              onClick={startSimulation}
              className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 text-xs"
            >
              Use Simulation
            </button>
          </div>
        )}

      </div>

      {/* Protocol Guidance Banner */}
      <div className="p-4 rounded-2xl bg-card/60 border border-card-border text-xs text-slate-400 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full bg-brand/20 text-brand font-bold flex items-center justify-center shrink-0">1</span>
          <p><strong className="text-slate-200">Side Angle View:</strong> Position camera perpendicular to your side for accurate 90° elbow tracking.</p>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full bg-brand/20 text-brand font-bold flex items-center justify-center shrink-0">2</span>
          <p><strong className="text-slate-200">Full Range of Motion:</strong> Lower until elbow bends &lt; 90°, then push up to full lockout &gt; 155°.</p>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full bg-brand/20 text-brand font-bold flex items-center justify-center shrink-0">3</span>
          <p><strong className="text-slate-200">Plank Stability:</strong> Keep torso aligned from shoulders to ankles to maintain 100% form score.</p>
        </div>
      </div>

    </div>
  );
};
