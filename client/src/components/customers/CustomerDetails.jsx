import { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getCustomerById } from "../../services/customer.service";
import CustomerNotFound from "../CustomerNotFound";

import { CiEdit } from "react-icons/ci";
import {
  MdVerified,
  MdArrowBack,
  MdOutlineShield,
  MdRefresh
} from "react-icons/md";

const CustomerDocuments = lazy(() => import("./CustomerDocuments"));
const CustomerPolicies = lazy(() => import("./CustomerPolicies"));
const CustomerGST = lazy(() => import("./CustomerGST"));
const CustomerITR = lazy(() => import("./CustomerITR"));

const TABS = [
  { id: "documents", label: "Documents" },
  { id: "policies", label: "Policies" },
  { id: "gst", label: "GST Profile" },
  { id: "itr", label: "ITR Filings" }
];

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const primaryBrand = "oklch(0.511 0.262 276.966)";

  const [customer, setCustomer] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("documents");
  const [isNotFound, setIsNotFound] = useState(false);

  const fetchCustomer = useCallback(async () => {
    try {
      setPageLoading(true);
      const res = await getCustomerById(id);
      if (!res.data) return setIsNotFound(true);
      setCustomer(res.data);
    } catch (err) {
      setIsNotFound(true);
      toast.error(err.message || "Failed to sync customer profile");
    } finally {
      setTimeout(() => setPageLoading(false), 600);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  if (pageLoading) return <GlobalLoader primaryBrand={primaryBrand} />;
  if (isNotFound) return <CustomerNotFound />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 sm:pb-20">
      {/* Sub Navbar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900"
            >
              <MdArrowBack size={22} />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase truncate">
                {customer.name}
              </h1>
              <MdVerified style={{ color: primaryBrand }} size={16} />
            </div>
          </div>

          <button
            onClick={() => navigate(`/customers/edit/${id}`)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95"
          >
            <CiEdit size={18} /> Edit Profile
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Panel */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold truncate">
                      {customer.name}
                    </h2>
                    <span className="text-xs text-slate-500">
                      Customer Profile
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <SimpleRow label="Phone" value={customer.mobile} />
                <SimpleRow label="Aadhaar" value={customer.aadhar} isMono />
                <SimpleRow label="Address" value={customer.address} />

                <div className="pt-4 border-t border-slate-100 flex justify-between text-xs">
                  <span className="font-bold text-slate-400 uppercase">
                    Member Since
                  </span>
                  <span className="font-semibold text-slate-600">
                    {new Date(customer.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Panel */}
          <section className="lg:col-span-8">
            <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-hide bg-slate-200/40 p-1.5 rounded-2xl border border-slate-200/50">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap px-5 py-2 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer ${activeTab === tab.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-sm min-h-[420px]">
              <Suspense fallback={<TabLoader />}>
                {activeTab === "documents" && <CustomerDocuments customerId={id} />}
                {activeTab === "policies" && <CustomerPolicies customerId={id} />}
                {activeTab === "gst" && <CustomerGST customerId={id} />}
                {activeTab === "itr" && <CustomerITR customerId={id} />}
              </Suspense>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const GlobalLoader = ({ primaryBrand = "#4f46e5" }) => (
  <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center overflow-hidden">
    {/* 1. Main Centered Container */}
    <div className="relative flex flex-col items-center justify-center p-8 text-center">
      
      {/* 2. Visual Layering (The "Smart" Pulse) */}
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Background Ripple Effect */}
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-10"
          style={{ backgroundColor: primaryBrand }}
        />
        
        {/* Secondary Glow Layer */}
        <div 
          className="absolute w-16 h-16 rounded-full blur-2xl opacity-20 animate-pulse"
          style={{ backgroundColor: primaryBrand }}
        />

        {/* The Primary Shield Icon */}
        <div className="relative z-10 transition-transform duration-500 scale-110">
          <MdOutlineShield 
            size={56} 
            style={{ color: primaryBrand }} 
            className="animate-pulse drop-shadow-sm" 
          />
        </div>
      </div>

      {/* 3. Professional Status Feedback */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
          Secure Authorization
        </span>
        <div className="h-[2px] w-12 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full animate-[loading_1.5s_infinite_ease-in-out]" 
            style={{ backgroundColor: primaryBrand, width: '40%' }}
          />
        </div>
      </div>
    </div>

    {/* Custom Animation for the Progress Line */}
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(250%); }
      }
    `}} />
  </div>
);

const TabLoader = () => (
<div className="flex flex-col items-center justify-center py-32">
    <MdRefresh style={{ color: "oklch(0.511 0.262 276.966)" }} size={32} className="animate-spin mb-4 opacity-50" />
    <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Loading Module...</span>
  </div>
);

const SimpleRow = ({ label, value, isMono }) => (
  <div>
    <span className="text-[10px] font-bold text-slate-400 uppercase">
      {label}
    </span>
    <p className={`text-sm text-slate-700 break-words ${isMono ? "font-mono" : ""}`}>
      {value || "Not provided"}
    </p>
  </div>
);
