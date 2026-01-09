import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineTerminal, MdOutlineRestartAlt, MdOutlineHome, MdOutlineBugReport } from "react-icons/md";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("UI Error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-xl w-full">

            {/* 🔹 Header Section */}
            <div className="text-center mb-8 space-y-3">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-red-600 rounded-3xl mb-4 border border-red-100 shadow-xl shadow-red-50">
                <MdOutlineTerminal size={40} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Interruption</h1>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">
                The application encountered a runtime exception. This session has been halted to protect data integrity.
              </p>
            </div>

            {/* 🔹 Diagnostic Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-10">
                <div className="flex items-center gap-2 text-[11px] font-black text-red-500 uppercase tracking-widest mb-6">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                  Incident Logged
                </div>

                <div className="bg-slate-900 rounded-2xl p-6 mb-8 relative group">
                  <MdOutlineBugReport className="absolute top-4 right-4 text-slate-700 group-hover:text-red-400 transition-colors" size={24} />
                  <code className="text-indigo-300 text-xs font-mono leading-relaxed block">
                        // ERROR_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}<br />
                        // STATUS: UI_RENDER_FAILED<br />
                        // ACTION: REBOOT_REQUIRED
                  </code>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={this.handleReload}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                  >
                    <MdOutlineRestartAlt size={20} />
                    RESTART SESSION
                  </button>

                  <Link
                    to="/customers"
                    onClick={() => this.setState({ hasError: false })} // 🔹 Clear error state when navigating home
                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 px-6 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
                  >
                    <MdOutlineHome size={20} />
                    RETURN TO HOME
                  </Link>
                </div>
              </div>

              {/* 🔹 Technical Footer */}
              <div className="px-10 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Safe Mode Enabled
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  V1.0.0-STABLE
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;