import React from 'react';
import { Play, Pause, Square, RotateCcw, Activity, Zap, CheckCircle, AlertTriangle, MonitorPlay } from 'lucide-react';
import { WorkoutState } from '../../hooks/usePushUpCounter';
import { Button } from '../common/Button';

interface LiveFormHUDProps {
  workoutState: WorkoutState;
  repCount: number;
  incompleteCount: number;
  currentElbowAngle: number;
  currentPlankAngle: number;
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
}

export const LiveFormHUD: React.FC<LiveFormHUDProps> = ({
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
  fps,
  isSimulating,
  onStart,
  onPause,
  onResume,
  onFinish,
  onReset,
  onToggleSimulation,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const isWorkingOut = workoutState !== 'idle' && workoutState !== 'completed';

  const feedbackColors = {
    info: 'bg-slate-900/85 border-card-border text-slate-200',
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    warning: 'bg-amber-950/90 border-amber-500/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    error: 'bg-red-950/90 border-red-500/50 text-red-300',
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-20">
      
      {/* Top Bar HUD */}
      <div className="flex items-start justify-between gap-4 pointer-events-auto">
        
        {/* Live Timer & Cadence */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-card-border flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-lg font-bold text-white tracking-widest">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-card-border text-xs">
            <Activity className="w-3.5 h-3.5 text-brand" />
            <span className="text-slate-400">Pace:</span>
            <span className="font-mono font-bold text-white">{cadenceRpm} RPM</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-card-border text-xs font-mono text-slate-400">
            <span>{fps} FPS</span>
          </div>
        </div>

        {/* Live Simulation Mode Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSimulation}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSimulating
                ? 'bg-cyber/20 border-cyber text-cyber shadow-glow-cyber'
                : 'bg-slate-950/80 border-card-border text-slate-400 hover:text-white'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Simulating AI Athlete' : 'Simulate Video'}</span>
          </button>
        </div>
      </div>

      {/* Center Biomechanics Real-Time Feedback */}
      <div className="flex flex-col items-center justify-center my-auto pointer-events-auto">
        {/* Dynamic Banner */}
        <div
          className={`px-5 py-2.5 rounded-2xl border backdrop-blur-lg text-sm font-semibold flex items-center gap-2.5 max-w-md text-center transition-all transform duration-200 ${
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pointer-events-auto">
        
        {/* Left: Joint Angles Monitor */}
        <div className="p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-card-border space-y-2 hidden md:block">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Elbow Flexion</span>
            <span className={`font-mono font-bold ${currentElbowAngle <= 90 ? 'text-emerald-400' : 'text-brand'}`}>
              {Math.round(currentElbowAngle)}° {currentElbowAngle <= 90 ? '✓ (Depth Locked)' : ''}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Trunk Alignment</span>
            <span className={`font-mono font-bold ${currentPlankAngle >= 155 && currentPlankAngle <= 190 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {Math.round(currentPlankAngle)}° {currentPlankAngle < 150 ? '⚠️ (Sagging)' : ''}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Form Score</span>
            <span className="font-mono font-bold text-cyber">{formScore}%</span>
          </div>
        </div>

        {/* Center: BIG REP COUNTER & DEPTH PROGRESS */}
        <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-card-border shadow-2xl">
          
          <div className="flex items-baseline gap-1">
            <span className="text-6xl sm:text-7xl font-display font-extrabold text-white tracking-tighter drop-shadow-md">
              {repCount}
            </span>
            <span className="text-xs uppercase font-bold text-slate-400 font-mono">
              REPS
            </span>
          </div>

          {/* Depth Gauge Bar */}
          <div className="w-full max-w-[200px] mt-2 space-y-1">
            <div className="flex justify-between text-[10px] uppercase font-mono text-slate-400">
              <span>Extension</span>
              <span className={depthProgress >= 100 ? 'text-emerald-400 font-bold' : ''}>
                {depthProgress >= 100 ? '90° Locked' : `${depthProgress}%`}
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
        </div>

        {/* Right: Workout Action Controls */}
        <div className="flex items-center justify-center md:justify-end gap-2 p-2">
          {workoutState === 'idle' && (
            <Button
              onClick={onStart}
              size="lg"
              className="w-full md:w-auto"
              leftIcon={<Play className="w-5 h-5 fill-current" />}
            >
              Start Push-Up Test
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
                Finish & Score
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
