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

const GlobalLoader = ({ primaryBrand }) => (
  <div className="fixed inset-0 bg-white flex items-center justify-center">
    <MdOutlineShield size={48} style={{ color: primaryBrand }} className="animate-pulse opacity-30" />
  </div>
);

const TabLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin" />
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
