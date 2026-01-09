export default function Input({ label, error, className = "", id, ...props }) {
  const isInvalid = Boolean(error);

  return (
    <div className="w-full flex flex-col gap-1.5 group">
      {/* Label Row */}
      <div className="flex justify-between items-center px-0.5 min-h-[1.25rem]">
        {label && (
          <label
            htmlFor={id}
            className="text-[13px] font-semibold text-slate-700 group-focus-within:text-slate-900 transition-colors antialiased"
          >
            {label}
          </label>
        )}

        {error && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 animate-in fade-in slide-in-from-right-1">
            {error}
          </span>
        )}
      </div>

      {/* Input Field Wrapper for better control */}
      <div className="relative">
        <input
          id={id}
          {...props}
          className={`
            appearance-none w-full h-10 rounded-lg border px-3.5 text-sm
            transition-all duration-200 ease-in-out
            placeholder:text-slate-400/80
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            
            /* Enhanced Focus Logic */
            outline-none focus:ring-[3px]
            
            ${isInvalid
              ? "border-red-500 ring-red-500/10"
              : "border-slate-200 focus:border-slate-400 ring-slate-950/5"
            }
            
            ${className}
          `}
        />
      </div>
    </div>
  );
}