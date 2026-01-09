import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineVpnKey, MdOutlineLockReset, MdOutlineShield, MdOutlineInfo, MdErrorOutline } from "react-icons/md";
import { changePasswordApi } from "../../services/auth.service";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

export default function ChangePassword() {
  document.title = "Password - Change | Adhya Computer"
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [errors, setErrors] = useState({}); // 🔹 State for inline errors
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false); // 🔹 Subtle UX feedback
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.currentPassword) newErrors.currentPassword = "Required for verification";
    if (!form.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = "Must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await changePasswordApi(form);
      toast.success("Security Credentials Updated");
      navigate('/customers');
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, field) => {
    setForm({ ...form, [field]: e.target.value });
    // Clear error as user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
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

      {/* 🔹 Header Section */}
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-white rounded-2xl mb-4 shadow-xl shadow-slate-200">
          <MdOutlineLockReset size={32} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access Security</h1>
        <p className="text-slate-500 font-medium max-w-sm mx-auto">
          Update your administrative credentials to maintain system integrity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* 🔹 Sidebar */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <MdOutlineShield className="text-indigo-600 text-lg" />
            Security Protocols
          </h3>
          <ul className="space-y-4">
            <ProtocolItem text="Ensure your current password is valid." />
            <ProtocolItem text="New password should be unique from previous ones." />
            <ProtocolItem text="Minimum 6 characters recommended for strength." />
            <ProtocolItem text="Avoid using common phrases or names." />
          </ul>
        </div>

        {/* 🔹 Form Section */}
        <div className={`bg-white rounded-3xl border ${Object.keys(errors).length > 0 ? 'border-red-200' : 'border-slate-200'} shadow-sm overflow-hidden transition-all ${isShaking ? 'animate-shake' : ''}`}>
          <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-6">
              {/* Current Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <MdOutlineVpnKey /> Current Authorization
                  </div>
                  {errors.currentPassword && (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase tracking-tighter animate-pulse">
                      <MdErrorOutline /> {errors.currentPassword}
                    </span>
                  )}
                </div>
                <Input
                  label=""
                  type="password"
                  placeholder="Verify existing password"
                  value={form.currentPassword}
                  onChange={(e) => handleInputChange(e, 'currentPassword')}
                  error={!!errors.currentPassword} // Assuming your Input component handles red borders via 'error' prop
                />
              </div>

              <div className="h-[1px] bg-slate-100 w-full my-2"></div>

              {/* New Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[11px] font-black text-indigo-500 uppercase tracking-widest">
                    <MdOutlineLockReset /> New Credential
                  </div>
                  {errors.newPassword && (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase tracking-tighter animate-pulse">
                      <MdErrorOutline /> {errors.newPassword}
                    </span>
                  )}
                </div>
                <Input
                  label=""
                  type="password"
                  placeholder="Set new secure password"
                  value={form.newPassword}
                  onChange={(e) => handleInputChange(e, 'newPassword')}
                  error={!!errors.newPassword}
                />
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Verification Required
              </span>
              <Button
                type="submit"
                loading={loading}
                className="w-full sm:w-auto px-10 py-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200 cursor-pointer"
              >
                Confirm Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const ProtocolItem = ({ text }) => (
  <li className="flex items-start gap-3 text-[13px] text-slate-600 font-medium">
    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
    {text}
  </li>
);