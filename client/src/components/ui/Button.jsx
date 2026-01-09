export default function Button({ loading, children, className = "", ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        relative flex items-center justify-center gap-2 
        w-full h-10 px-4 py-2 
        bg-slate-900 text-white text-sm font-semibold
        rounded-lg transition-all duration-200
        
        /* Interaction States */
        hover:bg-slate-800 active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2
        
        /* Disabled & Loading States */
        disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100
        
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="opacity-90">Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}