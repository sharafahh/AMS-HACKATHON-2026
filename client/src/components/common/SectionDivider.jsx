import { motion } from "framer-motion";

/**
 * SectionDivider – a premium lightning-bolt horizontal rule
 * with animated glow lines and a central ⚡ icon.
 */
function SectionDivider() {
  return (
    <div className="relative flex items-center justify-center w-full py-2 overflow-hidden" aria-hidden="true">
      {/* Left line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 h-px origin-right"
        style={{
          background:
            "linear-gradient(to left, rgba(6,182,212,0.7) 0%, rgba(139,92,246,0.3) 60%, transparent 100%)",
        }}
      />

      {/* Center lightning bolt */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="relative mx-3 flex items-center justify-center"
      >
        {/* Outer glow ring */}
        <span
          className="absolute w-10 h-10 rounded-full animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)",
          }}
        />
        {/* Icon container */}
        <span className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full border border-cyan-500/40 bg-[#050816] shadow-[0_0_12px_rgba(6,182,212,0.5)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </span>
      </motion.div>

      {/* Right line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 h-px origin-left"
        style={{
          background:
            "linear-gradient(to right, rgba(6,182,212,0.7) 0%, rgba(139,92,246,0.3) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}

export default SectionDivider;
