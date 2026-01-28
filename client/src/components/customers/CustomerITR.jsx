import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getITRsByCustomer,
  addITR,
  updateITR,
  deleteITR,
  addDocument,
  deleteDocument
} from "../../services/itr.service";
import { getActiveBrokers } from "../../services/broker.service";
import { uploadFile } from "../../utils/cloudinaryUpload";
import Input from "../ui/Input";
import UploadDropzone from "../ui/UploadDropzone";
import { PdfPreview } from "../ui/PdfPreview";
import ConfirmModal from "../ui/ConfirmModal"; // Using the updated Portal version
import {
  MdEdit,
  MdDeleteOutline,
  MdOutlineDownload,
  MdReceiptLong,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdContentCopy,
  MdClose,
  MdAdd,
  MdRefresh,
  MdOutlineRemoveRedEye,
  MdOutlineDescription,
  MdInfoOutline
} from "react-icons/md";

export default function CustomerITR({ customerId }) {
  const [itrs, setItrs] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newITR, setNewITR] = useState({
    panNumber: "",
    itrPassword: "",
    brokerId: ""
  });

  const [errors, setErrors] = useState({});

  // Centralized Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Auto-uppercase PAN Number
    let finalValue = name === "panNumber" ? value.toUpperCase() : value;

    setNewITR({ ...newITR, [name]: finalValue });

    // Clear error when user starts typing in that field again
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validation Logic
  const validate = () => {
    const errs = {};
    if (!newITR.panNumber) {
      errs.panNumber = "PAN Number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(newITR.panNumber.toUpperCase())) {
      errs.panNumber = "Invalid PAN format (e.g. ABCDE1234F)";
    }

    if (!newITR.itrPassword) {
      errs.itrPassword = "Password is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [itrRes, brokerRes] = await Promise.all([
        getITRsByCustomer(customerId),
        getActiveBrokers()
      ]);
      setItrs(itrRes.data);
      setBrokers(brokerRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load ITR records");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) fetchAll();
  }, [fetchAll]);

  const handleAdd = async () => {
    if (!validate()) return; // Stop if validation fails

    try {
      setIsSubmitting(true);
      await addITR({ ...newITR, customerId });
      toast.success("ITR Record Created");
      setNewITR({ panNumber: "", itrPassword: "", brokerId: "" });
      setShowAddForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create ITR");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex flex-col items-center justify-center py-32">
    <MdRefresh style={{ color: "oklch(0.511 0.262 276.966)" }} size={32} className="animate-spin mb-4 opacity-80" />
    <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Loading ITR...</span>
  </div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">ITR FILINGS</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${showAddForm ? "bg-slate-100 text-slate-500" : "bg-indigo-600 text-white shadow-lg"
            }`}
        >
          {showAddForm ? <><MdClose /> Cancel</> : <><MdAdd /> Add ITR</>}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border-2 border-indigo-50 rounded-2xl p-6 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="PAN Number"
              name="panNumber"
              placeholder="ABCDE1234F"
              value={newITR.panNumber}
              onChange={handleChange}
              error={errors.panNumber} // Pass error to Input component
            />
            <Input
              label="ITR Password"
              name="itrPassword"
              placeholder="Portal Password"
              value={newITR.itrPassword}
              onChange={handleChange}
              error={errors.itrPassword} // Pass error to Input component
            />
          </div>
          <select
            value={newITR.brokerId}
            onChange={(e) => setNewITR({ ...newITR, brokerId: e.target.value })}
            className="w-full border rounded-xl p-3 text-sm bg-slate-50 font-bold outline-none ring-indigo-500 focus:ring-2"
          >
            <option value="">Assign Agent (Optional)</option>
            {brokers.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
          <button
            disabled={isSubmitting}
            onClick={handleAdd}
            className="cursor-pointer w-full bg-emerald-600 disabled:bg-emerald-300 text-white py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
          >
            {isSubmitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : null}
            {isSubmitting ? "Securing Data..." : "Save ITR Details"}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {itrs.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
              <MdReceiptLong size={32} />
            </div>
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-widest text-slate-500">
                No ITR Records
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">
                This customer hasn't filed any ITR yet
              </p>
            </div>
          </div>
        ) : (
          itrs.map((itr) => (
            <ITRCard key={itr._id} itr={itr} brokers={brokers} onRefresh={fetchAll} />
          ))
        )}
      </div>
    </div>
  );
}

/* ================= ITR CARD ================= */

const ITRCard = ({ itr, brokers, onRefresh }) => {
  const [showSensitive, setShowSensitive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const [docLabelError, setDocLabelError] = useState("");



  const [form, setForm] = useState({
    panNumber: itr.panEncrypted || "",
    itrPassword: itr.itrPassword || "",
    brokerId: itr.brokerId?._id || ""
  });

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };



  // Centralized Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Auto-uppercase PAN Number
    let finalValue = name === "panNumber" ? value.toUpperCase() : value;

    setForm({ ...form, [name]: finalValue });

    // Clear error when user starts typing in that field again
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validation Logic
  const validate = () => {
    const errs = {};
    if (!form.panNumber) {
      errs.panNumber = "PAN Number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber.toUpperCase())) {
      errs.panNumber = "Invalid PAN format (e.g. ABCDE1234F)";
    }

    if (!form.itrPassword) {
      errs.itrPassword = "Password is required";
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
      await updateITR(itr._id, form);
      toast.success("ITR record updated");
      setIsEditing(false);
      onRefresh();
    } catch {
      toast.error("Update failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsProcessing(true);
      await deleteITR(itr._id);
      toast.success("Vault record deleted");
      onRefresh();
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsProcessing(false);
      setShowDeleteModal(false);
    }
  };

  const handleDocDelete = async () => {
    try {
      setIsProcessing(true);
      await deleteDocument(itr._id, docToDelete.id);
      toast.success("Document removed");
      setDocToDelete(null);
      onRefresh();
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsProcessing(false);
    }
  };

  /* DOCUMENT HANDLING */
  const [docLabel, setDocLabel] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    if (!docLabel.trim()) return setDocLabelError("Please Enter Document Name");
    try {
      setUploading(true);
      const res = await uploadFile(file);
      await addDocument(itr._id, {
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

    const handleDownload = async (url, filename) => {
    try {
      // 1. Fetch the data from the URL
      const response = await fetch(url);

      // 2. Convert it into a blob (binary data)
      const blob = await response.blob();

      // 3. Create a local URL for that blob
      const blobUrl = window.URL.createObjectURL(blob);

      // 4. Create the hidden link and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename; // This now works because the URL is local

      document.body.appendChild(link);
      link.click();

      // 5. Cleanup: remove link and revoke the blob URL to save memory
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: Open in new tab if fetch fails (e.g., CORS issues)
      window.open(url, "_blank");
    }
  }

  return (
    <>
      <ConfirmModal
        open={showDeleteModal}
        loading={isProcessing}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete the ITR record for PAN ending in ${itr.panLast4}?`}
      />

      <ConfirmModal
        open={!!docToDelete}
        loading={isProcessing}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleDocDelete}
        message={`Permanently delete document "${docToDelete?.label}"?`}
      />

      <div className={`bg-white border rounded-3xl p-5 relative overflow-hidden transition-all ${isProcessing ? 'opacity-70 pointer-events-none' : 'hover:shadow-md'}`}>

        {isProcessing && !showDeleteModal && !docToDelete && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          {/* Left Section */}
          <div className="flex items-start gap-4 min-w-0">
            <div
              className={`p-3 rounded-2xl transition-all shrink-0 ${showSensitive
                ? "bg-amber-50 text-amber-600 shadow-inner"
                : "bg-slate-50 text-slate-400"
                }`}
            >
              <MdLock size={24} />
            </div>

            <div className="space-y-1 min-w-0">
              {/* PAN Row */}
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-mono font-black text-slate-900 tracking-wider truncate">
                  {showSensitive ? itr.panEncrypted : `••••••${itr.panLast4}`}
                </h4>

                <button
                  onClick={() => setShowSensitive(!showSensitive)}
                  className="cursor-pointer p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                >
                  {showSensitive ? (
                    <MdVisibilityOff size={18} />
                  ) : (
                    <MdVisibility size={18} />
                  )}
                </button>

                {showSensitive && (
                  <button
                    onClick={() => copyToClipboard(itr.panEncrypted, "PAN")}
                    className="cursor-pointer p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <MdContentCopy size={16} />
                  </button>
                )}
              </div>

              {/* Password Row */}
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-tight">
                <span className="text-slate-400">Password:</span>
                <span
                  className={
                    showSensitive ? "text-slate-700 break-all" : "text-slate-200"
                  }
                >
                  {showSensitive ? itr.itrPassword : "••••••••"}
                </span>

                {showSensitive && (
                  <button
                    onClick={() =>
                      copyToClipboard(itr.itrPassword, "Password")
                    }
                    className="cursor-pointer text-slate-400 hover:text-indigo-500 transition-colors"
                  >
                    <MdContentCopy size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="text-left sm:text-right shrink-0">
            <p className="text-[9px] font-black text-slate-300 uppercase">
              Created on
            </p>
            <p className="text-[10px] font-bold text-slate-500">
              {new Date(itr?.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </p>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Agent: {itr.brokerId?.name || "Self"}
            </span>
          </div>
        </div>


        {isEditing ? (
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl space-y-3 animate-in zoom-in-95">
            <Input
              label="PAN Number"
              name="panNumber"
              placeholder="ABCDE1234F"
              value={form.panNumber}
              onChange={handleChange}
              error={errors.panNumber} // Pass error to Input component
            />
            <Input
              label="ITR Password"
              name="itrPassword"
              placeholder="Portal Password"
              value={form.itrPassword}
              onChange={handleChange}
              error={errors.itrPassword} // Pass error to Input component
            />
            <select
              value={form.brokerId}
              onChange={(e) => setForm({ ...form, brokerId: e.target.value })}
              className="w-full border rounded-xl p-2.5 text-sm bg-white font-bold"
            >
              <option value="">Select Agent</option>
              {brokers.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={handleUpdate} className="cursor-pointer flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold">Update</button>
              <button onClick={() => setIsEditing(false)} className="cursor-pointer flex-1 bg-white border text-slate-400 py-2 rounded-xl text-xs font-bold">Cancel</button>
            </div>
          </div>
        ) :

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
                  {itr?.documents?.length || 0}
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

            {itr.documents?.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itr.documents?.map((doc) => (
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

                  <div className="py-3 px-1 relative group/label max-w-full">
                    {/* 1. The Pro Tooltip Container */}
                    <div className="
                        absolute bottom-full left-0 mb-3 
                        opacity-0 group-hover/label:opacity-100 
                        translate-y-2 group-hover/label:translate-y-0
                        pointer-events-none transition-all duration-300 ease-out 
                        z-50"
                    >
                      {/* Tooltip Bubble */}
                      <div className="
                          bg-slate-900/95 backdrop-blur-md text-white 
                          text-[11px] font-medium px-3 py-1.5 
                          rounded-lg shadow-2xl border border-white/10
                          whitespace-nowrap flex items-center gap-2"
                      >
                        <MdInfoOutline size={14} className="text-indigo-400" />
                        {doc.label}

                        {/* Decorative Pointer/Arrow */}
                        <div className="absolute top-[98%] left-4 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-white/5" />
                      </div>
                    </div>

                    {/* 2. The Truncated Text with Visual Cue */}
                    <div className="flex items-center gap-1 overflow-hidden">
                      <p className="text-[13px] font-bold text-slate-800 truncate cursor-default select-none">
                        {doc.label}
                      </p>

                      {/* Small visual cue (only visible if you want to hint that more text exists) */}
                      {doc.label.length > 20 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 shrink-0" title="Full name available" />
                      )}
                    </div>
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
                      onClick={() => {handleDownload(doc.url,doc.label) }}
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