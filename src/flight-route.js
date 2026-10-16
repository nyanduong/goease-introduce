import { Vector3, CubicBezierCurve3 } from 'three';

export const FLIGHT_PERIOD = 20;
export const RUNWAY_DURATION = 3.2;
export const TAKEOFF_DURATION = 9.2;
export const MIN_CRUISE_ALTITUDE = 160;
const omega = Math.PI * 2 / FLIGHT_PERIOD;

// Bay coordinates: waterline ~96, summit ~240. Positive Z is in front of
// the cliffs; negative Z is behind their alpha silhouette.
export function orbitPosition(seconds, target = new Vector3()) {
  const angle = seconds * omega;
  return target.set(180 - 158 * Math.cos(angle), 182 + 22 * Math.sin(angle), -65 * Math.sin(angle));
}

export function runwayProgress(seconds) {
  const t = Math.min(1, Math.max(0, seconds / RUNWAY_DURATION));
  return t * t;
}

export function createFlightRoute(departure, runwayEnd = departure.clone().add(new Vector3(75,0,0))) {
  const arrival = orbitPosition(0);
  const arrivalVelocity = new Vector3(0, 22 * omega, -65 * omega);
  // Match position and velocity at the takeoff/orbit join, not just the points.
  const takeoff = new CubicBezierCurve3(
    runwayEnd.clone(),
    runwayEnd.clone().addScaledVector(runwayEnd.clone().sub(departure).multiplyScalar(2 / RUNWAY_DURATION), (TAKEOFF_DURATION-RUNWAY_DURATION)/3),
    arrival.clone().addScaledVector(arrivalVelocity, -(TAKEOFF_DURATION-RUNWAY_DURATION) / 3),
    arrival,
  );
  return (seconds, target = new Vector3()) => seconds <= RUNWAY_DURATION
    ? target.lerpVectors(departure, runwayEnd, runwayProgress(seconds))
    : seconds < TAKEOFF_DURATION
    ? takeoff.getPoint((seconds-RUNWAY_DURATION) / (TAKEOFF_DURATION-RUNWAY_DURATION), target)
    : orbitPosition(seconds - TAKEOFF_DURATION, target);
}
