import { useContext, useState } from "react";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import { resetPasswordApi } from "../../services/auth.service";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { AuthContext } from "../../context/AuthContext";
import { MdOutlineSecurity, MdOutlineKey, MdErrorOutline, MdOutlineArrowBack } from "react-icons/md";
import toast from "react-hot-toast";

export default function ResetPassword() {
  document.title = "Reset - Password | Adhya Computer"
  const { auth } = useContext(AuthContext);
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 🔹 Added for better UX
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (auth) return <Navigate to="/customers" replace />;

  const validate = () => {
    const errs = {};
    if (password.length < 6) errs.password = "Minimum 6 characters required";
    if (confirmPassword == "") errs.confirm = "Confirm password required"
    if (confirmPassword && password !== confirmPassword) errs.confirm = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await resetPasswordApi({
        token,
        newPassword: password
      });
      toast.success("Password Reset Successful");
      navigate("/login");
    } catch (err) {
      toast.error("Link expired or invalid");
      setErrors({ global: "This reset link is no longer valid. Please request a new one." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* 🔹 Header Section */}
        <div className="flex flex-col items-center mb-10 space-y-3">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 animate-pulse">
            <MdOutlineSecurity size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Set New Password</h1>
          <p className="text-slate-500 text-sm font-medium text-center">
            Create a strong credential to regain access to your vault.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
          {/* Decorative Corner Accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-full -mr-10 -mt-10" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

            {errors.global && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                <MdErrorOutline className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 font-bold leading-relaxed uppercase tracking-wide">
                  {errors.global}
                </p>
              </div>
            )}

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                {errors.password && <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">{errors.password}</span>}
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: "", global: "" }));
                }}
                error={!!errors.password}
                className="py-4"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Access</label>
                {errors.confirm && <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">{errors.confirm}</span>}
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors(prev => ({ ...prev, confirm: "" }));
                }}
                error={!!errors.confirm}
                className="py-4"
              />
            </div>

            <div className="pt-2">
              <Button
                loading={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group cursor-pointer"
              >
                UPDATE CREDENTIALS
                <MdOutlineKey className="text-lg group-hover:rotate-45 transition-transform" />
              </Button>
            </div>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors inline-flex items-center gap-2"
              >
                <MdOutlineArrowBack /> ABANDON RESET
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          End-to-End Encrypted Verification
        </p>
      </div>
    </div>
  );
}