import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiUser,
  FiPhone,
  FiMessageSquare,
  FiSend,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";
import { sendContactMessageAPI, getCoordinatorsAPI } from "../../services/api";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "AMS HACKATHON 2026 Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [coordinators, setCoordinators] = useState([]);

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const res = await getCoordinatorsAPI();
        if (res.success) {
          setCoordinators(res.coordinators);
        }
      } catch (err) {
        console.error("Error loading coordinators:", err);
      }
    };
    fetchCoordinators();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const data = await sendContactMessageAPI(form);
      if (data.success) {
        setStatus({
          type: "success",
          msg: "Thank you! Your message has been sent successfully. Our team will get back to you shortly.",
        });
        setForm({
          name: "",
          email: "",
          subject: "AMS HACKATHON 2026 Inquiry",
          message: "",
        });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      setStatus({
        type: "error",
        msg: error.message || "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#07121F] bg-lab-mesh border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']">
            Contact & Location Desk
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
            Get In Touch With <span className="text-gradient-tech-blue">Organizers</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-light">
            Have questions about registration, guidelines, or event schedule? Reach out to student coordinators or drop a direct message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Form (Left 7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 p-8 rounded-2xl bg-[#13273F]/90 border border-white/10 shadow-xl space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                Send Us A Message
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm font-light mt-1">
                Fill out the form below to deliver an inquiry directly to the organizing committee inbox.
              </p>
            </div>

            {status && (
              <div
                className={`p-4 rounded-xl text-xs font-medium flex items-center gap-3 ${
                  status.type === "success"
                    ? "bg-teal-500/10 border border-teal-500/30 text-teal-300"
                    : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                }`}
              >
                <FiCheckCircle size={18} />
                <span>{status.msg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FiUser className="text-blue-400" /> Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FiMail className="text-blue-400" /> Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="yourname@domain.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FiMessageSquare className="text-blue-400" /> Message / Question *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Type your inquiry or message here..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-extrabold font-['Space_Grotesk'] text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Sending Message..."
                ) : (
                  <>
                    <FiSend /> Deliver Inquiry
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Coordinators & Campus Location (Right 5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Student & Faculty Coordinators Card */}
            <div className="p-6 rounded-2xl bg-[#13273F]/90 border border-white/10 shadow-xl space-y-4">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                <FiPhone className="text-teal-400" /> Event Coordinators
              </h3>

              <div className="space-y-3">
                {(coordinators.length > 0
                  ? coordinators
                  : [
                      { name: "Sharafah", department: "Co-Lead Student Organizer", phone: "+91 98765 43210" },
                      { name: "Arif Basha", department: "Co-Lead Student Organizer", phone: "+91 63838 59800" },
                    ]
                ).map((c, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      <p className="text-[11px] text-slate-400">{c.department}</p>
                    </div>
                    {c.phone && (
                      <a
                        href={`tel:${c.phone}`}
                        className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold text-xs hover:bg-teal-500/20 transition-colors"
                      >
                        {c.phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Address Card */}
            <div className="p-6 rounded-2xl bg-[#13273F]/90 border border-white/10 shadow-xl space-y-3">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                <FiMapPin className="text-blue-400" /> Venue & Campus Address
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                <strong>Aalim Muhammed Salegh College of Engineering</strong>
                <br />
                Nizara Educational Campus, Avadi-IAF, Muthapudupet,
                <br />
                Chennai, Tamil Nadu 600055
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
