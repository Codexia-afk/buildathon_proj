import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, 
  CameraOff, 
  AlertCircle, 
  RefreshCw, 
  UserCheck, 
  ShieldCheck, 
  Play, 
  MonitorPlay,
  Activity,
  Flame,
  Zap,
  Info,
  Maximize2
} from 'lucide-react';
import { AthleteProfile, AssessmentResult, TestType } from '../../types';
import { usePoseDetection } from '../../hooks/usePoseDetection';
import { useExerciseEngine } from '../../hooks/useExerciseEngine';
import { PoseSkeletonCanvas } from './PoseSkeletonCanvas';
import { LiveFormHUD } from './LiveFormHUD';
import { VerifiedResultCard } from './VerifiedResultCard';
import { calculatePercentile, EXERCISE_CONFIGS, getSportProfile, SPORT_TRAINING_DATABASE } from '../../services/percentileEngine';
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedSport, setSelectedSport] = useState<string>(athlete.primarySport || 'Cricket');
  const [activeTest, setActiveTest] = useState<TestType>('vertical_jump');
  const [completedAssessment, setCompletedAssessment] = useState<AssessmentResult | null>(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const {
    isModelLoading,
    modelError,
    hasCameraPermission,
    cameraActive,
    landmarks,
    fps,
    startCamera,
    stopCamera,
    toggleFacingMode,
    startSimulation,
    isSimulating,
  } = usePoseDetection(videoRef);

  const {
    testType,
    setTestType,
    workoutState,
    score,
    incompleteCount,
    currentPrimaryAngle,
    currentSecondaryAngle,
    depthProgress,
    feedbackMessage,
    feedbackType,
    elapsedSeconds,
    cadenceRpm,
    formScore,
    activeSide,
    peakJumpCm,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    finishWorkout,
    resetWorkout,
  } = useExerciseEngine(landmarks, activeTest);

  // Sync test type
  const handleSelectTest = (type: TestType) => {
    setActiveTest(type);
    setTestType(type);
    if (isSimulating) {
      startSimulation(type);
    }
  };

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

  // Toggle fullscreen mode
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Finish workout & construct verified result
  const handleFinishWorkout = async () => {
    const biomechanics = finishWorkout();
    const currentConfig = EXERCISE_CONFIGS[activeTest];
    
    // Calculate final percentile
    const percentileData = calculatePercentile(
      score,
      athlete.age,
      athlete.gender,
      activeTest
    );

    const stateCode = athlete.state.slice(0, 3).toUpperCase();
    const randomSalt = Math.random().toString(36).substring(2, 6).toUpperCase();
    const verificationHash = `TL-${percentileData.percentileRounded}-${stateCode}-${randomSalt}`;

    const assessment: AssessmentResult = {
      id: `ass_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      athleteId: athlete.id,
      athleteName: athlete.fullName,
      age: athlete.age,
      gender: athlete.gender,
      state: athlete.state,
      district: athlete.district,
      sport: athlete.primarySport,
      testType: activeTest,
      score: score,
      repsCount: activeTest === 'pushups_standard' || activeTest === 'squats_standard' ? score : undefined,
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

  const currentConfig = EXERCISE_CONFIGS[activeTest];

  return (
    <div className="space-y-6">
      
      {/* If Workout is completed, display the Verified Credential Result Card */}
      {completedAssessment ? (
        <VerifiedResultCard
          athlete={athlete}
          assessment={completedAssessment}
          onRetest={handleRetest}
        />
      ) : (
        <div className="space-y-4">
          
          {/* Sport Selection Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {Object.keys(SPORT_TRAINING_DATABASE).map((sp) => {
              const profile = SPORT_TRAINING_DATABASE[sp];
              const isSelected = selectedSport === sp;
              return (
                <button
                  key={sp}
                  onClick={() => {
                    if (workoutState === 'idle') {
                      setSelectedSport(sp);
                      if (profile.recommendedDrills[0]) {
                        handleSelectTest(profile.recommendedDrills[0].exerciseType);
                      }
                    }
                  }}
                  disabled={workoutState !== 'idle'}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-brand text-white border-brand shadow-[0_0_15px_rgba(255,77,0,0.3)]'
                      : 'bg-card text-slate-400 border-card-border hover:border-slate-600 hover:text-slate-200'
                  } ${workoutState !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span>{profile.iconEmoji}</span>
                  <span>{sp}</span>
                </button>
              );
            })}
          </div>

          {/* Sport Battery Drill Tabs */}
          {(() => {
            const currentProfile = getSportProfile(selectedSport);
            const currentDrill = currentProfile.recommendedDrills.find(d => d.exerciseType === activeTest);

            return (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {currentProfile.recommendedDrills.map((drill) => {
                    const cfg = EXERCISE_CONFIGS[drill.exerciseType];
                    const isSelected = activeTest === drill.exerciseType;
                    return (
                      <button
                        key={drill.exerciseType}
                        onClick={() => handleSelectTest(drill.exerciseType)}
                        disabled={workoutState !== 'idle'}
                        className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-card border-brand/60 shadow-[0_0_20px_rgba(255,77,0,0.18)] text-white'
                            : 'bg-card/40 border-card-border/70 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                        } ${workoutState !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                            {drill.importanceTier.split(' ')[0]}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                          )}
                        </div>
                        <div>
                          <h3 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {cfg.name}
                          </h3>
                          <p className="text-[10px] text-brand-400 font-mono font-semibold mt-0.5">
                            {drill.gymTargetScore}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sport Drill Rationale & Coaching Tip Callout */}
                {currentDrill && (
                  <div className="p-3.5 rounded-2xl bg-cyber-500/10 border border-cyber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-cyber-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-200">
                          <span className="text-cyber-400 font-mono">{currentProfile.iconEmoji} {selectedSport} Quality:</span> {currentDrill.roleRationale}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          💡 <span className="text-slate-300 font-medium">Coaching Tip:</span> {currentProfile.gymCoachingTip}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}


          {/* Camera Frame Container */}
          <div 
            ref={containerRef}
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[640px] bg-slate-950 rounded-3xl overflow-hidden border-2 border-card-border shadow-2xl flex items-center justify-center"
          >
            
            {/* Background Webcam Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={handleLoadedMetadata}
              className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
            />

            {/* AI Skeleton Overlay Canvas */}
            <PoseSkeletonCanvas
              landmarks={landmarks}
              testType={activeTest}
              currentPrimaryAngle={currentPrimaryAngle}
              currentSecondaryAngle={currentSecondaryAngle}
              activeSide={activeSide}
              targetDepthReached={depthProgress >= 100}
              videoWidth={videoDimensions.width}
              videoHeight={videoDimensions.height}
            />

            {/* Interactive Live Form HUD Overlay */}
            <LiveFormHUD
              testType={activeTest}
              workoutState={workoutState}
              score={score}
              incompleteCount={incompleteCount}
              currentPrimaryAngle={currentPrimaryAngle}
              currentSecondaryAngle={currentSecondaryAngle}
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
                  startSimulation(activeTest);
                }
              }}
              onFlipCamera={toggleFacingMode}
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={isFullscreen}
            />

            {/* Loading AI State */}
            {isModelLoading && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
                <div className="relative w-14 h-14">
                  <div className="w-14 h-14 rounded-full border-4 border-brand/20 border-t-brand animate-spin" />
                  <Activity className="w-6 h-6 text-brand absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                    Initializing Edge AI Pose Engine...
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Loading MediaPipe Tasks Vision WebAssembly model directly into browser memory.
                  </p>
                </div>
              </div>
            )}

            {/* Camera Permission Denied / Error State */}
            {hasCameraPermission === false && !isSimulating && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <CameraOff className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Camera Access Required</h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    Please allow camera permissions in your browser to run live pose analysis, or test right now using our AI Simulation Runner.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    onClick={() => startCamera()}
                    variant="outline"
                    size="sm"
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                  >
                    Retry Camera
                  </Button>
                  <Button
                    onClick={() => startSimulation(activeTest)}
                    variant="primary"
                    size="sm"
                    leftIcon={<MonitorPlay className="w-4 h-4" />}
                  >
                    Run AI Simulation Demo
                  </Button>
                </div>
              </div>
            )}

          </div>

          {/* Exercise Instructions & Biomechanics Checklist Box */}
          <div className="p-4 sm:p-5 rounded-3xl bg-card border border-card-border grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <Info className="w-4 h-4 text-cyber" />
                <span>Test Instructions: {currentConfig.name}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentConfig.instructions.map((inst, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand font-bold font-mono shrink-0">{i + 1}.</span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-card-border space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 uppercase">Active Athlete</span>
                <button
                  onClick={onProfileEdit}
                  className="text-brand hover:text-brand-400 text-xs font-bold transition-colors"
                >
                  Edit Profile
                </button>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-white">{athlete.fullName} ({athlete.age} yrs)</p>
                <p className="text-xs text-slate-400 font-mono">{athlete.district}, {athlete.state} · {athlete.primarySport}</p>
              </div>
              <div className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-800 flex items-center justify-between">
                <span>National Standards: SAI Division</span>
                <span className="text-emerald-400 font-bold">100% Client-Side AI</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
