import React, { useEffect, useRef } from 'react';
import { NormalizedLandmark } from '@mediapipe/tasks-vision';

interface PoseSkeletonCanvasProps {
  landmarks: NormalizedLandmark[] | null;
  currentElbowAngle: number;
  currentPlankAngle: number;
  activeSide: 'left' | 'right' | 'none';
  targetDepthReached: boolean;
  videoWidth: number;
  videoHeight: number;
}

// MediaPipe 33 Landmark Connection Pairs
const POSE_CONNECTIONS = [
  // Upper body
  [11, 12], // left shoulder to right shoulder
  [11, 13], // left shoulder to left elbow
  [13, 15], // left elbow to left wrist
  [12, 14], // right shoulder to right elbow
  [14, 16], // right elbow to right wrist
  // Torso
  [11, 23], // left shoulder to left hip
  [12, 24], // right shoulder to right hip
  [23, 24], // left hip to right hip
  // Lower body
  [23, 25], // left hip to left knee
  [25, 27], // left knee to left ankle
  [24, 26], // right hip to right knee
  [26, 28], // right knee to right ankle
];

export const PoseSkeletonCanvas: React.FC<PoseSkeletonCanvasProps> = ({
  landmarks,
  currentElbowAngle,
  currentPlankAngle,
  activeSide,
  targetDepthReached,
  videoWidth,
  videoHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!landmarks || landmarks.length < 33) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    // 1. Draw Skeleton Lines
    POSE_CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const p1 = landmarks[startIdx];
      const p2 = landmarks[endIdx];

      if (!p1 || !p2 || (p1.visibility && p1.visibility < 0.4) || (p2.visibility && p2.visibility < 0.4)) {
        return;
      }

      const x1 = p1.x * width;
      const y1 = p1.y * height;
      const x2 = p2.x * width;
      const y2 = p2.y * height;

      const isPrimaryArm =
        (activeSide === 'right' && (startIdx === 12 || startIdx === 14) && (endIdx === 14 || endIdx === 16)) ||
        (activeSide === 'left' && (startIdx === 11 || startIdx === 13) && (endIdx === 13 || endIdx === 15));

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      if (isPrimaryArm) {
        // Highlighting active arm
        ctx.strokeStyle = targetDepthReached ? '#10B981' : '#FF4D00';
        ctx.lineWidth = 5;
        ctx.shadowColor = targetDepthReached ? 'rgba(16,185,129,0.8)' : 'rgba(255,77,0,0.8)';
        ctx.shadowBlur = 12;
      } else {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
        ctx.shadowBlur = 6;
      }

      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    });

    // 2. Draw Landmark Joints
    landmarks.forEach((landmark, idx) => {
      // Filter out small facial keypoints to keep skeleton clean
      if (idx > 0 && idx < 11) return;
      if (landmark.visibility && landmark.visibility < 0.4) return;

      const x = landmark.x * width;
      const y = landmark.y * height;

      const isElbow = (activeSide === 'right' && idx === 14) || (activeSide === 'left' && idx === 13);
      const isShoulder = (activeSide === 'right' && idx === 12) || (activeSide === 'left' && idx === 11);
      const isHip = (activeSide === 'right' && idx === 24) || (activeSide === 'left' && idx === 23);

      ctx.beginPath();
      ctx.arc(x, y, isElbow ? 8 : 5, 0, 2 * Math.PI);

      if (isElbow) {
        ctx.fillStyle = targetDepthReached ? '#10B981' : '#FF4D00';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = targetDepthReached ? '#10B981' : '#FF4D00';
        ctx.shadowBlur = 15;
      } else if (isShoulder || isHip) {
        ctx.fillStyle = '#00F0FF';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
        ctx.lineWidth = 1;
      }

      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // 3. Render Joint Angle Text Badges on Elbow and Hip
    const activeElbowIdx = activeSide === 'right' ? 14 : 13;
    const activeElbow = landmarks[activeElbowIdx];
    if (activeElbow && (activeElbow.visibility || 1) > 0.4) {
      const ex = activeElbow.x * width;
      const ey = activeElbow.y * height;

      // Draw angle badge
      const text = `${Math.round(currentElbowAngle)}°`;
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(text).width;

      const badgeX = ex + (activeSide === 'right' ? 14 : -textWidth - 24);
      const badgeY = ey - 10;

      ctx.fillStyle = targetDepthReached ? 'rgba(16, 185, 129, 0.9)' : 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = targetDepthReached ? '#10B981' : '#FF4D00';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY - 14, textWidth + 14, 20, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(text, badgeX + 7, badgeY);
    }
  }, [landmarks, currentElbowAngle, currentPlankAngle, activeSide, targetDepthReached]);

  return (
    <canvas
      ref={canvasRef}
      width={videoWidth || 640}
      height={videoHeight || 480}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
    />
  );
};
