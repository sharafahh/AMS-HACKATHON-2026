import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";

const faqs = [
  {
    q: "Who is eligible to participate in AMS HACKATHON 2026?",
    a: "B.E. and B.Tech engineering students from Aalim Muhammed Salegh College of Engineering across all years and departments are eligible to participate.",
  },
  {
    q: "Is there a mandatory registration fee?",
    a: "Yes. The mandatory registration fee is ₹100 per participant globally (e.g. ₹400 for a 4-member team). Payment must be completed via Razorpay during team registration.",
  },
  {
    q: "Will accommodation and refreshments be provided?",
    a: "Yes! In-campus accommodation inside the college campus will be provided for all registered participants during the 24-hour event. Refreshments (tea and snacks) will also be provided.",
  },
  {
    q: "What should teams bring with them?",
    a: "Participants must bring their own laptops, chargers, hardware components/sensors (if working on hardware track), and MANDATORY extension boxes / power strips for laptop setups.",
  },
  {
    q: "What is the team size limit?",
    a: "Teams must consist of 3 to 6 members. Individual registration is not supported for this hackathon format.",
  },
  {
    q: "How will projects be evaluated?",
    a: "Projects will be evaluated by both internal faculty experts and external industry leaders based on innovation, technical implementation, working prototype, and pitch presentation.",
  },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleIndex = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative bg-[#07121F] bg-lab-mesh border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
            Frequently Asked <span className="text-gradient-tech-blue">Questions</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Everything you need to know about guidelines, accommodation, registration, and rules.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="rounded-2xl bg-[#13273F]/90 border border-white/10 overflow-hidden shadow-lg"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none group"
                >
                  <span className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-blue-400 transition-colors flex items-center gap-3">
                    <FiHelpCircle className="text-blue-400 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-white"
                  >
                    <FiChevronDown size={18} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-2 text-slate-300 text-sm leading-relaxed font-light border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
