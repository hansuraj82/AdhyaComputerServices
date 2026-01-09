import { useContext, useState } from "react";
import { forgotPasswordApi } from "../../services/auth.service";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { MdOutlineMailOutline, MdOutlineMarkEmailRead, MdOutlineArrowBack, MdErrorOutline } from "react-icons/md";
import toast from "react-hot-toast";

export default function ForgotPassword() {
    document.title = "Forgot - Password | Adhya Computer"
    const { auth } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    if (auth) return <Navigate to="/customers" replace />;

    const validate = () => {
        if (!email.trim()) {
            setError("Email is required");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validate()) return;

        setLoading(true);
        try {
            await forgotPasswordApi({ email });
            toast.success("Reset link dispatched");
            setSent(true);
        } catch (err) {
            const msg = err.response?.data?.message || "Internal system error. Try again later.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* 🔹 Brand Identity / Logo */}
                <div className="flex flex-col items-center mb-10 space-y-3">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                        <MdOutlineMailOutline size={28} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight text-center">
                        Account Recovery
                    </h1>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    {sent ? (
                        /* 🔹 SUCCESS STATE */
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                <MdOutlineMarkEmailRead size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">Link Dispatched</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    We've sent recovery instructions to <br />
                                    <span className="font-bold text-slate-800">{email}</span>
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    Next Steps
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Check your inbox/spam. Link expires in 15 mins.
                                </p>
                            </div>
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors pt-4"
                            >
                                <MdOutlineArrowBack /> BACK TO LOGIN
                            </Link>
                        </div>
                    ) : (
                        /* 🔹 FORM STATE */
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Registered Email
                                    </label>
                                    {error && (
                                        <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase tracking-tighter animate-pulse">
                                            <MdErrorOutline /> {error}
                                        </span>
                                    )}
                                </div>
                                <Input
                                    type=""
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError("");
                                    }}
                                    error={!!error}
                                    className="py-4 rounded-2xl"
                                />
                                <p className="text-[11px] text-slate-400 italic px-1">
                                    A temporary access link will be sent to this address.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                loading={loading}
                                className="w-full py-4 bg-slate-900 cursor-pointer text-white rounded-2xl font-bold shadow-lg shadow-slate-200 transition-transform active:scale-[0.98]"
                            >
                                SEND RECOVERY LINK
                            </Button>

                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors mt-4"
                            >
                                <MdOutlineArrowBack /> I REMEMBERED IT
                            </Link>
                        </form>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                        Secure Access Portal • Adhya Computer  v1.0.0
                    </p>
                </div>
            </div>
        </div>
    );
}