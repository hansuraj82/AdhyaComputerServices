import { useCallback, useEffect, useState } from "react";
import Input from "../ui/Input";
import UploadDropzone from "../ui/UploadDropzone";
import { PdfPreview } from "../ui/PdfPreview";
import {
  MdOutlineDownload,
  MdOutlineRemoveRedEye,
  MdDeleteOutline,
  MdOutlineDescription,
  MdRefresh
} from "react-icons/md";
import ConfirmModal from "../ui/ConfirmModal";
import { deleteDocument, getCustomerById, uploadDocument } from "../../services/customer.service";
import toast from "react-hot-toast";
import { uploadFile } from "../../utils/cloudinaryUpload";

export default function CustomerDocuments({ customerId }) {
  // Document & Error states
  const [customer, setCustomer] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docLabel, setDocLabel] = useState("");
  const [error, setError] = useState(""); // 🔹 Added error state back
  const [deleteDocId, setDeleteDocId] = useState(null);
  const [docDelLoading, setDocDelLoading] = useState(false);
  // 🔹 Updated HandleUpload with Inline Error Logic

  const fetchCustomer = useCallback(async () => {
    try {
      setIsProcessing(true);
      const res = await getCustomerById(customerId);
      setCustomer(res.data);
    } catch (err) {
      toast.error(err.message || "something went wrong")
    } finally {
      setTimeout(() => setIsProcessing(false), 80);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) fetchCustomer();
  }, [fetchCustomer]);

  const handleUpload = async (file) => {
    if (!docLabel.trim()) {
      setError("Document label is required"); // 🔹 Set error to show in Input
      return;
    }

    setError(""); // Clear error if validation passes
    setUploading(true);
    try {
      const uploadRes = await uploadFile(file);
      await uploadDocument(customer._id, {
        type: docLabel,
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        resourceType: uploadRes.resource_type
      });
      setDocLabel("");
      toast.success("Document added successfully");
      fetchCustomer();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(blobUrl);
  };
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async () => {
    try {

      setDocDelLoading(true);
      await deleteDocument(customer._id, deleteDocId);
      setDeleteDocId(null);
      setDocDelLoading(false);
      fetchCustomer();
      toast.success("Document deleted");

    } finally {
      setDeletingId(null);
    }
  };



  if (isProcessing || !customer) return (<div className="flex flex-col items-center justify-center py-32">
    <MdRefresh style={{ color: "oklch(0.511 0.262 276.966)" }} size={32} className="animate-spin mb-4 opacity-50" />
    <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Loading Documents...</span>
  </div>)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[420px] sm:min-h-[500px]">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
          <MdOutlineDescription className="text-indigo-500" size={20} />
          Total Documents ({customer?.documents?.length || 0})
        </h3>

        {uploading && (
          <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase">
            <MdRefresh className="animate-spin" /> Uploading...
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <Input
            label="Document Label"
            placeholder="e.g. Pancard"
            value={docLabel}
            onChange={(e) => {
              setDocLabel(e.target.value);
              setError("");
            }}
            error={error}
          />
          <UploadDropzone uploading={uploading} onFileSelect={handleUpload} />
        </div>

        {/* Document List */}
        {!customer?.documents || customer.documents.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">No documents found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {customer.documents.map((doc) => {
              const isDeleting = deletingId === doc._id;

              return (
                <div
                  key={doc._id}
                  className={`group bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 transition-all hover:border-indigo-200 hover:shadow-sm ${isDeleting ? "opacity-50 pointer-events-none" : ""
                    }`}
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Preview */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 overflow-hidden rounded-xl border border-slate-100">
                      {doc.resourceType === "raw" ? (
                        <PdfPreview publicId={doc.publicId} />
                      ) : (
                        <img
                          src={doc.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Content + Actions */}
                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                      {/* Text */}
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-800 uppercase text-[11px] sm:text-[12px] truncate">
                          {doc.type}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {new Date(doc.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5">
                        <DocAction
                          icon={<MdOutlineRemoveRedEye size={14} />}
                          label="View"
                          onClick={() => window.open(doc.url, "_blank")}
                        />
                        <DocAction
                          icon={<MdOutlineDownload size={14} />}
                          label="Save"
                          onClick={() =>
                            handleDownload(
                              doc.url,
                              `${customer.name}_${doc.type}`
                            )
                          }
                          color="text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                        />
                        <DocAction
                          loading={isDeleting}
                          icon={<MdDeleteOutline size={14} />}
                          label={isDeleting ? "" : "Delete"}
                          onClick={() => setDeleteDocId(doc._id)}
                          color="text-rose-500 bg-rose-50 hover:bg-rose-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteDocId}
        onClose={() => !docDelLoading && setDeleteDocId(null)}
        loading={docDelLoading}
        onConfirm={handleDelete}
        title="Delete document"
        message="Are you sure you want to permanently delete this document?"
        variant="danger"
      />
    </div>

  );
}

const DocAction = ({
  icon,
  label,
  onClick,
  loading,
  color = "text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200"
}) => (
  <button
    disabled={loading}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`
      /* Layout & Spacing */
      flex items-center justify-center gap-2 
      px-3 md:px-4 py-1.5 md:py-2 
      rounded-xl border transition-all duration-200
      
      /* Typography */
      text-[10px] md:text-[11px] font-black uppercase tracking-wider whitespace-nowrap
      
      /* States */
      cursor-pointer active:scale-95 shadow-sm hover:shadow-md
      disabled:opacity-50 disabled:cursor-not-allowed
      
      /* Dynamic Colors */
      ${color}
    `}
  >
    {loading ? (
      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
    ) : (
      <span className="opacity-80 group-hover:opacity-100">{icon}</span>
    )}

    {/* Smart Label: Hidden on very small mobile, comfortable size on desktop */}
    <span className="hidden sm:inline">
      {loading ? "Processing..." : label}
    </span>
  </button>
);