import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiSend,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";
import collegeLogo from "../../assets/logos/college-logo.png";
import { sendContactMessageAPI, getCoordinatorsAPI } from "../../services/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [coordinators, setCoordinators] = useState([
    { _id: "coord-1", name: "Sharafah", department: "AIDS", phone: "+91 88700 37871" },
    { _id: "coord-2", name: "Arif Basha", department: "AIDS", phone: "+91 63838 59800" },
  ]);

  useEffect(() => {
    getCoordinatorsAPI()
      .then((res) => {
        if (res.success && Array.isArray(res.coordinators) && res.coordinators.length > 0) {
          setCoordinators(res.coordinators);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await sendContactMessageAPI(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setErrorMessage(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#050816] bg-cyber-grid overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']"
          >
            Get In Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white"
          >
            Contact <span className="text-gradient-cyan-purple">AMS HACKATHON 2026 Team</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg font-light"
          >
            Have questions regarding registration, track guidelines, or campus directions? Reach out to us.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Map Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
              <div className="flex items-center gap-3">
                <img
                  src={collegeLogo}
                  alt="College Logo"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                    AALIM MUHAMMED SALEGH
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    COLLEGE OF ENGINEERING
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 flex-shrink-0">
                    <FiMapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-white text-xs uppercase font-extrabold tracking-wider text-cyan-400 mb-1">
                      Campus Address
                    </h4>
                    <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed">
                      Nizara Educational Campus, Muthapudupet, Avadi-IAF, Chennai, Tamil Nadu 600055, India.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center p-3 rounded-2xl bg-purple-500/10 text-purple-400 flex-shrink-0">
                    <FiMail size={20} />
                  </div>
                  <div>
                    <h4 className="text-white text-xs uppercase font-extrabold tracking-wider text-purple-400 mb-1">
                      Official Email
                    </h4>
                    <a
                      href="mailto:Amshackathon2026@gmail.com"
                      className="text-gray-300 hover:text-white text-xs sm:text-sm font-light transition-colors"
                    >
                      Amshackathon2026@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 text-amber-400 flex-shrink-0">
                    <FiPhone size={20} />
                  </div>
                  <div>
                    <h4 className="text-white text-xs uppercase font-extrabold tracking-wider text-amber-400 mb-1">
                      Faculty Coordinators
                    </h4>
                    <div className="text-gray-300 text-xs sm:text-sm font-light space-y-1">
                      <p>
                        <span className="font-medium text-white">Assistant Prof. A. Shakila</span> (+91 86106 84529)
                      </p>
                      <p>
                        <span className="font-medium text-white">Prof. A. Mohamed Mydeen</span> (+91 98841 01997)
                      </p>
                    </div>
                  </div>
                </div>
                {coordinators.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 flex-shrink-0">
                      <FiUser size={20} />
                    </div>
                    <div>
                      <h4 className="text-white text-xs uppercase font-extrabold tracking-wider text-indigo-400 mb-2">Coordinators</h4>
                      <div className="space-y-2">
                        {coordinators.map((coord, i) => (
                          <div key={coord._id || i} className="text-gray-300 text-xs sm:text-sm font-light">
                            <p><span className="font-medium text-white">{coord.name}</span> &mdash; <span className="text-indigo-300">{coord.department}</span></p>
                            <p className="text-gray-400">{coord.phone}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                    <FiClock size={20} />
                  </div>
                  <div>
                    <h4 className="text-white text-xs uppercase font-extrabold tracking-wider text-emerald-400 mb-1">
                      Hackathon Support Desk
                    </h4>
                    <p className="text-gray-300 text-xs sm:text-sm font-light">
                      24/7 Active during event dates
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Styled Google Maps Frame */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/10 h-64 relative group shadow-xl">
              <iframe
                title="Aalim Muhammed Salegh College of Engineering Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.340023403328!2d80.08157777598858!3d13.140889287190772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52864f1d67ad97%3A0xb36d7a46f2545d65!2sAalim%20Muhammed%20Salegh%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(1.2)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/10 relative shadow-2xl space-y-6">
              <div>
                <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                  Send Us A Message
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm font-light mt-1">
                  Fill out the form below and our organizing team will get back to you within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-4">
                  <FiCheckCircle className="mx-auto text-cyan-400" size={48} />
                  <h4 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-gray-300 text-sm font-light">
                    Thank you for reaching out. A representative from AMS HACKATHON 2026 will reply to your registered email shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                      <FiAlertCircle className="flex-shrink-0" size={16} />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Subject / Query Category *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Registration Query / Hardware Setup"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold font-['Space_Grotesk'] text-sm tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <FiSend />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
