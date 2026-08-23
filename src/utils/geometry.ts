export interface Point2D {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/**
 * Calculates the angle (in degrees, 0-180) formed at point B by line segments AB and BC.
 * @param a First point (e.g., Shoulder)
 * @param b Vertex point (e.g., Elbow)
 * @param c Third point (e.g., Wrist)
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
 * In a good push-up plank, this should be close to 180 degrees (neutral straight line).
 */
export function calculatePlankAlignment(
  shoulder: Point2D,
  hip: Point2D,
  ankle: Point2D
): number {
  return calculateJointAngle(shoulder, hip, ankle);
}

/**
 * Calculate Euclidean distance between two 2D points (normalized coordinates)
 */
export function calculateDistance(a: Point2D, b: Point2D): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
