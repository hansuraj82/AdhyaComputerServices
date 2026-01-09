import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginApi } from "../../services/auth.service";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { MdOutlineSecurity, MdOutlineMail, MdOutlineLock, MdLogin, MdErrorOutline } from "react-icons/md";
import toast from "react-hot-toast";

export default function Login() {
  document.title = "Login | Adhya Computer"
  const { auth, login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  if (auth) return <Navigate to="/customers" replace />;

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Please enter a valid email address";

    if (!form.password) errs.password = "Password is required";
    if (form.password && form.password.length < 6) errs.password = "Password Must be at least 6 characters"
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await loginApi(form);
      login(res.data);
      toast.success("Identity Verified. Welcome back.");
      navigate('/customers');
    } catch (err) {
      const msg = err.response?.data?.message || "Authentication failed";
      toast.error(msg);
      setErrors({ global: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-100">

        {/* 🔹 Left Side: Visual/Brand Content (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

          <div className="relative z-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/20">
              <MdOutlineSecurity size={28} />
            </div>
            <h2 className="text-4xl font-black tracking-tight leading-tight">
              Adhya Computer <br /> <span className="text-indigo-400">Pratappur</span>
            </h2>
            <p className="mt-4 text-slate-400 font-medium max-w-xs leading-relaxed">
              Enterprise-grade customer management and secure data synchronization.
            </p>
          </div>

          <div className="relative z-10">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-xs font-bold text-slate-200">All Systems Operational</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Right Side: Login Form */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Login</h1>
            <p className="text-slate-500 font-medium mt-2">Enter your authorized credentials below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.global && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-shake">
                <MdErrorOutline className="text-red-500" size={20} />
                <p className="text-xs text-red-600 font-bold uppercase tracking-wide">{errors.global}</p>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1 px-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MdOutlineMail size={14} /> Corporate Email
                </label>
                {errors.email && <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase tracking-tighter animate-pulse">
                  <MdErrorOutline /> {errors.email}
                </span>}
              </div>
              <Input
                type="text"
                placeholder="admin@vault.com"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setErrors(prev => ({ ...prev, email: "", global: "" }));
                }}
                error={!!errors.email}
                className="py-4 px-5 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1 px-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MdOutlineLock size={14} /> Password
                </label>
                {errors.password && <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase tracking-tighter animate-pulse">
                  <MdErrorOutline /> {errors.password}
                </span>}
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  setErrors(prev => ({ ...prev, password: "", global: "" }));
                }}
                error={!!errors.password}
                className="py-4 px-5 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Reset Access?
              </Link>
            </div>

            <Button
              loading={loading}
              className="cursor-pointer w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-[0.98]"
            >
              SIGN IN TO DASHBOARD <MdLogin size={20} />
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}