export const BUILD = '1.0.0-rc.2 - MOBILE POLISH';
export const TUNING = {
  fixedDt: 1 / 60, maxCatchup: 6,
  topSpeed: 33, boostSpeed: 45, acceleration: 19, braking: 34,
  reverseSpeed: 9, drag: 0.006, rollingResistance: 1.6,
  steerLow: 1.85, steerHigh: 1.04, grip: 10, driftGrip: 2.1,
  driftMinSpeed: 10, driftCharge1: 0.8, driftCharge2: 1.8,
  boostDuration1: 0.8, boostDuration2: 1.45,
  gravity: 23, hopSpeed: 4.3, kartRadius: 0.85,
  roadHalfWidth: 7.5, barrierOffset: 10.3,
} as const;
