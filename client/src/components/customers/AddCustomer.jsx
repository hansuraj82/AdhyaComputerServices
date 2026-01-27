import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlinePersonAddAlt, MdOutlineFingerprint, MdOutlineSmartphone, MdOutlinePlace, MdOutlineArrowForward } from "react-icons/md";
import Input from "../../components/ui/Input";
import { createCustomer } from "../../services/customer.service";
import toast from "react-hot-toast";

export default function AddCustomer() {
  const navigate = useNavigate();
  document.title = "Register - Customer | Adhya Computer"

  const [form, setForm] = useState({ name: "", mobile: "", aadhar: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Legal name is required";
    if (!/^\d{10}$/.test(form.mobile)) errs.mobile = "Valid 10-digit mobile required";
    if(!form.aadhar) errs.aadhar = "Aadhar is Required"
    if (form.aadhar && !/^\d{12}$/.test(form.aadhar)) errs.aadhar = "Aadhar must be exactly 12 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await createCustomer(form);
      toast.success("New Customer Registered");
      navigate(`/customers/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      {/* 🔹 Header Section */}
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
            <MdOutlinePersonAddAlt size={28} />
          </div>
          Register New Customer
        </h1>
        <p className="text-slate-500 font-medium ml-1">
          Create a new profile vault. All data is encrypted and stored securely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 🔹 Form Section */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">

            {/* Field Group: Primary Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                <span className="w-8 h-[1px] bg-indigo-100"></span>
                Primary Identity
              </div>

              <Input
                label="Full Legal Name"
                name="name"
                placeholder="e.g. Rajesh Kumar"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Contact Number"
                  name="mobile"
                  placeholder="98765 43210"
                  value={form.mobile}
                  onChange={handleChange}
                  error={errors.mobile}
                />
                <Input
                  label="Aadhar (Optional)"
                  name="aadhar"
                  placeholder="12-digit UID"
                  value={form.aadhar}
                  onChange={handleChange}
                  error={errors.aadhar}
                />
              </div>
            </div>

            {/* Field Group: Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span className="w-8 h-[1px] bg-slate-100"></span>
                Physical Address
              </div>
              <textarea
                name="address"
                rows="4"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium text-slate-700 bg-slate-50/30"
                placeholder="Enter complete residential address..."
                value={form.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={() => navigate('/customers')}
              className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel Registration
            </button>
            <button
              type="submit"
              disabled={loading}
              className="
                flex items-center gap-3 px-10 py-4 
                bg-slate-900 text-white rounded-2xl font-bold text-sm
                hover:bg-slate-800 hover:-translate-y-1 transition-all
                active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-50 cursor-pointer
              "
            >
              {loading ? "Initializing..." : (
                <>Register & Open Vault <MdOutlineArrowForward className="text-lg" /></>
              )}
            </button>
          </div>
        </form>

        {/* 🔹 Guidance Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            {/* Decorative Background Pattern */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>

            <h3 className="text-xl font-bold mb-6">Quick Guidelines</h3>

            <ul className="space-y-6 relative z-10">
              <GuideItem
                icon={<MdOutlineSmartphone className="text-emerald-400" />}
                title="Verified Mobile"
                desc="Ensure the mobile number is active."
              />
              <GuideItem
                icon={<MdOutlineFingerprint className="text-amber-400" />}
                title="Aadhar Matching"
                desc="Double check the UID to prevent duplicate profile creation."
              />
              <GuideItem
                icon={<MdOutlinePlace className="text-indigo-400" />}
                title="Full Address"
                desc="Include House No, Street, and Landmark for better logistics."
              />
            </ul>

            <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10 border-dashed">
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Privacy Note</p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Upon saving, You can upload physical documents on the next screen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const GuideItem = ({ icon, title, desc }) => (
  <li className="flex gap-4">
    <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-100">{title}</h4>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
    </div>
  </li>
);