import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiChevronRight } from "react-icons/fi";
import { PROBLEM_REVEAL_TIMESTAMP, formatRevealRemaining } from "../../constants/reveal";

/**
 * Problem Statements Reveal Countdown
 *
 * Before the reveal moment (11:01 AM IST, Aug 19 2026): renders a live
 * countdown pill (desktop) or full-width block (mobile drawer).
 * At/after reveal: becomes an amber "View Problem Statements" button
 * linking to /hardware-problems (public — passcode gate auto-skips).
 *
 * Props:
 *  - variant: "desktop" | "mobile" — controls layout + label density
 *  - onNavigate: optional callback fired when the post-reveal button is
 *    clicked (used by the mobile drawer to close itself)
 */
function RevealCountdown({ variant = "desktop", onNavigate }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = PROBLEM_REVEAL_TIMESTAMP - now;
  const revealed = remaining <= 0;

  // ─── REVEALED: live button (no passcode needed) ───
  if (revealed) {
    if (variant === "mobile") {
      return (
        <Link
          to="/hardware-problems"
          onClick={onNavigate}
          className="w-full text-center py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase hover:bg-amber-500/20 transition-colors"
        >
          View Problem Statements
        </Link>
      );
    }
    return (
      <Link
        to="/hardware-problems"
        onClick={onNavigate}
        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full glass-card border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-500/80 text-[11px] sm:text-xs font-bold font-['Space_Grotesk'] transition-all shadow-md whitespace-nowrap"
      >
        View PS
        <FiChevronRight size={12} />
      </Link>
    );
  }

  // ─── COUNTING DOWN ───
  const label = `Problem Statements in ${formatRevealRemaining(remaining)}`;

  if (variant === "mobile") {
    return (
      <div className="w-full text-center py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase">
        <span className="inline-flex items-center gap-1.5">
          <FiClock className="animate-pulse" />
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      title="Problem statements revealed at 11:01 AM IST, Aug 19"
      className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full glass-card border border-amber-500/40 text-amber-300 text-[11px] sm:text-xs font-bold font-['Space_Grotesk'] transition-all shadow-md whitespace-nowrap"
    >
      <FiClock className="animate-pulse" size={12} />
      {formatRevealRemaining(remaining)}
    </div>
  );
}

export default RevealCountdown;
