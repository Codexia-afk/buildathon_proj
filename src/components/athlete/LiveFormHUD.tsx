import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Activity, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  MonitorPlay,
  Volume2,
  VolumeX,
  FlipHorizontal,
  Maximize,
  Minimize
} from 'lucide-react';
import { WorkoutState } from '../../hooks/useExerciseEngine';
import { TestType } from '../../types';
import { EXERCISE_CONFIGS } from '../../services/percentileEngine';
import { soundFx } from '../../services/audioService';
import { Button } from '../common/Button';

interface LiveFormHUDProps {
  testType: TestType;
  workoutState: WorkoutState;
  score: number;
  incompleteCount: number;
  currentPrimaryAngle: number;
  currentSecondaryAngle: number;
  depthProgress: number;
  feedbackMessage: string;
  feedbackType: 'info' | 'success' | 'warning' | 'error';
  elapsedSeconds: number;
  cadenceRpm: number;
  formScore: number;
  fps: number;
  isSimulating: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onReset: () => void;
  onToggleSimulation: () => void;
  onFlipCamera?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const LiveFormHUD: React.FC<LiveFormHUDProps> = ({
  testType,
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
  fps,
  isSimulating,
  onStart,
  onPause,
  onResume,
  onFinish,
  onReset,
  onToggleSimulation,
  onFlipCamera,
  onToggleFullscreen,
  isFullscreen = false,
}) => {
  const [voiceOn, setVoiceOn] = useState<boolean>(soundFx.isVoiceEnabled());
  const config = EXERCISE_CONFIGS[testType] || EXERCISE_CONFIGS.pushups_standard;

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    soundFx.setVoiceEnabled(next);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const isWorkingOut = workoutState !== 'idle' && workoutState !== 'completed';

  const feedbackColors = {
    info: 'bg-slate-950/90 border-card-border text-slate-200',
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    warning: 'bg-amber-950/90 border-amber-500/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    error: 'bg-red-950/90 border-red-500/50 text-red-300',
  };

  const getPrimaryLabel = () => {
    if (testType === 'pushups_standard') return 'Elbow Flexion';
    if (testType === 'squats_standard') return 'Knee Flexion';
    if (testType === 'plank_hold') return 'Spine Alignment';
    return 'Knee Angle';
  };

  const getSecondaryLabel = () => {
    if (testType === 'pushups_standard') return 'Trunk Alignment';
    if (testType === 'squats_standard') return 'Hip Flexion';
    if (testType === 'plank_hold') return 'Core Lock';
    return 'Takeoff Elevation';
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 z-20">
      
      {/* Top Bar HUD */}
      <div className="flex items-start justify-between gap-2 sm:gap-4 pointer-events-auto">
        
        {/* Live Timer & Cadence */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-card-border flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isWorkingOut ? 'bg-red-500 animate-ping' : 'bg-slate-500'}`} />
            <span className="font-mono text-base sm:text-lg font-bold text-white tracking-widest">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          {(testType === 'pushups_standard' || testType === 'squats_standard') && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-card-border text-xs">
              <Activity className="w-3.5 h-3.5 text-brand" />
              <span className="text-slate-400">Cadence:</span>
              <span className="font-mono font-bold text-white">{cadenceRpm} RPM</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-card-border text-xs font-mono text-slate-400">
            <span>{fps} FPS</span>
          </div>
        </div>

        {/* Action Controls: Voice Coach, Flip Camera, Sim Mode, Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Voice Coach Toggle */}
          <button
            onClick={toggleVoice}
            title={voiceOn ? 'Voice Coach Active' : 'Voice Coach Muted'}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              voiceOn 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                : 'bg-slate-950/80 border-card-border text-slate-400'
            }`}
          >
            {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden lg:inline">{voiceOn ? 'Voice Coach ON' : 'Voice Muted'}</span>
          </button>

          {/* Flip Camera Button (Mobile) */}
          {onFlipCamera && (
            <button
              onClick={onFlipCamera}
              title="Flip Front/Rear Camera"
              className="p-2 rounded-xl bg-slate-950/80 border border-card-border text-slate-300 hover:text-white transition-all"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-2 rounded-xl bg-slate-950/80 border border-card-border text-slate-300 hover:text-white transition-all"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          )}

          {/* Live Simulation Mode Switcher */}
          <button
            onClick={onToggleSimulation}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSimulating
                ? 'bg-cyber/20 border-cyber text-cyber shadow-glow-cyber'
                : 'bg-slate-950/80 border-card-border text-slate-400 hover:text-white'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isSimulating ? 'Simulating Athlete' : 'Simulate AI'}</span>
          </button>
        </div>
      </div>

      {/* Center Biomechanics Real-Time Feedback Banner */}
      <div className="flex flex-col items-center justify-center my-auto pointer-events-auto px-2">
        <div
          className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl border backdrop-blur-lg text-xs sm:text-sm font-semibold flex items-center gap-2 max-w-md text-center transition-all transform duration-200 ${
            feedbackColors[feedbackType]
          }`}
        >
          {feedbackType === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
          {feedbackType === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
          {feedbackType === 'info' && <Zap className="w-4 h-4 text-brand shrink-0" />}
          <span>{feedbackMessage}</span>
        </div>
      </div>

      {/* Bottom Bar: Rep Counter + Depth Gauge + Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-end pointer-events-auto">
        
        {/* Left: Joint Angles Monitor */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-card-border space-y-1.5 hidden md:block">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{getPrimaryLabel()}</span>
            <span className="font-mono font-bold text-brand">
              {Math.round(currentPrimaryAngle)}°
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{getSecondaryLabel()}</span>
            <span className="font-mono font-bold text-cyber">
              {Math.round(currentSecondaryAngle)}°
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Form Precision</span>
            <span className="font-mono font-bold text-emerald-400">{formScore}%</span>
          </div>
        </div>

        {/* Center: BIG SCORE DISPLAY & DEPTH / STATUS BAR */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl bg-slate-950/95 backdrop-blur-xl border border-card-border shadow-2xl">
          
          <div className="flex items-baseline gap-1.5">
            <span className="text-5xl sm:text-7xl font-display font-extrabold text-white tracking-tighter drop-shadow-md">
              {score}
            </span>
            <span className="text-xs uppercase font-bold text-brand font-mono">
              {config.unit.toUpperCase()}
            </span>
          </div>

          {/* Depth Gauge Bar for Rep-based tests */}
          {(testType === 'pushups_standard' || testType === 'squats_standard') && (
            <div className="w-full max-w-[200px] mt-1.5 space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-mono text-slate-400">
                <span>Depth Range</span>
                <span className={depthProgress >= 100 ? 'text-emerald-400 font-bold' : ''}>
                  {depthProgress >= 100 ? '90° Target Locked' : `${depthProgress}%`}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-75 ${
                    depthProgress >= 100
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                      : 'bg-gradient-to-r from-brand to-brand-400'
                  }`}
                  style={{ width: `${depthProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Plank Stability Progress */}
          {testType === 'plank_hold' && (
            <div className="w-full max-w-[200px] mt-1.5 text-center">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                Hold Stability: {formScore}%
              </span>
            </div>
          )}

          {/* Vertical Jump Status */}
          {testType === 'vertical_jump' && (
            <div className="w-full max-w-[200px] mt-1.5 text-center">
              <span className="text-[10px] font-mono text-cyber uppercase tracking-wider">
                Max Apex Height: {score} cm
              </span>
            </div>
          )}
        </div>

        {/* Right: Workout Action Controls */}
        <div className="flex items-center justify-center md:justify-end gap-2 p-1">
          {workoutState === 'idle' && (
            <Button
              onClick={onStart}
              size="lg"
              className="w-full md:w-auto text-sm"
              leftIcon={<Play className="w-5 h-5 fill-current" />}
            >
              Start {config.shortName} Test
            </Button>
          )}

          {isWorkingOut && (
            <>
              {workoutState === 'paused' ? (
                <Button
                  onClick={onResume}
                  variant="secondary"
                  size="md"
                  leftIcon={<Play className="w-4 h-4 fill-current" />}
                >
                  Resume
                </Button>
              ) : (
                <Button
                  onClick={onPause}
                  variant="outline"
                  size="md"
                  leftIcon={<Pause className="w-4 h-4" />}
                >
                  Pause
                </Button>
              )}

              <Button
                onClick={onFinish}
                variant="primary"
                size="md"
                leftIcon={<Square className="w-4 h-4 fill-current" />}
              >
                Finish & Verify
              </Button>

              <button
                onClick={onReset}
                title="Reset session"
                className="p-2.5 rounded-xl bg-slate-900 border border-card-border text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
