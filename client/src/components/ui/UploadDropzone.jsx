import { useState, useRef } from "react";
import { MdOutlineCloudUpload, MdOutlineFilePresent, MdOutlineErrorOutline } from "react-icons/md";

export default function UploadDropzone({ onFileSelect, uploading }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null); // 🔹 Better than getElementById

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!uploading) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (uploading) return;

    const file = e.dataTransfer.files[0];
    if (file) validateAndSelect(file);
  };

  const validateAndSelect = (file) => {
    // Optional: Pre-validation logic can go here
    onFileSelect(file);
  };

  const handleClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative overflow-hidden border-2 border-dashed rounded-[2rem] p-10 
        text-center transition-all duration-300 group
        ${uploading ? "opacity-60 cursor-not-allowed bg-slate-50 border-slate-200" : ""}
        ${!uploading && isDragging
          ? "border-indigo-500 bg-indigo-50/50 scale-[1.02] shadow-xl shadow-indigo-100"
          : "border-slate-200 hover:border-slate-400 hover:bg-slate-50 cursor-pointer"
        }
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
    >
      {/* 🔹 Background Visual Hint */}
      <div className={`absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none transition-transform duration-500 ${isDragging ? 'scale-150' : 'scale-100'}`}>
        <MdOutlineCloudUpload size={200} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* 🔹 Dynamic Icon */}
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
          ${isDragging ? "bg-indigo-600 text-white rotate-12" : "bg-slate-900 text-white"}
          shadow-lg shadow-slate-200
        `}>
          {uploading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <MdOutlineCloudUpload size={32} />
          )}
        </div>

        <h3 className="text-slate-900 font-bold tracking-tight">
          {uploading ? "Uploading Resource..." : "Secure File Drop"}
        </h3>

        <p className="text-[13px] text-slate-500 font-medium mt-1">
          Drag & drop or <span className="text-indigo-600 font-bold">browse</span> your files
        </p>

        {/* 🔹 Professional Specification Badge */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Badge text="JPG, PNG, PDF" />
          <Badge text="Max 10MB" />
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef} // 🔹 Ref used here
        className="hidden"
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) validateAndSelect(file);
          e.target.value = null;
        }}
        disabled={uploading}
      />
    </div>
  );
}

const Badge = ({ text }) => (
  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
    {text}
  </span>
);