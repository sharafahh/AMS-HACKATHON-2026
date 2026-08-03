import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiHelpCircle, FiSearch } from "react-icons/fi";

const faqData = [
  {
    category: "General",
    question: "What is AMS HACKATHON 2026?",
    answer: "AMS HACKATHON 2026 is a flagship Internal Level 24-Hour Hackathon organized by Aalim Muhammed Salegh College of Engineering. It brings together engineering innovators to build hardware and software prototypes.",
  },
  {
    category: "General",
    question: "Who can participate?",
    answer: "Participation is strictly open to undergraduate engineering students pursuing B.E. or B.Tech degrees from recognized engineering institutions. (Postgraduate M.E. / M.Tech students are not eligible).",
  },
  {
    category: "Registration",
    question: "What is the team size requirement?",
    answer: "Teams must consist of 3 to 6 members. Interdisciplinary engineering teams combining software programmers and hardware/electronics developers are encouraged.",
  },
  {
    category: "Registration",
    question: "Is there any registration fee?",
    answer: "Yes, a mandatory registration fee of ₹100 per member (₹300 for 3 members, ₹400 for 4, ₹500 for 5, ₹600 for 6) is payable during registration.",
  },
  {
    category: "Tracks & Project",
    question: "How will problem statements be provided?",
    answer: "For software tracks, problem statements are given ON-SPOT at 9:00 AM on 22 August 2026. For the Hardware Component track, problem statements will be unlocked 3 days prior on 19 August 2026.",
  },
  {
    category: "Tracks & Project",
    question: "Who evaluates and judges the projects?",
    answer: "An external jury comprising corporate industry leaders, senior tech architects, and domain experts will evaluate all prototypes during the live judging round.",
  },
  {
    category: "Logistics",
    question: "Will accommodation be provided?",
    answer: "Yes. Safe and secure in-campus accommodation will be provided for all registered participants throughout the hackathon.",
  },
  {
    category: "Logistics",
    question: "Will refreshments be provided?",
    answer: "Yes. Refreshments (tea and snacks) will be provided to all registered participants at scheduled intervals throughout the 24-hour hackathon.",
  },
  {
    category: "Logistics",
    question: "Do teams need to bring extension boxes?",
    answer: "Yes! While 100% generator power backup is provided, all participating teams must bring their own extension boxes / power strips for their laptops and hardware kits.",
  },
  {
    category: "Logistics",
    question: "Will everyone receive a certificate?",
    answer: "Yes! Every participant who submits a prototype during evaluation will receive an official Digital & Printed Participation Certificate issued by Aalim Muhammed Salegh College of Engineering.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "General", "Registration", "Tracks & Project", "Logistics"];

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-24 relative bg-[#050816] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk'] inline-flex items-center gap-2"
          >
            <FiHelpCircle /> Got Questions?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white"
          >
            Frequently Asked <span className="text-gradient-cyan-purple">Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base font-light"
          >
            Everything you need to know about team eligibility, engineering background rules, accommodation, and external jury evaluation.
          </motion.p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4 mb-10">
          <div className="relative max-w-xl mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-card border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/25"
                    : "glass-card text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? "border-cyan-500/50 shadow-lg shadow-cyan-500/10" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-cyan-400">
                        {faq.category}
                      </span>
                      <span className="text-base sm:text-lg font-bold font-['Space_Grotesk'] text-white">
                        {faq.question}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-cyan-400 flex-shrink-0"
                    >
                      <FiChevronDown size={22} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 pt-0 border-t border-white/5"
                      >
                        <p className="text-gray-300 text-sm font-light leading-relaxed pt-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 glass-card rounded-2xl border border-white/10">
              <p className="text-gray-400 text-sm">No matching questions found for "{searchTerm}".</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
