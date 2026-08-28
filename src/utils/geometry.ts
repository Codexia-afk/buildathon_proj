export interface Point2D {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/**
 * Calculates the angle (in degrees, 0-180) formed at point B by line segments AB and BC.
 * @param a First point (e.g., Shoulder / Hip)
 * @param b Vertex point (e.g., Elbow / Knee)
 * @param c Third point (e.g., Wrist / Ankle)
 */
export function calculateJointAngle(a: Point2D, b: Point2D, c: Point2D): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360.0 - angle;
  }

  return Math.round(angle * 10) / 10;
}

/**
 * Calculates trunk / spine alignment angle at the hip (Shoulder -> Hip -> Ankle)
 * In a good plank or push-up, this should be close to 180 degrees (neutral straight line).
 */
export function calculatePlankAlignment(
  shoulder: Point2D,
  hip: Point2D,
  ankle: Point2D
): number {
  return calculateJointAngle(shoulder, hip, ankle);
}

/**
 * Calculates knee flexion angle (Hip -> Knee -> Ankle)
 * Full standing lockout: > 160 deg. Parallel/Deep squat depth: <= 90 deg.
 */
export function calculateKneeFlexion(
  hip: Point2D,
  knee: Point2D,
  ankle: Point2D
): number {
  return calculateJointAngle(hip, knee, ankle);
}

/**
 * Calculates hip flexion angle (Shoulder -> Hip -> Knee)
 */
export function calculateHipFlexion(
  shoulder: Point2D,
  hip: Point2D,
  knee: Point2D
): number {
  return calculateJointAngle(shoulder, hip, knee);
}

/**
 * Calculate Euclidean distance between two 2D points (normalized coordinates)
 */
export function calculateDistance(a: Point2D, b: Point2D): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

/**
 * Estimate vertical jump height in cm from airborne flight hang time (in seconds).
 * Physics kinematic formula: h = (g * t^2) / 8 where g = 9.80665 m/s^2.
 */
export function calculateJumpHeightFromFlightTime(flightTimeSec: number): number {
  const g = 9.80665;
  const heightMeters = (g * Math.pow(flightTimeSec, 2)) / 8;
  const heightCm = heightMeters * 100;
  return Math.max(0, Math.min(120, Math.round(heightCm * 10) / 10));
}

/**
 * Exponential Moving Average (EMA) smoothing for joint angle jitter reduction
 */
export function smoothAngle(currentAngle: number, previousAngle: number, alpha: number = 0.35): number {
  if (previousAngle === 0) return currentAngle;
  return Math.round((alpha * currentAngle + (1 - alpha) * previousAngle) * 10) / 10;
}
