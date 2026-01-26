import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getPoliciesByCustomer,
  addPolicy,
  updatePolicy,
  deletePolicy,
  addPolicyDocument,
  deletePolicyDocument,
  archivePolicy
} from "../../services/policy.service";
import { getActiveBrokers } from "../../services/broker.service";
import { uploadFile } from "../../utils/cloudinaryUpload";
import Input from "../ui/Input";
import UploadDropzone from "../ui/UploadDropzone";
import { PdfPreview } from "../ui/PdfPreview";
import ConfirmModal from "../ui/ConfirmModal"; // Using the updated Portal version
import {
  MdEdit,
  MdDeleteOutline,
  MdOutlineRemoveRedEye,
  MdReceiptLong,
  MdClose,
  MdAdd,
  MdOutlineHistory,
  MdRefresh,
  MdOutlineDownload,
  MdOutlineDescription
} from "react-icons/md";
import { useNotifications } from "../context/NotificationContext";

/* ================= MAIN COMPONENT ================= */

export default function CustomerPolicies({ customerId }) {
  const [policies, setPolicies] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [errors, setErrors] = useState({});
  const { fetchCount } = useNotifications();

  const [newPolicy, setNewPolicy] = useState({
    policyNumber: "",
    policyStartDate: "",
    policyEndDate: "",
    brokerId: ""
  });

  const handleChange = (e) => {
    let value = e.target.name == "policyNumber" ? e.target.value.toUpperCase() : e.target.value;
    setNewPolicy({ ...newPolicy, [e.target.name]: value });
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!newPolicy.policyNumber) errs.policyNumber = "Required";
    if (!newPolicy.policyStartDate) errs.policyStartDate = "Required";
    if (!newPolicy.policyEndDate) errs.policyEndDate = "Required";

    // Date Logic Validation
    if (newPolicy.policyStartDate && newPolicy.policyEndDate) {
      const start = new Date(newPolicy.policyStartDate);
      const end = new Date(newPolicy.policyEndDate);

      if (start > end) {
        errs.policyStartDate = "Start date cannot be after end date";
        errs.policyEndDate = "End date must be after start date";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [policyRes, brokerRes] = await Promise.all([
        getPoliciesByCustomer(customerId),
        getActiveBrokers()
      ]);
      setPolicies(policyRes.data);
      setBrokers(brokerRes.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) fetchAll();
  }, [fetchAll]);

  const handleAddPolicy = async () => {
    const { policyNumber, policyStartDate, policyEndDate } = newPolicy;
    if (!validate()) {
      toast.error("Please correct the highlighted errors");
      return;
    }

    try {
      setAdding(true);
      await addPolicy({ ...newPolicy, customerId });
      toast.success("Policy added");
      fetchCount();
      setNewPolicy({ policyNumber: "", policyStartDate: "", policyEndDate: "", brokerId: "" });
      setShowAddForm(false);
      fetchAll();
    } catch {
      toast.error("Failed to add policy");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="flex flex-col items-center justify-center py-32">
    <MdRefresh style={{ color: "oklch(0.511 0.262 276.966)" }} size={32} className="animate-spin mb-4 opacity-80" />
    <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Loading Policies...</span>
  </div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">Insurance Policies</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${showAddForm ? "bg-slate-100 text-slate-500" : "bg-indigo-600 text-white shadow-lg"
            }`}
        >
          {showAddForm ? <><MdClose /> Cancel</> : <><MdAdd /> New Policy</>}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border-2 border-indigo-50 rounded-2xl p-6 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-4">
          <Input
            label="Policy Number"
            placeholder="POL12345678"
            name="policyNumber"
            value={newPolicy.policyNumber}
            onChange={handleChange}
            error={errors.policyNumber}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="policyStartDate"
              type="date"
              label="Start Date"
              value={newPolicy.policyStartDate}
              onChange={handleChange}
              error={errors.policyStartDate}
            />
            <Input
              name="policyEndDate"
              type="date"
              label="End Date"
              value={newPolicy.policyEndDate}
              onChange={handleChange}
              error={errors.policyEndDate}
            />
          </div>
          <select
            value={newPolicy.brokerId}
            onChange={(e) => setNewPolicy({ ...newPolicy, brokerId: e.target.value })}
            className="w-full border rounded-xl p-3 text-sm bg-slate-50 font-bold outline-none ring-indigo-500 focus:ring-2"
          >
            <option value="">Select Agent (Optional)</option>
            {brokers.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
          <button
            disabled={adding}
            onClick={handleAddPolicy}
            className="w-full bg-emerald-600 disabled:bg-emerald-300 text-white py-3 cursor-pointer rounded-xl font-bold shadow-md transition-all flex justify-center items-center gap-2"
          >
            {adding ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : null}
            {adding ? "Saving..." : "Save Policy"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {policies.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
              <MdReceiptLong size={32} />
            </div>
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-widest text-slate-500">
                No Insurance Records
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">
                No policies found for this customer.
              </p>
            </div>
          </div>
        ) : (
          policies.map((policy) => (
            <PolicyCard
              key={policy._id}
              policy={policy}
              brokers={brokers}
              onRefresh={fetchAll}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ================= POLICY CARD ================= */

const PolicyCard = ({ policy, brokers, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docLabel, setDocLabel] = useState("");
  const [errors, setErrors] = useState({});
  const [docLabelError, setDocLabelError] = useState("");

  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const { fetchCount } = useNotifications();

  const [form, setForm] = useState({
    policyNumber: policy.policyNumber,
    policyStartDate: policy.policyStartDate.slice(0, 10),
    policyEndDate: policy.policyEndDate.slice(0, 10),
    brokerId: policy.brokerId?._id || ""
  });

  const handleChange = (e) => {
    let value = e.target.name == "policyNumber" ? e.target.value.toUpperCase() : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};

    // Basic Required Fields
    if (!form.policyNumber) errs.policyNumber = "Required";
    if (!form.policyStartDate) errs.policyStartDate = "Required";
    if (!form.policyEndDate) errs.policyEndDate = "Required";

    // Date Logic Validation
    if (form.policyStartDate && form.policyEndDate) {
      const start = new Date(form.policyStartDate);
      const end = new Date(form.policyEndDate);

      if (start > end) {
        errs.policyStartDate = "Start date cannot be after end date";
        errs.policyEndDate = "End date must be after start date";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = async () => {
    try {
      if (!validate()) {
        return;
      }
      setIsProcessing(true);
      await updatePolicy(policy._id, form);
      toast.success("Policy updated");
      setIsEditing(false);
      onRefresh();
      fetchCount();
    } catch {
      toast.error("Update failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsProcessing(true);
      await deletePolicy(policy._id);
      toast.success("Policy Deleted");
      onRefresh();
      fetchCount();
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsProcessing(false);
      setShowDeleteModal(false);
    }
  };

  const handleArchive = async () => {
    try {
      setIsProcessing(true);
      await archivePolicy(policy._id);
      toast.success("Policy Archived");
      onRefresh();
      fetchCount();
    } catch {
      toast.error("Archive failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDocDelete = async () => {
    if (!docToDelete) return;
    try {
      setIsProcessing(true);
      await deletePolicyDocument(policy._id, docToDelete.id);
      toast.success("Document removed");
      onRefresh();
    } catch {
      toast.error("Removal failed");
    } finally {
      setIsProcessing(false);
      setDocToDelete(null);
    }
  };

  const handleUpload = async (file) => {
    if (!docLabel.trim()) return setDocLabelError("Document Label is Required");
    try {
      setUploading(true);
      const res = await uploadFile(file);
      await addPolicyDocument(policy._id, {
        label: docLabel,
        url: res.secure_url,
        publicId: res.public_id,
        resourceType: res.resource_type
      });
      toast.success("Document added");
      setDocLabel("");
      onRefresh();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const statusColor = {
    ACTIVE: "bg-emerald-50 text-emerald-600",
    EXPIRING: "bg-amber-50 text-amber-600",
    EXPIRED: "bg-rose-50 text-rose-600"
  };

  return (
    <>
      {/* Policy Delete Modal */}
      <ConfirmModal
        open={showDeleteModal}
        loading={isProcessing}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Policy"
        message={`Are you sure you want to delete policy ${policy.policyNumber}? This will remove all associated documents.`}
        variant="danger"
      />

      {/* Document Delete Modal */}
      <ConfirmModal
        open={!!docToDelete}
        loading={isProcessing}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleDocDelete}
        title="Remove Document"
        message={`Delete "${docToDelete?.label}" from this policy?`}
        variant="danger"
      />

      <div className={`bg-white border rounded-3xl p-5 transition-all relative ${isProcessing ? "opacity-70 pointer-events-none" : "hover:shadow-md"}`}>

        {/* Loading Overlay */}
        {isProcessing && !showDeleteModal && !docToDelete && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-3xl">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Policy Header Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 mb-4 space-y-4">

          {/* Top Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            {/* Policy Info */}
            <div className="min-w-0 space-y-1">
              <h4 className="font-black text-slate-800 text-base sm:text-lg truncate">
                {policy.policyNumber}
              </h4>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Agent: {policy.brokerId?.name || "Self"}
                </span>

                {policy.daysLeft > 0 && (
                  <span
                    className={`text-[10px] font-bold uppercase ${statusColor[policy.status]}`}
                  >
                    {policy.daysLeft} Days Left
                  </span>
                )}

                {policy.daysLeft < 0 && (
                  <span
                    className={`text-[10px] font-bold uppercase ${statusColor[policy.status]}`}
                  >
                    Expired {Math.abs(policy.daysLeft)} d ago
                  </span>
                )}

                {policy.daysLeft === 0 && (
                  <span
                    className={`text-[10px] font-bold uppercase ${statusColor[policy.status]}`}
                  >
                    Expiring Today
                  </span>
                )}
              </div>
            </div>

            {/* Status Pill */}
            <span
              className={`self-start sm:self-auto px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor[policy.status]}`}
            >
              {policy.status}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-bold uppercase">
            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-slate-400">Start Date</span>
              <span className="text-slate-700">
                {new Date(policy.policyStartDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-slate-400">Expiry Date</span>
              <span className="text-slate-700">
                {new Date(policy.policyEndDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
          </div>
        </div>


        {isEditing ? (
          <div className="space-y-4 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100 animate-in zoom-in-95">
            <Input label="Policy Number" name="policyNumber" value={form.policyNumber} onChange={handleChange} error={errors.policyNumber} />
            <div className="grid grid-cols-2 gap-4">
              <Input type="date" label="Start" name="policyStartDate" value={form.policyStartDate} onChange={handleChange} error={errors.policyStartDate} />
              <Input type="date" label="End" name="policyEndDate" value={form.policyEndDate} onChange={handleChange} error={errors.policyEndDate} />
            </div>
            <select
              value={form.brokerId}
              onChange={e => setForm({ ...form, brokerId: e.target.value })}
              className="w-full border rounded-xl p-2.5 text-sm bg-white font-bold"
            >
              <option value="">Select Agent</option>
              {brokers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={handleUpdate} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold cursor-pointer">Update</button>
              <button onClick={() => setIsEditing(false)} className="flex-1 bg-white border text-slate-500 py-2 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
            </div>
          </div>
        ) : <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 border-t border-slate-200 pt-8 mt-6">

          {/* Left: Utility Command Group */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Command Button: Edit */}
            <div className="flex flex-col items-center group">
              <button
                onClick={() => setIsEditing(true)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-500 shadow-sm transition-all duration-300 group-hover:border-indigo-500 group-hover:text-indigo-600 group-hover:-translate-y-1 group-active:scale-90 cursor-pointer"
              >
                <MdEdit size={22} />
              </button>
              <span className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                Edit
              </span>
            </div>

            {/* Command Button: Delete */}
            <div className="flex flex-col items-center group">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 shadow-sm transition-all duration-300 group-hover:border-rose-500 group-hover:text-rose-600 group-hover:-translate-y-1 group-active:scale-90 cursor-pointer"
              >
                <MdDeleteOutline size={22} />
              </button>
              <span className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                Delete
              </span>
            </div>

            {/* Command Button: Archive (Dynamic Status) */}
            {policy.daysLeft < 0 && (
              <div className="flex flex-col items-center group">
                <button
                  disabled={policy.archived}
                  onClick={handleArchive}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl border shadow-sm transition-all duration-300 group-active:scale-90 
                      ${policy.archived
                      ? "bg-slate-50 border-slate-100 text-red-500 cursor-not-allowed"
                      : "bg-white border-slate-200 text-amber-600 group-hover:border-amber-500 group-hover:text-amber-600 group-hover:-translate-y-1 cursor-pointer"
                    }`}
                >
                  <MdOutlineHistory size={22} />
                </button>
                <span className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {policy.archived ? "Closed" : "Close"}
                </span>
              </div>
            )}
          </div>

          {/* Right: Primary Intelligence Button */}
          <button
            onClick={() => setShowDocs(!showDocs)}
            className={`
                        relative overflow-hidden group/main
                        flex items-center justify-between gap-8 px-6 py-4 rounded-3xl transition-all duration-500 cursor-pointer
                        ${showDocs
                ? "bg-slate-900 text-white shadow-2xl shadow-slate-300"
                : "bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-1"
              }
                      `}
          >
            {/* Labeling Group */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              {/* 1. Adaptive Icon Container */}
              <div className="
                              w-9 h-9 sm:w-11 sm:h-11 
                              rounded-lg sm:rounded-xl 
                              bg-white/10 flex items-center justify-center backdrop-blur-md 
                              group-hover/main:rotate-12 transition-transform shrink-0
                            ">
                {/* Icon scales slightly between mobile/desktop */}
                <MdOutlineDescription className="text-[20px] sm:text-[24px]" />
              </div>

              {/* 2. Text Stack with Responsive Sizing */}
              <div className="flex flex-col items-start min-w-0">
                {/* Subtitle: Smaller on mobile, more spacing on desktop */}
                <span className="
                    text-[8px] sm:text-[10px] 
                    font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] 
                    text-indigo-200/80 leading-none mb-0.5 sm:mb-1
                  ">
                  Secure Vault
                </span>

                {/* Main Title: Prevents layout break with truncate and responsive size */}
                <span className="
                  text-sm sm:text-base 
                  font-bold tracking-tight text-white 
                  truncate w-full
                ">
                  Repository Assets
                </span>
              </div>
            </div>

            {/* Counter Badge */}
            <div className="flex items-center gap-2 pl-6 border-l border-white/10">
              <span className="text-2xl font-black tabular-nums">
                {policy?.documents?.length || 0}
              </span>
              <span className="text-[10px] font-bold opacity-60 uppercase vertical-rl">Files</span>
            </div>
          </button>
        </div>
        }

        {showDocs && (
          <div className="mt-6 p-2 border-t border-slate-100 animate-in slide-in-from-top-3 duration-300">
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
                Digital Document Vault
              </span>
            </div>
            <div className="pb-2">
              <div className="pb-2">
                <Input
                  label="Document Label"
                  placeholder="e.g. ITR Acknowledgement"
                  value={docLabel}
                  onChange={e => { setDocLabel(e.target.value); setDocLabelError("") }}
                  error={docLabelError}
                />
              </div>
              <UploadDropzone uploading={uploading} onFileSelect={handleUpload} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {policy.documents?.map((doc) => (
                <div
                  key={doc._id}
                  className="group bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-xl transition-all duration-300 p-3 flex flex-col min-w-0"
                >
                  {/* 1. Compact Preview */}
                  <div className="relative w-full h-32 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
                    {doc.resourceType === "raw" ? (
                      <PdfPreview publicId={doc.publicId} />
                    ) : (
                      <img
                        src={doc.url}
                        className="w-full h-full object-cover"
                        alt={doc.label}
                      />
                    )}
                  </div>

                  {/* 2. Info Section - Truncated to prevent push-out */}
                  <div className="py-3 px-1">
                    <p className="text-[13px] font-bold text-slate-800 truncate">
                      {doc.label}
                    </p>
                  </div>

                  {/* 3. The "Smart Fit" Action Bar */}
                  <div className="mt-auto grid grid-cols-3 gap-1 border-t border-slate-50 pt-3">
                    <IconButton
                      icon={<MdOutlineRemoveRedEye size={18} />}
                      label="View"
                      onClick={() => window.open(doc.url)}
                      activeClass="text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white"
                    />
                    <IconButton
                      icon={<MdOutlineDownload size={18} />}
                      label="Save"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = doc.url;
                        a.download = doc.label;
                        a.click();
                      }}
                      activeClass="text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white"
                    />
                    <IconButton
                      icon={<MdDeleteOutline size={18} />}
                      label="Del"
                      onClick={() => setDocToDelete({ id: doc._id, label: doc.label })}
                      activeClass="text-slate-400 bg-slate-50 hover:bg-rose-600 hover:text-white"
                    />
                  </div>
                </div>
              )
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};


const IconButton = ({ icon, label, onClick, activeClass }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`
      flex flex-col items-center justify-center gap-1 
      py-2 rounded-lg transition-all duration-200 cursor-pointer
      group/btn ${activeClass}
    `}
  >
    {icon}
    <span className="text-[9px] font-black uppercase tracking-tighter">
      {label}
    </span>
  </button>
);