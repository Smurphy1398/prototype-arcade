#!/usr/bin/env node
/**
 * AUD-05 (WN4, 4th attempt) — offline shell-insert generator.
 *
 * Owner rejected three prior walls as "soda can" reload identity:
 *   WN1 routing-only, WN2 re-pitch of gun/reload_03.ogg, WN3 runtime oscillator stack.
 * Root cause of the soda-can percept: gun/reload_03.ogg is a Kenney RPG hollow-metal
 * bounce, and the WN3 square-wave stack recreated the same light metallic ring.
 *
 * This models the physical inverse: low modes only (<~800 Hz, low Q), all decays
 * inside ~50 ms, dominant energy 120–350 Hz, plus a short swept-bandpass friction
 * hiss for the brass case sliding into the chamber.
 *
 * Usage: node reload_shell_insert.gen.mjs [outDir]
 * Default outDir = this file's directory.
 * Writes: reload_shell_insert_01.wav, reload_shell_insert_02.wav
 * Byte-identical on re-run (fixed seed tables).
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = process.argv[2] ? path.resolve(process.argv[2]) : __dirname;
const SR = 44100;
const DUR = 0.30;
const N = Math.floor(SR * DUR);

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Modal shell insert: low brass/steel modes + friction hiss. */
function synthesize(seed, variant) {
  const rnd = mulberry32(seed);
  const out = new Float32Array(N);
  // Mode tables — deliberately below soda-can ring band (2–4 kHz)
  const modes =
    variant === 0
      ? [
          { f: 145, a: 0.55, d: 0.038, q: 4.5 },
          { f: 210, a: 0.42, d: 0.032, q: 3.8 },
          { f: 285, a: 0.28, d: 0.028, q: 3.2 },
          { f: 380, a: 0.16, d: 0.022, q: 2.8 },
          { f: 520, a: 0.08, d: 0.018, q: 2.4 }
        ]
      : [
          { f: 132, a: 0.52, d: 0.040, q: 4.2 },
          { f: 198, a: 0.40, d: 0.034, q: 3.6 },
          { f: 268, a: 0.30, d: 0.030, q: 3.0 },
          { f: 355, a: 0.18, d: 0.024, q: 2.6 },
          { f: 490, a: 0.09, d: 0.016, q: 2.2 }
        ];

  // Body thud at contact (weighted shell seat)
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    let s = 0;
    for (const m of modes) {
      const env = Math.exp(-t / m.d);
      // low-Q ring: slight detune noise keeps it non-tonal
      const det = 1 + (rnd() - 0.5) * 0.008;
      s += m.a * env * Math.sin(2 * Math.PI * m.f * det * t);
    }
    // Contact body (sub-ish)
    const bodyEnv = Math.exp(-t / 0.022);
    s += 0.35 * bodyEnv * Math.sin(2 * Math.PI * 72 * t);
    s += 0.18 * bodyEnv * Math.sin(2 * Math.PI * 48 * t);
    out[i] = s;
  }

  // Friction hiss: swept bandpass white noise (case sliding) — short, mid, not bright ring
  const hissStart = Math.floor(0.012 * SR);
  const hissEnd = Math.floor(0.095 * SR);
  let lp = 0;
  for (let i = hissStart; i < hissEnd; i++) {
    const u = (i - hissStart) / (hissEnd - hissStart);
    const env = Math.sin(Math.PI * u) * 0.12;
    const noise = rnd() * 2 - 1;
    // simple one-pole lowpass ~800–1400 Hz sweep (stay out of 2–4 kHz can band)
    const cutoff = 0.04 + u * 0.05;
    lp = lp + cutoff * (noise - lp);
    out[i] += env * lp;
  }

  // Soft noise floor at attack only
  for (let i = 0; i < Math.floor(0.04 * SR); i++) {
    const t = i / SR;
    out[i] += (rnd() * 2 - 1) * 0.04 * Math.exp(-t / 0.012);
  }

  // Normalize peak to ~0.85
  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[i]));
  if (peak > 1e-9) {
    const g = 0.85 / peak;
    for (let i = 0; i < N; i++) out[i] *= g;
  }
  return out;
}

/** Band energy ratio 2–4 kHz / 100–800 Hz via naive DFT on windows. */
function bandEnergyRatio(samples) {
  const n = samples.length;
  function energy(f0, f1) {
    // Goertzel-ish sum of power in bins
    let e = 0;
    const bins = 48;
    for (let b = 0; b < bins; b++) {
      const f = f0 + ((f1 - f0) * b) / bins;
      let re = 0,
        im = 0;
      const w = (2 * Math.PI * f) / SR;
      for (let i = 0; i < n; i++) {
        re += samples[i] * Math.cos(w * i);
        im -= samples[i] * Math.sin(w * i);
      }
      e += re * re + im * im;
    }
    return e;
  }
  const hi = energy(2000, 4000);
  const lo = energy(100, 800);
  return lo > 1e-12 ? hi / lo : 999;
}

function tailRmsDb(samples, atMs) {
  const i0 = Math.floor((atMs / 1000) * SR);
  const win = Math.floor(0.02 * SR);
  let sum = 0,
    c = 0;
  for (let i = i0; i < Math.min(nSafe(samples), i0 + win); i++) {
    sum += samples[i] * samples[i];
    c++;
  }
  const rms = Math.sqrt(sum / Math.max(1, c));
  // vs peak
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
  if (peak < 1e-9) return -120;
  return 20 * Math.log10(Math.max(1e-12, rms / peak));
}
function nSafe(s) {
  return s.length;
}

function writeWav(filePath, samples) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    let v = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE((v * 32767) | 0, i * 2);
  }
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  fs.writeFileSync(filePath, Buffer.concat([header, data]));
}

function sha256File(p) {
  const h = crypto.createHash("sha256");
  h.update(fs.readFileSync(p));
  return h.digest("hex");
}

const variants = [
  { name: "reload_shell_insert_01.wav", seed: 0x51e11001, v: 0 },
  { name: "reload_shell_insert_02.wav", seed: 0x51e11002, v: 1 }
];

const results = [];
for (const v of variants) {
  const samples = synthesize(v.seed, v.v);
  const ratio = bandEnergyRatio(samples);
  const tailDb = tailRmsDb(samples, 200);
  if (ratio >= 0.06) {
    console.error("ASSERT FAIL band ratio", v.name, ratio);
    process.exit(1);
  }
  if (tailDb > -26) {
    console.error("ASSERT FAIL tail RMS", v.name, tailDb);
    process.exit(1);
  }
  const out = path.join(outDir, v.name);
  writeWav(out, samples);
  const st = fs.statSync(out);
  const sha = sha256File(out);
  results.push({
    path: "gun/" + v.name,
    bytes: st.size,
    sha256: sha,
    bandRatio: ratio,
    tailDb200ms: tailDb
  });
  console.log(
    v.name,
    "bytes=" + st.size,
    "sha256=" + sha,
    "bandRatio=" + ratio.toFixed(4),
    "tailDb=" + tailDb.toFixed(1)
  );
}

fs.writeFileSync(
  path.join(outDir, "reload_shell_insert.gen.meta.json"),
  JSON.stringify({ generated: new Date().toISOString(), SR, DUR, results }, null, 2) + "\n"
);
console.log("OK — wrote", results.length, "files to", outDir);
