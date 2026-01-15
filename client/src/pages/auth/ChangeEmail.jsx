import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineMail, MdOutlineVpnKey, MdOutlineVerifiedUser,
  MdOutlineArrowForward, MdOutlineShield, MdErrorOutline,
  MdRefresh, MdCheckCircle
} from "react-icons/md";
import { requestEmailChangeApi, verifyEmailChangeApi, resendEmailChangeOTPApi } from "../../services/auth.service";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

export default function ChangeEmail() {
  document.title = "Identity Sync | Adhya Computer";

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(1); // 🔹 Track attempts
  const [form, setForm] = useState({ currentPassword: "", newEmail: "", otp: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.newEmail) newErrors.newEmail = "Target email required";
    if (form.newEmail && !/\S+@\S+\.\S+/.test(form.newEmail)) newErrors.newEmail = "Please enter a valid email address";
    if (!form.currentPassword) newErrors.currentPassword = "Password required for auth";
    if (form.currentPassword && form.currentPassword.length < 6) newErrors.currentPassword = "Password must be greater than 6 digits"
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return triggerShake();

    setLoading(true);
    try {
      await requestEmailChangeApi({
        currentPassword: form.currentPassword,
        newEmail: form.newEmail
      });
      toast.success("Security OTP dispatched");
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      const msg = err.response?.data?.message || "Sync request failed";
      toast.error(msg);
      setErrors({ global: msg });
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (form.otp.length < 6) {
      setErrors({ otp: "Please enter 6-digit key" }); // 🔹 Inline error
      return triggerShake();
    }

    setLoading(true);
    try {
      await verifyEmailChangeApi({ otp: form.otp });
      toast.success("Identity Updated Successfully");
      logout();
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed";
      setErrors({ otp: msg }); // 🔹 Set inline error for OTP
      toast.error(msg);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resendCount >= 3) return; // 🔹 Disable if limit reached

    setLoading(true);
    try {
      await resendEmailChangeOTPApi();
      toast.success("New verification key sent");
      setResendTimer(60);
      setResendCount(prev => prev + 1); // 🔹 Increment attempt
      setErrors({}); // Clear old errors
    } catch (err) {
      const msg = err.response?.data?.message || "Too many attempts";
      toast.error(msg);
      setErrors({ otp: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto pt-10 pb-20 px-4">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>

      {/* Header Section */}
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-white rounded-2xl mb-4 shadow-xl shadow-slate-200">
          <MdOutlineVerifiedUser size={32} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Identity Sync</h1>
        <p className="text-slate-500 font-medium max-w-sm mx-auto text-[11px] tracking-[0.15em] uppercase">
          Administrative Communication Protocol
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <MdOutlineShield className="text-indigo-600 text-lg" />
            Security Nodes
          </h3>
          <ul className="space-y-4">
            <ProtocolItem text="Verification is sent to the new email address." />
            <ProtocolItem text="OTP expires automatically after 10 minutes." />
            <ProtocolItem text={`Attempt ${resendCount} of 3 authorized resends.`} />
            <ProtocolItem text="Syncing will update all system communications." />
          </ul>
        </div>

        <div className={`bg-white rounded-3xl border ${Object.keys(errors).length > 0 ? 'border-red-200' : 'border-slate-200'} shadow-sm overflow-hidden transition-all ${isShaking ? 'animate-shake' : ''}`}>
          <div className="flex border-b border-slate-100 bg-slate-50/50 px-8 py-4 justify-between items-center">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step === 1 ? 'text-indigo-600' : 'text-slate-400'}`}>01. Authenticate</span>
            <MdOutlineArrowForward className="text-slate-300" />
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step === 2 ? 'text-indigo-600' : 'text-slate-400'}`}>02. Verify OTP</span>
          </div>
          {errors.global && (
            <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase animate-pulse">
              <MdErrorOutline /> {errors.global}
            </span>
          )}
          <form onSubmit={step === 1 ? handleRequest : handleVerify}>
            <div className="p-8 space-y-6">
              {step === 1 ? (
                <>
                  <div className="space-y-1">
                    <FieldHeader label="Current Password" icon={<MdOutlineVpnKey />} error={errors.currentPassword} />
                    <Input
                      type="password"
                      placeholder="Verify your password"
                      value={form.currentPassword}
                      onChange={(e) => {
                        setForm({ ...form, currentPassword: e.target.value });
                        setErrors({});
                      }}
                      error={!!errors.currentPassword}
                    />
                  </div>
                  <div className="h-[1px] bg-slate-100 w-full my-2"></div>
                  <div className="space-y-1">
                    <FieldHeader label="Target Email" icon={<MdOutlineMail />} error={errors.newEmail} />
                    <Input
                      type="text"
                      placeholder="Enter new email address"
                      value={form.newEmail}
                      onChange={(e) => {
                        setForm({ ...form, newEmail: e.target.value });
                        setErrors({});
                      }}
                      error={!!errors.newEmail}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100">
                    <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-tight">
                      Verification key dispatched to:<br />
                      <span className="text-slate-900 font-black lowercase">{form.newEmail}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2 px-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">6-Digit Secure Key</label>
                      {errors.otp && (
                        <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase animate-pulse">
                          <MdErrorOutline /> {errors.otp}
                        </span>
                      )}
                    </div>
                    <input
                      autoFocus
                      maxLength={6}
                      className={`w-full text-center text-3xl tracking-[0.5em] font-black py-4 bg-slate-50 border ${errors.otp ? 'border-red-300' : 'border-slate-200'} rounded-2xl focus:border-indigo-500 focus:outline-none text-indigo-600 transition-all shadow-inner`}
                      value={form.otp}
                      onChange={(e) => {
                        setForm({ ...form, otp: e.target.value });
                        setErrors({});
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
              {step === 2 ? (
                <button
                  type="button"
                  disabled={loading || resendTimer > 0 || resendCount >= 3}
                  onClick={handleResend}
                  className={`
                              flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200
                                ${resendTimer > 0 || resendCount >= 3 || loading
                      ? "bg-slate-00 text-slate-600 cursor-not-allowed opacity-70"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-md active:scale-95 cursor-pointer"}
                        `}
                >
                  <MdRefresh className={`${resendTimer > 0 ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />

                  {resendCount >= 3 ? (
                    <span className="flex items-center gap-1">
                      Limit Reached
                    </span>
                  ) : resendTimer > 0 ? (
                    <span>Resend in {resendTimer}s</span>
                  ) : (
                    <span>Request New OTP</span>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase">
                  <MdCheckCircle className="text-emerald-500" /> Secure Protocol
                </div>
              )}

              <Button
                type="submit"
                loading={loading}
                className="w-full sm:w-auto px-10 py-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95 cursor-pointer"
              >
                {step === 1 ? "Initialize Request" : "Finalize Sync"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const FieldHeader = ({ label, icon, error }) => (
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
      {icon} {label}
    </div>
    {error && (
      <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase tracking-tighter animate-pulse">
        <MdErrorOutline /> {error}
      </span>
    )}
  </div>
);

const ProtocolItem = ({ text }) => (
  <li className="flex items-start gap-3 text-[13px] text-slate-600 font-medium group">
    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform"></div>
    {text}
  </li>
);