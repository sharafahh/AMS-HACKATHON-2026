import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-6 text-center font-['Inter']">
          <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-rose-500/30 space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-2xl mx-auto">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
              Something went wrong
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              An unexpected UI error occurred. Don't worry, your registration data and payment progress remain completely safe.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform"
            >
              Refresh Application Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
