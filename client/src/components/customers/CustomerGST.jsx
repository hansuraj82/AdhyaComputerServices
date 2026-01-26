import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getGSTByCustomer,
  addGST,
  updateGST,
  deleteGST,
  addDocument,
  deleteDocument
} from "../../services/gst.service";
import { getActiveBrokers } from "../../services/broker.service";
import { uploadFile } from "../../utils/cloudinaryUpload";
import Input from "../ui/Input";
import UploadDropzone from "../ui/UploadDropzone";
import { PdfPreview } from "../ui/PdfPreview";
import ConfirmModal from "../ui/ConfirmModal";
import {
  MdEdit,
  MdDeleteOutline,
  MdOutlineDescription,
  MdBusiness,
  MdContentCopy,
  MdClose,
  MdAdd,
  MdVisibility,
  MdVisibilityOff,
  MdOutlineBadge,
  MdVpnKey,
  MdCheckCircle,
  MdReceiptLong,
  MdRefresh,
  MdOutlineRemoveRedEye,
  MdOutlineDownload
} from "react-icons/md";

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export default function CustomerGST({ customerId }) {
  const [gstRecords, setGstRecords] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [newGst, setNewGst] = useState({
    gstNumber: "",
    filingFrequency: "YEARLY",
    brokerId: "",
    gstId: "",
    gstPassword: ""
  });

  const validate = () => {
    const errs = {};
    if (!newGst.gstNumber) errs.gstNumber = "Required";
    if (newGst.gstNumber && !GST_REGEX.test(newGst.gstNumber.toUpperCase())) errs.gstNumber = "Invalid GSTIN";
    if (!newGst.gstId) errs.gstId = "Required";
    if (!newGst.gstPassword) errs.gstPassword = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    let value = e.target.name == "gstNumber" ? e.target.value.toUpperCase() : e.target.value;
    setNewGst({ ...newGst, [e.target.name]: value });
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };


  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [gstRes, brokerRes] = await Promise.all([
        getGSTByCustomer(customerId),
        getActiveBrokers()
      ]);
      setGstRecords(gstRes.data);
      setBrokers(brokerRes.data);
    } catch (err) {
      toast.error("Failed to sync GST data");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) fetchAll();
  }, [fetchAll]);


  const handleAdd = async () => {
    if (!validate()) {
      toast.error("Please correct the highlighted errors");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});
      await addGST({ ...newGst, customerId });
      toast.success("GST Record Created");
      setNewGst({ gstNumber: "", filingFrequency: "MONTHLY", brokerId: "", gstId: "", gstPassword: "" });
      setShowAddForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add GST");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex flex-col items-center justify-center py-32">
    <MdRefresh style={{ color: "oklch(0.511 0.262 276.966)" }} size={32} className="animate-spin mb-4 opacity-80" />
    <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Loading GSTIN...</span>
  </div>

  return (
    <div className="space-y-5 max-w-full overflow-hidden">
      <div className="flex justify-between items-center px-1">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">GST Profile</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total: {gstRecords.length}</p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setErrors({}); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[11px] uppercase transition-all cursor-pointer ${showAddForm ? "bg-slate-100 text-slate-500" : "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
            }`}
        >
          {showAddForm ? <MdClose size={16} /> : <MdAdd size={16} />}
          <span className="hidden sm:inline">{showAddForm ? "Cancel" : "Add GSTIN"}</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border-2 border-indigo-50 rounded-3xl p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="GST Number" name="gstNumber" placeholder="27AAAAA0000A1Z5" value={newGst.gstNumber} error={errors.gstNumber} onChange={handleChange} />
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-1 ml-1 uppercase">Frequency</label>
              <select className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 font-bold outline-none focus:ring-2 ring-indigo-500" value={newGst.filingFrequency} onChange={(e) => setNewGst({ ...newGst, filingFrequency: e.target.value })}>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            <Input label="Portal ID" name="gstId" placeholder="Username" value={newGst.gstId} error={errors.gstId} onChange={handleChange} />
            <Input label="Portal Password" name="gstPassword" type="" placeholder="••••••••" value={newGst.gstPassword} error={errors.gstPassword} onChange={handleChange} />
            <select
              name="brokerId"
              value={newGst.brokerId}
              onChange={handleChange}
              className="w-full border rounded-xl p-2.5 text-sm bg-white font-bold"
            >
              <option value="">Select Agent</option>
              {brokers.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <button disabled={isSubmitting} onClick={handleAdd} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black uppercase text-[11px] tracking-wider cursor-pointer">
            {isSubmitting ? "Saving..." : "Register GST Profile"}
          </button>
        </div>
      )}

      {gstRecords.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem]">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
            <MdReceiptLong size={32} />
          </div>
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-widest text-slate-500">
              No GST Records
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">
              This customer hasn't filed any GST returns yet
            </p>
          </div>
        </div>
      ) : (
        /* DATA GRID */
        <div className="grid grid-cols-1 gap-4">
          {gstRecords.map((record) => (
            <GSTCard
              key={record._id}
              record={record}
              brokers={brokers}
              onRefresh={fetchAll}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const GSTCard = ({ record, brokers, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docLabel, setDocLabel] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    gstNumber: record.gstNumber,
    filingFrequency: record.filingFrequency,
    brokerId: record.brokerId?._id || "",
    gstId: record.gstId || "",
    gstPassword: record.gstPassword || ""
  });

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} Copied`);
  };

  const validate = () => {
    const errs = {};
    if (!form.gstNumber) errs.gstNumber = "Required";
    if (form.gstNumber && !GST_REGEX.test(form.gstNumber.toUpperCase())) errs.gstNumber = "Invalid";
    if (!form.gstId) errs.gstId = "Required";
    if (!form.gstPassword) errs.gstPassword = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    let value = e.target.name == "gstNumber" ? e.target.value.toUpperCase() : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const handleUpdate = async () => {
    if (!validate()) {
      toast.error("Please correct the highlighted errors");
      return;
    }

    try {
      setIsProcessing(true);
      await updateGST(record._id, form);
      toast.success("Updated");
      setIsEditing(false);
      onRefresh();
    } catch {
      toast.error("Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsProcessing(true);
      await deleteGST(record._id);
      toast.success("Deleted");
      onRefresh();
    } catch {
      toast.error("Failed");
    } finally {
      setIsProcessing(false);
      setShowDeleteModal(false);
    }
  };

  const handleConfirmDocDelete = async () => {
    try {
      setIsProcessing(true);
      await deleteDocument(record._id, docToDelete.id);
      toast.success("Doc Removed");
      onRefresh();
    } catch {
      toast.error("Failed");
    } finally {
      setIsProcessing(false);
      setDocToDelete(null);
    }
  };

  const handleDocUpload = async (file) => {
    if (!docLabel.trim()) return toast.error("Label required");
    try {
      setUploading(true);
      const res = await uploadFile(file);
      await addDocument(record._id, {
        label: docLabel,
        url: res.secure_url,
        publicId: res.public_id,
        resourceType: res.resource_type
      });
      toast.success("Doc Added");
      setDocLabel("");
      onRefresh();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <ConfirmModal open={showDeleteModal} loading={isProcessing} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} title="Delete Record" message={`Delete GSTIN ${record.gstNumber}?`} variant="danger" />
      <ConfirmModal open={!!docToDelete} loading={isProcessing} onClose={() => setDocToDelete(null)} onConfirm={handleConfirmDocDelete} title="Remove Doc" message={`Delete "${docToDelete?.label}"?`} variant="danger" />

      <div className={`bg-white border border-slate-200 rounded-[1.5rem] p-4 sm:p-5 transition-all hover:border-indigo-200 relative overflow-hidden ${isProcessing && !showDeleteModal && !docToDelete ? "opacity-60 pointer-events-none" : ""}`}>

        {isProcessing && !showDeleteModal && !docToDelete && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <MdBusiness size={24} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-mono font-black text-slate-900 text-base sm:text-lg tracking-tighter truncate">{record.gstNumber}</h4>
                <button onClick={() => handleCopy(record.gstNumber, "GSTIN")} className="cursor-pointer text-slate-300 hover:text-indigo-500"><MdContentCopy size={14} /></button>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><MdCheckCircle size={10} /> Verified</span>
                <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{record.filingFrequency}</span>
              </div>
            </div>
          </div>

          {!isEditing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-full lg:max-w-md">
              {/* Portal ID Box */}
              <div className="group bg-slate-50/80 p-3 sm:p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-white transition-all min-w-0 shadow-sm">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1.5 tracking-wider">
                  <MdOutlineBadge size={12} className="text-slate-300 shrink-0" />
                  Portal ID
                </p>

                <div className="flex items-center justify-between gap-2 min-w-0">
                  <p
                    className="text-[12px] sm:text-[13px] font-bold text-slate-700 truncate"
                    title={record.gstId}
                  >
                    {record.gstId || "N/A"}
                  </p>

                  <button
                    onClick={() => handleCopy(record.gstId, "ID")}
                    className="p-1.5 cursor-pointer rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all shrink-0"
                    title="Copy ID"
                  >
                    <MdContentCopy size={13} />
                  </button>
                </div>
              </div>

              {/* Password Box */}
              <div className="group bg-slate-50/80 p-3 sm:p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-white transition-all min-w-0 shadow-sm">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1.5 tracking-wider">
                  <MdVpnKey size={12} className="text-slate-300 shrink-0" />
                  Password
                </p>

                <div className="flex items-center justify-between gap-2 min-w-0">
                  <p className="text-[12px] sm:text-[13px] font-bold text-slate-700 truncate font-mono tracking-tight">
                    {showPass ? record.gstPassword : "••••••••"}
                  </p>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(record.gstPassword, "Password")}
                      className="cursor-pointer p-1.5 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all"
                      title="Copy Password"
                    >
                      <MdContentCopy size={13} />
                    </button>

                    <button
                      onClick={() => setShowPass(!showPass)}
                      className="cursor-pointer p-1.5 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all"
                      title={showPass ? "Hide Password" : "Show Password"}
                    >
                      {showPass ? (
                        <MdVisibilityOff size={14} />
                      ) : (
                        <MdVisibility size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>


          )}
        </div>
        {/* Right Section */}
        <div className="text-left sm:text-right shrink-0">
          <p className="text-[9px] font-black text-slate-300 uppercase">
            Created on
          </p>
          <p className="text-[10px] font-bold text-slate-500">
            {new Date(record?.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </p>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Agent: {record?.brokerId?.name || "Self"}
          </span>
        </div>

        {isEditing ? (
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4 animate-in zoom-in-95">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="GSTIN" name="gstNumber" value={form.gstNumber} error={errors.gstNumber} onChange={handleChange} />
              <Input label="ID" name="gstId" value={form.gstId} error={errors.gstId} onChange={handleChange} />
              <Input label="PASS" name="gstPassword" value={form.gstPassword} error={errors.gstPassword} onChange={handleChange} />
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1 ml-1 uppercase">Freq</label>
                <select className="w-full border border-slate-200 rounded-xl p-2 text-sm font-bold" value={form.filingFrequency} onChange={e => setForm({ ...form, filingFrequency: e.target.value })}>
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
              <select
                name="brokerId"
                value={form.brokerId}
                onChange={handleChange}
                className="w-full border rounded-xl p-2.5 text-sm bg-white font-bold"
              >
                <option value="">Select Agent</option>
                {brokers.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleUpdate} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-wider">Save</button>
              <button onClick={() => { setIsEditing(false); setErrors({}); }} className="flex-1 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl text-[10px] cursor-pointer font-black uppercase tracking-wider">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 border-t border-slate-200 pt-8 mt-6">

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
                  {record?.documents?.length || 0}
                </span>
                <span className="text-[10px] font-bold opacity-60 uppercase vertical-rl">Files</span>
              </div>
            </button>
          </div>
        )}

        {showDocs && (
          <div className="mt-6 pt-5 border-t border-slate-100 animate-in slide-in-from-top-3 duration-300">
            {/* Section Title */}
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
                Digital Document Vault
              </span>
            </div>

            {/* Upload Control Area */}
            <div className="flex flex-col gap-4 mb-6 bg-slate-50/50 p-4 sm:p-5 rounded-2xl border border-dashed border-slate-200">

              {/* Document Label */}
              <div className="space-y-1 w-full">
                <Input
                  label="Document Label"
                  placeholder="e.g. GST Certificate"
                  value={docLabel}
                  onChange={(e) => {
                    setDocLabel(e.target.value);
                    if (errors.docLabel) {
                      setErrors({ ...errors, docLabel: null });
                    }
                  }}
                  error={errors.docLabel}
                />
              </div>

              {/* File Upload */}
              <div className="w-full">
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase ml-1 mb-1">
                  File Upload
                </label>
                <UploadDropzone
                  uploading={uploading}
                  onFileSelect={(file) => {
                    if (!docLabel.trim()) {
                      setErrors({ ...errors, docLabel: "Please enter a label first" });
                      toast.error("Label Required");
                      return;
                    }
                    handleDocUpload(file);
                  }}
                />
              </div>

            </div>


            {/* Files Grid */}
            {record.documents?.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {record.documents?.map((doc) => (
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
              ))}
            </div> : (
              <div className="py-8 text-center bg-slate-50/30 rounded-2xl border border-dashed border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  No Document Found
                </p>
              </div>
            )}

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