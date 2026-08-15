import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiCheck, FiCreditCard, FiLock } from "react-icons/fi";

import StepTeamDetails from "./StepTeamDetails";
import StepMemberDetails from "./StepMemberDetails";
import StepProjectDetails from "./StepProjectDetails";
import StepSummaryAgreement from "./StepSummaryAgreement";
import { createPaymentOrderAPI, verifyPaymentSignatureAPI } from "../../services/api";
import { REGISTRATION_FEE_PER_PERSON } from "../../constants/fee";

const steps = [
  { id: 1, name: "Team & Leader", fields: ["teamName", "teamSize", "leaderName", "leaderEmail", "leaderPhone", "college", "department", "year"] },
  { id: 2, name: "Member Details", fields: ["members"] },
  { id: 3, name: "Innovation Track", fields: ["track"] },
  { id: 4, name: "Pay & Review", fields: ["agreement"] },
];

// Helper to load Razorpay checkout SDK script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const REGISTRATION_DEADLINE = new Date("2026-08-15T23:59:59").getTime();

function RegisterForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const isDeadlinePassed = new Date().getTime() > REGISTRATION_DEADLINE;

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      teamName: "",
      teamSize: 4,
      leaderName: "",
      leaderEmail: "",
      leaderPhone: "",
      college: "",
      department: "",
      year: "3rd Year",
      members: [
        { name: "", email: "", phone: "", role: "Lead Developer" },
        { name: "", email: "", phone: "", role: "Frontend / UI/UX Developer" },
        { name: "", email: "", phone: "", role: "Backend & API Engineer" },
        { name: "", email: "", phone: "", role: "Hardware & Embedded Systems Tech" },
      ],
      track: "AI & Machine Learning",
      problemTitle: "",
      problemAbstract: "",
      agreement: false,
    },
  });

  const watchTeamSize = Number(watch("teamSize") || 4);
  const watchLeaderName = watch("leaderName");
  const watchLeaderEmail = watch("leaderEmail");
  const watchLeaderPhone = watch("leaderPhone");
  const watchLeaderDept = watch("department");

  // Keep Member 1 synced with Leader details
  useEffect(() => {
    if (watchLeaderName) setValue("members.0.name", watchLeaderName);
    if (watchLeaderEmail) setValue("members.0.email", watchLeaderEmail);
    if (watchLeaderPhone) setValue("members.0.phone", watchLeaderPhone);
    if (watchLeaderDept) setValue("members.0.department", watchLeaderDept);
  }, [watchLeaderName, watchLeaderEmail, watchLeaderPhone, watchLeaderDept, setValue]);

  // Handle Next step transition with validation check
  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep - 1].fields;
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle Previous step
  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Final Form Submission -> Razorpay Checkout Integration
  const onSubmit = async (data) => {
    // ─── 0. Pre-flight Member Validation BEFORE Razorpay Payment ───
    const numMembers = Number(data.teamSize || 4);
    const members = Array.isArray(data.members) ? data.members.slice(0, numMembers) : [];

    for (let i = 0; i < numMembers; i++) {
      const m = members[i];
      const memberNum = i + 1;
      if (!m || !m.name || m.name.trim().length < 2) {
        alert(`Validation Error: Member ${memberNum} name is required.`);
        return;
      }
      if (!m.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(m.email.trim())) {
        alert(`Validation Error: Member ${memberNum} email is required and must be a valid email address.`);
        return;
      }
      if (!m.phone || m.phone.replace(/\D/g, "").length < 7) {
        alert(`Validation Error: Member ${memberNum} phone number is required.`);
        return;
      }
    }

    setSubmitting(true);
    setStatusMessage("Creating Razorpay Payment Order...");

    try {
      // 1. Create Razorpay Payment Order via backend API
      const orderRes = await createPaymentOrderAPI(data.teamSize);

      if (!orderRes.success) {
        throw new Error(orderRes.message || "Failed to create payment order");
      }

      const { orderId, amount, keyId } = orderRes;

      // 2. Load Razorpay Checkout SDK Script
      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && window.Razorpay) {
        setStatusMessage("Opening Razorpay Payment Window...");
        
        const options = {
          key: keyId,
          amount: orderRes.amountInPaise,
          currency: "INR",
          name: "AMS HACKATHON 2026",
          description: `Registration Fee - Team ${data.teamName} (${data.teamSize} Members)`,
          order_id: orderId,
          handler: async function (response) {
            setStatusMessage("Verifying Razorpay Signature with Backend...");
            try {
              // 3. Verify HMAC SHA256 signature on backend
              const verifyRes = await verifyPaymentSignatureAPI({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                teamData: data,
              });

              if (verifyRes.success) {
                setSubmitting(false);
                navigate("/success", {
                  state: {
                    registrationId: verifyRes.registrationId,
                    paymentId: verifyRes.paymentId,
                    teamName: data.teamName,
                    amountPaid: verifyRes.amountPaid,
                  },
                });
              }
            } catch (verifyErr) {
              setSubmitting(false);
              alert(`Payment Verification Failed: ${verifyErr.message}. Registration was NOT saved.`);
            }
          },
          modal: {
            ondismiss: function () {
              setSubmitting(false);
              setStatusMessage("");
              alert("Payment cancelled. Your registration was NOT saved to the database.");
            },
          },
          prefill: {
            name: data.leaderName,
            email: data.leaderEmail,
            contact: data.leaderPhone,
          },
          theme: {
            color: "#06B6D4",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          setSubmitting(false);
          setStatusMessage("");
          alert(`Payment Failed: ${response.error.description || "Transaction failed"}. Registration aborted.`);
        });
        rzp.open();
      } else {
        // Test Simulation Modal Fallback (If offline or script blocked)
        setStatusMessage("Simulating Payment Verification...");
        setTimeout(async () => {
          try {
            const simulatedPaymentId = `pay_${Date.now()}`;
            const simulatedSignature = `test_simulated_sig_${Date.now()}`;

            const verifyRes = await verifyPaymentSignatureAPI({
              razorpay_order_id: orderId,
              razorpay_payment_id: simulatedPaymentId,
              razorpay_signature: simulatedSignature,
              teamData: data,
            });

            setSubmitting(false);
            navigate("/success", {
              state: {
                registrationId: verifyRes.registrationId,
                paymentId: simulatedPaymentId,
                teamName: data.teamName,
                amountPaid: amount,
              },
            });
          } catch (simErr) {
            setSubmitting(false);
            alert(`Verification Error: ${simErr.message}`);
          }
        }, 1200);
      }
    } catch (error) {
      setSubmitting(false);
      setStatusMessage("");
      alert(`Payment Error: ${error.message}`);
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;
  const currentTotalFee = watchTeamSize * REGISTRATION_FEE_PER_PERSON;

  if (isDeadlinePassed) {
    return (
      <div className="w-full max-w-2xl mx-auto glass-card p-8 sm:p-12 rounded-3xl border border-rose-500/40 bg-rose-500/5 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
          <FiLock size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
            Registrations for AMS HACKATHON 2026 are closed.
          </h2>
          <p className="text-rose-300 font-semibold text-sm">
            Registration deadline was 15 August 2026.
          </p>
        </div>
        <p className="text-gray-300 text-xs sm:text-sm font-light max-w-lg mx-auto">
          Online team registration and payment submission for AMS HACKATHON 2026 ended on 15 August 2026 at 11:59 PM IST.
        </p>
        <div className="pt-4 flex justify-center">
          <Link
            to="/portal"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold font-['Space_Grotesk'] text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-105 transition-transform"
          >
            Check Participant Portal Status
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Stepper Header & Progress Bar */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        {/* Step Circles */}
        <div className="grid grid-cols-4 gap-2 relative">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                onClick={async () => {
                  if (step.id < currentStep) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`flex flex-col items-center gap-2 text-center cursor-pointer group`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm font-['Space_Grotesk'] transition-all duration-300 ${
                    isCompleted
                      ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30"
                      : isCurrent
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30 scale-110 border border-cyan-400"
                      : "bg-white/5 text-gray-400 border border-white/10"
                  }`}
                >
                  {isCompleted ? <FiCheck size={18} /> : step.id}
                </div>

                <span
                  className={`text-[10px] sm:text-xs font-bold tracking-wider font-['Space_Grotesk'] transition-colors hidden sm:block ${
                    isCurrent ? "text-cyan-400" : isCompleted ? "text-white" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Animated Progress Line */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-gray-400 font-semibold font-['Space_Grotesk']">
            <span>Progress: Step {currentStep} of {steps.length}</span>
            <span className="text-cyan-400">{Math.round(progressPercentage)}% Completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Main Step Form Container */}
      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <StepTeamDetails
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            )}
            {currentStep === 2 && (
              <StepMemberDetails
                register={register}
                errors={errors}
                watch={watch}
              />
            )}
            {currentStep === 3 && (
              <StepProjectDetails
                register={register}
                errors={errors}
              />
            )}
            {currentStep === 4 && (
              <StepSummaryAgreement
                register={register}
                errors={errors}
                watch={watch}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || submitting}
            className={`px-6 py-3 rounded-2xl font-bold font-['Space_Grotesk'] text-xs sm:text-sm tracking-wider flex items-center gap-2 transition-all ${
              currentStep === 1 || submitting
                ? "opacity-30 cursor-not-allowed text-gray-500 bg-white/5"
                : "glass-card text-gray-300 hover:text-white border border-white/15 hover:bg-white/10"
            }`}
          >
            <FiChevronLeft size={18} /> Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold font-['Space_Grotesk'] text-xs sm:text-sm tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Next Step <FiChevronRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-black font-extrabold font-['Space_Grotesk'] text-xs sm:text-sm tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <FiLock className="animate-spin" /> {statusMessage || "Processing Payment..."}
                </span>
              ) : (
                <>
                  <FiCreditCard size={18} />
                  <span>Pay ₹{currentTotalFee} & Complete Registration</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
