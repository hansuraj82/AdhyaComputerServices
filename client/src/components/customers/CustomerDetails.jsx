import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { uploadFile } from "../../utils/cloudinaryUpload";
import { deleteDocument, getCustomerById, uploadDocument } from "../../services/customer.service";
import Input from "../ui/Input";
import { PdfPreview } from "../ui/PdfPreview";
import ConfirmModal from "../ui/ConfirmModal";
import UploadDropzone from "../ui/UploadDropzone";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDownload, MdOutlineRemoveRedEye, MdDeleteOutline, MdOutlineBadge, MdOutlinePhone, MdOutlineHome, MdOutlineDescription } from "react-icons/md";

export default function CustomerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteDocId, setDeleteDocId] = useState(null);
    const [docLabel, setDocLabel] = useState("");
    const [error, setError] = useState("");
    document.title = `Customer-Details | Adhya Computer`;

    const fetchCustomer = async () => {
        try {
            setPageLoading(true);
            const res = await getCustomerById(id);
            setCustomer(res.data);
        } catch (err) {
            toast.error(err.message || "Failed to load customer");
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => { fetchCustomer(); }, [id]);

    const handleUpload = async (file) => {
        if (!docLabel.trim()) {
            setError("Document Label is required");
            return;
        }
        setUploading(true);
        try {
            const uploadRes = await uploadFile(file);
            await uploadDocument(id, {
                type: docLabel,
                url: uploadRes.secure_url,
                publicId: uploadRes.public_id,
                resourceType: uploadRes.resource_type,
            });
            setDocLabel("");
            toast.success("Document added to vault");
            await fetchCustomer();
        } catch (err) {
            toast.error(err.message || "Upload failed");
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
    };

    if (pageLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 font-medium">Retrieving Profile Vault...</p>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
            {/* Header / Profile Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                        <span className="text-2xl font-bold">{customer?.name?.charAt(0)}</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
                        <p className="text-sm text-slate-500 flex items-center gap-1 uppercase tracking-wider font-semibold">
                            {new Date(customer.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium' })}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/customers/edit/${id}`)}
                    className="
        group relative flex items-center gap-2 px-5 py-2.5 
        bg-slate-900 text-slate-50 rounded-xl font-bold text-[13px] tracking-wide
        shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.2)]
        hover:bg-slate-800 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 transition-all duration-200 ease-out cursor-pointer"
                >
                    {/* Subtle Icon Glow Effect */}
                    <CiEdit className="text-lg text-slate-300 group-hover:text-white transition-colors" />

                    <span>EDIT PROFILE</span>

                    {/* Optional: Subtle Shine Highlight */}
                    <div className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Info & Upload */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Details Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">General Information</h3>
                        <div className="space-y-4">
                            <InfoRow icon={<MdOutlinePhone />} label="Mobile" value={customer.mobile} />
                            <InfoRow icon={<MdOutlineBadge />} label="Aadhaar" value={customer.aadhar} />
                            <InfoRow icon={<MdOutlineHome />} label="Address" value={customer.address} />
                        </div>
                    </div>

                    {/* Upload Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Add Document</h3>
                        <div className="space-y-4">
                            <Input
                                label="Document Label"
                                placeholder="e.g. Pancard, Passport"
                                value={docLabel}
                                onChange={(e) => { setDocLabel(e.target.value); setError("") }}
                                error={error}
                            />
                            <UploadDropzone uploading={uploading} onFileSelect={handleUpload} />
                        </div>
                        {uploading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center z-10 transition-all">
                                <div className="relative">
                                    {/* Outer Ring */}
                                    <div className="w-12 h-12 border-4 border-indigo-100 rounded-full" />
                                    {/* Spinning Ring */}
                                    <div className="absolute top-0 w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                                <p className="text-sm font-bold text-slate-700 mt-3 animate-pulse">
                                    Encrypting & Uploading...
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Document Grid */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <MdOutlineDescription className="text-indigo-500" />
                                Document Vault ({customer.documents.length})
                            </h3>
                        </div>

                        <div className="p-6">
                            {customer.documents.length === 0 ? (
                                <div className="text-center py-20 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-medium">No documents stored in this vault.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {customer.documents.map((doc) => (
                                        <div key={doc._id} className="group bg-white border border-slate-200 rounded-[1.5rem] p-4 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300">
                                            <div className="flex gap-5">

                                                {/* 🔹 Unified Preview Container */}
                                                <div className="relative w-20 h-20 flex-shrink-0 group/preview">
                                                    {doc.resourceType === "raw" ? (
                                                        <PdfPreview publicId={doc.publicId} />
                                                    ) : (
                                                        <div className="w-full h-full relative overflow-hidden rounded-2xl border border-slate-100">
                                                            <img
                                                                src={doc.url}
                                                                alt={doc.type}
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-110"
                                                            />
                                                            {/* Overlay for consistent UI */}
                                                            <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                                                <MdOutlineRemoveRedEye className="text-white" size={20} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 🔹 Details Section */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between">
                                                            <h4 className="font-black text-slate-900 truncate uppercase text-[13px] tracking-tight">
                                                                {doc.type}
                                                            </h4>
                                                            {/* Status Indicator */}
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                                        </div>

                                                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest flex items-center gap-1">
                                                            <span className="w-3 h-[1px] bg-slate-200" />
                                                            {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>

                                                    {/* 🔹 Action Bar */}
                                                    <div className="flex items-center gap-1 mt-auto pt-3">
                                                        <DocAction
                                                            icon={<MdOutlineRemoveRedEye size={16} />}
                                                            label="View"
                                                            onClick={() => window.open(doc.url, "_blank")}
                                                        />
                                                        <DocAction
                                                            icon={<MdOutlineDownload size={16} />}
                                                            label="Save"
                                                            onClick={() => handleDownload(doc.url, `${customer.name}_${doc.type}`)}
                                                            color="text-emerald-600 hover:bg-emerald-50"
                                                        />
                                                        <DocAction
                                                            icon={<MdDeleteOutline size={16} />}
                                                            label="Delete"
                                                            onClick={() => setDeleteDocId(doc._id)}
                                                            color="text-rose-500 hover:bg-rose-50"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={!!deleteDocId}
                loading={deleteLoading}
                onClose={() => setDeleteDocId(null)}
                onConfirm={async () => {
                    setDeleteLoading(true);
                    await deleteDocument(id, deleteDocId);
                    setDeleteDocId(null);
                    setDeleteLoading(false);
                    await fetchCustomer();
                }}
                title="Destroy Document"
                message="Are you sure you want to permanently remove this document from the cloud vault?"
                variant="danger"
            />
        </div>
    );
}

/* Helper Components */
const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-4">
        <div className="text-lg text-slate-400">{icon}</div>
        <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-semibold text-slate-700">{value || "Not Provided"}</p>
        </div>
    </div>
);

const DocAction = ({ icon, label, onClick, color = "text-slate-500 hover:bg-slate-100" }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase cursor-pointer tracking-tight transition-all active:scale-95 ${color}`}
    >
        {icon}
        <span>{label}</span>
    </button>
);
