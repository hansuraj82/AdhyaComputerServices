import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  addBroker,
  updateBroker,
  enableBroker,
  disableBroker,
  getBrokerSummary, // New
  getBrokerWork     // New
} from "../../services/broker.service";
import Input from "../../components/ui/Input";
import {
  MdEdit,
  MdCheckCircleOutline,
  MdCheckCircle,
  MdAdd,
  MdClose,
  MdOutlineBlock,
  MdArrowBack,
  MdChevronRight,
  MdHistory,
  MdCheck
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function BrokerManagement() {
  document.title = `Agents | Adhya Computer`;
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" | "summary" | "work"
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [workDetails, setWorkDetails] = useState({ records: [], pagination: {} });
  const [workFilters, setWorkFilters] = useState({ type: 'policy', page: 1, from: '', to: '' });

  const navigate = useNavigate();

  // Load standard broker list
  const fetchBrokers = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await getBrokerSummary(); // Using summary here as it's more informative
      setBrokers(res.data);
    } catch {
      toast.error("Failed to load brokers");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load Work Details (for the deep-dive view)
  const fetchWork = useCallback(async () => {
    if (!selectedBroker) return;
    try {
      setLoading(true);
      const res = await getBrokerWork(selectedBroker._id, workFilters);
      setWorkDetails(res.data);
    } catch {
      toast.error("Failed to load work records");
    } finally {
      setLoading(false);
    }
  }, [selectedBroker, workFilters]);

  useEffect(() => {
    if (view === "list") fetchBrokers();
    if (view === "work") fetchWork();
  }, [view, fetchBrokers, fetchWork]);

  // View Switching Logic
  const openWorkDetails = (broker) => {
    setSelectedBroker(broker);
    setWorkFilters({ type: 'policy', page: 1, from: '', to: '' });
    setView("work");
  };

  if (loading && view === "list") return <SkeletonLoader />;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {view === "work" ? "Agent Performance" : "Agent Management"}
          </h2>
          <p className="text-xs text-slate-400">
            {view === "work" ? `Reviewing ${selectedBroker.name}` : "Manage your network of agents"}
          </p>
        </div>

        <div className="flex gap-2">
          {view === "work" ? (
            <button onClick={() => setView("list")} className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-slate-100 text-slate-600">
              <MdArrowBack /> Back
            </button>
          ) : (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${showAddForm ? "bg-slate-100 text-slate-600" : "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                }`}
            >
              {showAddForm ? <><MdClose /> Cancel</> : <><MdAdd /> New Agent</>}
            </button>
          )}
        </div>
      </div>

      {/* Conditional Rendering of Forms/Views */}
      {view === "list" && showAddForm && (
        <AddBrokerForm
          onSuccess={() => { setShowAddForm(false); fetchBrokers(true); }}
        />
      )}

      {view === "list" && (
        <div className="space-y-4">
          {brokers.length === 0 ? (
            <EmptyState message="No active agents found." />
          ) : (
            brokers.map((broker) => (
              <BrokerCard
                key={broker._id}
                broker={broker}
                onRefresh={() => fetchBrokers(true)}
                onViewWork={() => openWorkDetails(broker)}
              />
            ))
          )}
        </div>
      )}

      {view === "work" && (
        <WorkDetailView
          data={workDetails}
          filters={workFilters}
          setFilters={setWorkFilters}
          loading={loading}
          navigate={navigate}
        />
      )}
    </div>
  );
}

/* ================= WORK DETAIL VIEW ================= */

const WorkDetailView = ({ data, filters, setFilters, loading, navigate }) => (
  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
    {/* Type Toggles */}
    <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
      {['policy', 'itr', 'gst'].map((t) => (
        <button
          key={t}
          onClick={() => setFilters({ ...filters, type: t, page: 1 })}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${filters.type === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
        >
          {t}
        </button>
      ))}
    </div>

    {/* Date Filters */}
    <div className="grid grid-cols-2 gap-4">
      <Input type="date" label="From" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
      <Input type="date" label="To" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
    </div>

    {/* Records Table */}
    <div className="overflow-hidden">
      {loading ? (
        <div className="flex flex-col items-center gap-2 text-slate-400 font-bold">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
          Fecthing Records...
        </div>
      ) : data.records.length === 0 ? (
        <div className="py-10 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed">
          No {filters.type} records found.
        </div>
      ) : (
        <div className="space-y-3">
          {data.records.map((r) => (
            <div
              key={r._id}
              // Navigation logic: only navigates if customerId exists
              onClick={() => r.customerId?._id && navigate(`/customers/${r.customerId._id}`)}
              className={`flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all 
      ${r.customerId?._id ? "cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 active:scale-[0.98]" : ""}`}
            >
              <div className="flex items-center gap-3">
                {/* Optional: Add a small icon to indicate it's a link */}
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800 flex items-center gap-2">
                    {r.customerId?.name || "Unknown Customer"}
                    {r.customerId?._id && <span className="text-[8px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">View Profile</span>}
                  </p>
                  <p className="text-xs text-slate-500">{r.customerId?.mobile || "No mobile"}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center pt-4">
            <span className="text-[10px] font-bold text-slate-400">Total: {data.pagination.totalItems}</span>
            <div className="flex gap-2">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                className="p-2 bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              ><MdChevronRight className="rotate-180" /></button>
              <button
                disabled={filters.page >= data.pagination.totalPages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                className="p-2 bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              ><MdChevronRight /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

/* ============= UPDATED BROKER CARD ============= */

const BrokerCard = ({ broker, onRefresh, onViewWork }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [form, setForm] = useState({ name: broker.name, mobile: broker.mobile });
  const [editErrors, setEditErrors] = useState({});

  const validateEdit = () => {
    let tempErrors = {};
    if (!form.name.trim()) tempErrors.name = "Name is Required";
    if (!form.mobile.trim()) tempErrors.mobile = "Mobile Number Required"
    if (form.mobile.trim() && !/^\d{10}$/.test(form.mobile)) tempErrors.mobile = "Invalid Mobile";
    setEditErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    // Clear error when user starts typing in that field again
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleUpdate = async () => {
    if (!validateEdit()) return;
    performAction(async () => {
      await updateBroker(broker._id, form);
      toast.success("Updated");
      setIsEditing(false);
    });
  };

  const handleToggleStatus = async () => {
    performAction(async () => {
      broker.isActive ? await disableBroker(broker._id) : await enableBroker(broker._id);
      toast.success(broker.isActive ? "Agent Disabled" : "Agent Enabled");
    });
  };

  const performAction = async (actionFn) => {
    try {
      setIsActionLoading(true);
      await actionFn();
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className={`bg-white border rounded-2xl p-5 transition-all relative overflow-hidden border-slate-100 hover:shadow-md`}>
      <div className={`bg-white border rounded-2xl p-5 transition-all relative overflow-hidden ${isActionLoading ? "border-indigo-100" : "border-slate-100 hover:shadow-md"}`}>
        {/* Loading Overlay Bar */}
        {isActionLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-50 overflow-hidden">
            <div className="h-full bg-indigo-500 animate-loading-bar" style={{ width: '30%' }} />
          </div>
        )}

        <div className={`flex justify-between items-start ${isActionLoading ? "opacity-50" : "opacity-100"}`}>
          <div className="flex-1 space-y-3">
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                <div>
                  <Input
                    name="name"
                    label="Name"
                    value={form.name}
                    onChange={handleChange}
                    error={editErrors.name}
                  />
                </div>
                <div>
                  <Input
                    name="mobile"
                    label="Mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    error={editErrors.mobile}
                  />
                </div>
              </div>
            ) : (
              <div>
                <h4 className="font-black text-slate-900">{broker.name}</h4>
                <p className="text-sm text-slate-500 font-medium">{broker.mobile}</p>
              </div>
            )}
          </div>

          <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md ${broker.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}>
            <MdCheckCircle /> {broker.isActive ? "ACTIVE" : "DISABLED"}
          </div>
        </div>

        <div className="flex gap-4 pt-2 border-t mt-4 border-slate-50">
          {isEditing ? (
            <>
              <button
                disabled={isActionLoading}
                onClick={handleUpdate}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-black uppercase tracking-[0.05em] transition-all duration-200 shadow-md shadow-indigo-100 active:scale-[0.98] disabled:cursor-not-allowed cursor-pointer"
              >
                {isActionLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <MdCheck size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              <button
                disabled={isActionLoading}
                onClick={() => {
                  setIsEditing(false);
                  setEditErrors({});
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Edit Button - Subtle Outline Style */}
              <button
                disabled={isActionLoading}
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                <MdEdit size={14} className="opacity-70" />
                <span>Edit</span>
              </button>

              {/* Status Toggle - Subtle Ghost Style with Semantic Colors */}
              <button
                disabled={isActionLoading}
                onClick={handleToggleStatus}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50 
      ${broker.isActive
                    ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    : "text-emerald-600 hover:bg-emerald-50"
                  }`}
              >
                {isActionLoading ? (
                  <div className={`w-3 h-3 border-2 border-t-transparent rounded-full animate-spin ${broker.isActive ? 'border-rose-500' : 'border-emerald-500'}`} />
                ) : (
                  broker.isActive ? <MdOutlineBlock size={15} /> : <MdCheckCircleOutline size={15} />
                )}
                <span>{broker.isActive ? "Deactivate" : "Activate Agent"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Chips (New) */}
      <div className="flex gap-2 mt-3">
        <div className="flex gap-2">
          <SummaryChip label="POL" count={broker.policyCount} theme="blue" />
          <SummaryChip label="ITR" count={broker.itrCount} theme="purple" />
          <SummaryChip label="GST" count={broker.gstCount} theme="amber" />
        </div>
      </div>

      <div className="flex gap-4 pt-2 border-t mt-4 border-slate-50">
        {/* ... keep edit and disable buttons ... */}

        <button
          onClick={onViewWork}
          className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-100 hover:border-indigo-600 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-indigo-100 active:scale-95 cursor-pointer"
        >
          <MdHistory size={14} className="opacity-80" />
          Activity Logs
        </button>
      </div>
    </div>
  );
};

const SummaryChip = ({ label, count, theme }) => {
  const themes = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };

  const colorClass = themes[theme] || "bg-slate-50 text-slate-600 border-slate-100";

  return (
    <div className={`
      flex items-center justify-center gap-1.5 md:gap-3 
      px-2 md:px-4 py-1 md:py-2 
      rounded-lg md:rounded-xl 
      border shadow-sm transition-all duration-300 
      ${colorClass}
    `}>
      {/* Label: Scales from tiny on mobile to readable on desktop */}
      <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest opacity-60">
        {label}
      </span>

      {/* Smart Divider: Thicker on desktop */}
      <div className="w-[1px] h-3 md:h-4 bg-current opacity-20" />

      {/* Count: Bold and prominently scaled */}
      <span className="text-[11px] md:text-sm font-black tabular-nums tracking-tight">
        {count || 0}
      </span>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="space-y-4 max-w-3xl animate-pulse">
    <div className="h-10 bg-slate-200 rounded-xl w-48" />
    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl" />)}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="bg-slate-50 border border-dashed rounded-3xl p-10 text-center">
    <p className="text-slate-400 font-medium">{message}</p>
  </div>
);



/* ================= ADD BROKER FORM COMPONENT ================= */

const AddBrokerForm = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBroker, setNewBroker] = useState({ name: "", mobile: "" });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    if (!newBroker.name.trim()) tempErrors.name = "Name is required";
    if (!newBroker.mobile.trim()) tempErrors.mobile = "Mobile Number is Required"
    if (newBroker.mobile.trim() && !/^\d{10}$/.test(newBroker.mobile)) {
      tempErrors.mobile = "Mobile must be exactly 10 digits";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewBroker({ ...newBroker, [name]: value });

    // Clear error when user starts typing in that field again
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddBroker = async () => {
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      await addBroker(newBroker);
      toast.success("Broker added successfully");

      // Reset local state
      setNewBroker({ name: "", mobile: "" });

      // Execute the callback from parent (closes form & refreshes list)
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add broker");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-2 border-indigo-50 rounded-2xl p-6 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            name="name"
            label="Agent Name"
            placeholder="Enter full name"
            value={newBroker.name}
            onChange={handleChange}
            error={errors.name}
          />
        </div>
        <div>
          <Input
            name="mobile"
            label="Mobile Number"
            placeholder="10 digit number"
            value={newBroker.mobile}
            onChange={handleChange}
            error={errors.mobile}
          />
        </div>
      </div>

      <button
        onClick={handleAddBroker}
        disabled={isSubmitting}
        className="flex items-center cursor-pointer justify-center gap-2 w-full md:w-auto bg-indigo-600 disabled:bg-indigo-300 text-white px-8 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : null}
        {isSubmitting ? "Adding Agent..." : "Confirm & Add Agent"}
      </button>
    </div>
  );
};