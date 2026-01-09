import { useState } from "react";
import { MdOutlinePictureAsPdf, MdOutlineRemoveRedEye } from "react-icons/md";

export function PdfPreview({ publicId }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false); // New state for smooth fade-in
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  // 🔹 Professional Fallback (Used if Image fails OR before image loads)
  const Fallback = (
    <div className="w-16 h-16 flex flex-col items-center justify-center bg-slate-100 border border-slate-200 rounded-xl text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors duration-300">
      <MdOutlinePictureAsPdf size={24} />
      <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">PDF</span>
    </div>
  );

  if (failed) return Fallback;

  const thumbnailUrl = `https://res.cloudinary.com/${cloud}/image/upload/pg_1,w_300,c_fill,g_north,h_300/${publicId}.jpg`;

  return (
    <div className="relative group w-16 h-16 cursor-zoom-in">
      {/* 🔹 Smooth Image Loading & Hover Effect */}
      <img
        src={thumbnailUrl}
        alt="PDF preview"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`
          w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-sm 
          transition-all duration-500 ease-out
          group-hover:scale-110 group-hover:shadow-xl group-hover:border-indigo-200
          ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      />

      {/* 🔹 Glassmorphism "View" Overlay on Hover */}
      <div className="absolute inset-0 bg-indigo-900/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
        <MdOutlineRemoveRedEye className="text-white" size={20} />
      </div>

      {/* 🔹 Mini File-Type Badge (Bottom Right) */}
      <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[8px] font-bold px-1 rounded shadow-sm border border-white">
        PDF
      </div>

      {/* Show fallback while loading to prevent "pop-in" */}
      {!loaded && (
        <div className="absolute inset-0">
          {Fallback}
        </div>
      )}
    </div>
  );
}