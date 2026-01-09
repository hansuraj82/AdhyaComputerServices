import { useEffect, useState } from "react";
import { MdSearch, MdOutlineClose } from "react-icons/md";

export default function SearchBar({ onSearch, onClear }) {
  const [type, setType] = useState("name");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.trim() === "") {
      onClear();
      return;
    }

    // Auto-trigger for specific lengths
    if ((type === "aadhar" && query.length === 12) || (type === "mobile" && query.length === 10)) {
      onSearch(type, query);
    }
  }, [query, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(type, query);
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <div className="w-full max-w-2xl mb-6">
      <form
        onSubmit={handleSubmit}
        className="group relative flex items-center bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-200"
      >
        {/* Type Selector - Stylized */}
        <div className="relative border-r border-slate-100 px-1">
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setQuery("");
              onClear();
            }}
            className="appearance-none bg-transparent pl-4 pr-8 py-2.5 text-sm font-semibold text-slate-700 cursor-pointer focus:outline-none antialiased"
          >
            <option value="name">Name</option>
            <option value="mobile">Mobile</option>
            <option value="aadhar">Aadhar</option>
            <option value="address">Address</option>
          </select>
          {/* Custom Chevron for select */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Search Input Icon */}
        <MdSearch className="ml-3 text-xl text-slate-400 group-focus-within:text-indigo-500 transition-colors" />

        {/* Input Field */}
        <input
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          placeholder={`Find customer by ${type}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Clear/Search Actions */}
        <div className="flex items-center gap-1 pr-2">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 cursor-pointer hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all"
            >
              <MdOutlineClose size={18} />
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-1.5 bg-slate-900 cursor-pointer hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all active:scale-95 disabled:opacity-50"
            disabled={!query.trim()}
          >
            Search
          </button>
        </div>
      </form>

      {/* Search hint - Senior UI touch */}
      <p className="mt-2 ml-1 text-[11px] text-slate-400 font-medium italic">
        {type === 'mobile' && "Enter 10 digits for instant search"}
        {type === 'aadhar' && "Enter 12 digits for instant search"}
        {type === 'name' && "Press Enter to search"}
        {type === 'address' && "Press Enter to search"}
      </p>
    </div>
  );
}