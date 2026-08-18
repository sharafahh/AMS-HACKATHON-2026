// Problem statement reveal schedule (Indian Standard Time)
// Reveal moment: 11:01 AM IST on August 19, 2026
// Overridable via VITE_PS_REVEAL_TIMESTAMP (epoch ms) for testing
export const PROBLEM_REVEAL_TIMESTAMP = Number(
  import.meta.env?.VITE_PS_REVEAL_TIMESTAMP
) || new Date("2026-08-19T11:01:00+05:30").getTime();

// Format milliseconds remaining as a compact D/HH:MM:SS countdown string
export const formatRevealRemaining = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return d > 0 ? `${d}d ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`;
};
