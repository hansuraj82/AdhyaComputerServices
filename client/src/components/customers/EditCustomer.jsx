import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineArrowBack, MdOutlinePersonOutline, MdOutlineSave, MdOutlineErrorOutline } from "react-icons/md";
import Input from "../../components/ui/Input";
import { getCustomerById, updateCustomer } from "../../services/customer.service";
import toast from "react-hot-toast";

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  document.title = "Edit-Customer | Adhya Computer"

  const [form, setForm] = useState({ name: "", mobile: "", aadhar: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required for identification";
    if (!/^\d{10}$/.test(form.mobile)) errs.mobile = "Provide a valid 10-digit mobile number";
    if (form.aadhar && !/^\d{12}$/.test(form.aadhar)) errs.aadhar = "Aadhar must be exactly 12 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await getCustomerById(id);
        setForm({
          name: res.data.name || "",
          mobile: res.data.mobile || "",
          aadhar: res.data.aadhar || "",
          address: res.data.address || ""
        });
      } catch (err) {
        toast.error("Resource fetch failed");
      } finally {
        setPageLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
        toast.error("Please correct the highlighted errors");
        return;
    }
    setLoading(true);
    try {
      await updateCustomer(id, form);
      toast.success("Profile Updated Successfully");
      navigate(`/customers/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal Update Error");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-400 mt-4 tracking-widest uppercase">Syncing Data...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* 🔹 Breadcrumb Navigation */}
      <button 
        onClick={() => navigate(`/customers/${id}`)}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group"
      >
        <MdOutlineArrowBack className="group-hover:-translate-x-1 transition-transform" />
        BACK TO PROFILE
      </button>

      {/* 🔹 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <MdOutlinePersonOutline />
            </span>
            Edit Customer Profile
          </h1>
          <p className="text-[13px] text-slate-500 font-medium mt-1">
            Update personal identity and contact records for UID: <span className="font-mono text-slate-900">{form.aadhar}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8">
        {/* 🔹 Left: Info Content */}
        <div className="md:col-span-4 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Account Identity</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
                Ensure the Aadhar and Full Name match the physical documents to avoid verification issues later.
            </p>
        </div>

        {/* 🔹 Right: Form Card */}
        <div className="md:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="Enter legal name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <Input
                  label="Mobile Number"
                  name="mobile"
                  placeholder="10-digit mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  error={errors.mobile}
                />
              </div>

              <Input
                label="Aadhar Card (UIDAI)"
                name="aadhar"
                placeholder="12-digit UID"
                value={form.aadhar}
                onChange={handleChange}
                error={errors.aadhar}
              />

              <div className="space-y-1">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest">
                    Residential Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none text-sm font-medium text-slate-700"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Current permanent address..."
                />
              </div>
            </div>

            {/* 🔹 Form Footer */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                    {Object.keys(errors).length > 0 && (
                        <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 animate-pulse">
                            <MdOutlineErrorOutline /> Validation required
                        </span>
                    )}
                </div>
                <div className="flex gap-3">
                    <button 
                        type="button"
                        onClick={() => navigate(`/customers/${id}`)}
                        className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            flex items-center gap-2 px-8 py-2.5 
                            bg-slate-900 text-white rounded-xl font-bold text-sm
                            hover:bg-slate-800 transition-all active:scale-95
                            shadow-lg shadow-slate-200 disabled:opacity-50 cursor-pointer
                        "
                    >
                        {loading ? "Updating..." : <><MdOutlineSave className="text-lg" /> Save Changes</>}
                    </button>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}