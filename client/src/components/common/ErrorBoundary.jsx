import React from "react";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050816] bg-cyber-grid text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-rose-500/40 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <FiAlertTriangle size={36} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                Unexpected System Interruption
              </h1>
              <p className="text-gray-300 text-xs font-light leading-relaxed">
                An application state error occurred. Please refresh or return to the main landing page.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-rose-300 font-mono overflow-x-auto">
              {this.state.error?.message || "Render failure"}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <FiRefreshCw /> Refresh App
              </button>

              <a
                href="/"
                className="flex-1 py-3 rounded-xl glass-card text-gray-300 hover:text-white font-semibold text-xs uppercase tracking-wider border border-white/15 flex items-center justify-center gap-2"
              >
                <FiHome /> Home Page
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
