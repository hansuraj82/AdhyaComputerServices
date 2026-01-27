import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllITR } from "../../services/itr.service";
import { MdOutlineArrowForward, MdPhone, MdSearch, MdClear, MdAccountBalance } from "react-icons/md";
import toast from "react-hot-toast";
import Pagination from "../../components/customers/Pagination";

export default function ITRVault() {
  document.title = `ITR | Adhya Computer`;
  const navigate = useNavigate();
  const [itrRecords, setItrRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    q: "" // Global search for PAN, Name, or Mobile
  });

  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0
  });

  const fetchITR = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getAllITR(filters);
      // Ensure the key matches your backend res.json({ itrs: ... })
      setItrRecords(data.itrs || []);
      setPagination({
        totalPages: data.pagination?.totalPages || 1,
        totalItems: data.pagination?.totalItems || 0
      });
    } catch (err) {
      toast.error("Failed to sync ITR records");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchITR();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchITR]);

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, q: e.target.value, page: 1 }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4 w-full">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <MdAccountBalance className="text-emerald-600" /> ITR Master Vault
        </h2>

        {/* Search & Results Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Left: Search Bar */}
          <div className="relative w-full md:w-96 group">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" size={20} />
            <input
              type="text"
              placeholder="Search PAN or Customer Name..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              value={filters.q}
              onChange={handleSearchChange}
            />
            {filters.q && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, q: "" }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <MdClear size={18} />
              </button>
            )}
          </div>

          {/* Right: Results Count Box */}
          <div className="flex items-center gap-3 self-end md:self-center bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Total Filings
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-emerald-600 leading-none">
                  {pagination.totalItems}
                </span>
                <span className="text-[10px] font-bold text-slate-500 lowercase">
                  {pagination.totalItems > 1 ? "records" : "record"}
                </span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-[10px] font-black uppercase text-slate-400">Taxpayer Details</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400">PAN Number</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400">AGENT</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400 font-bold">
                      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
                      Loading Tax Records...
                    </div>
                  </td>
                </tr>
              ) : itrRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    No ITR Records Found
                  </td>
                </tr>
              ) : (
                itrRecords.map((item) => (
                  <tr key={item._id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="p-5">
                      <p className="font-black text-slate-800 uppercase text-xs">
                        {item.customerId?.name || "N/A"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                        <MdPhone size={12} className="text-slate-300" /> {item.customerId?.mobile || "N/A"}
                      </p>
                    </td>
                    <td className="p-5">
                      <span className="font-mono text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 tracking-[0.1em]">
                        ******{item.panLast4 || "NOT FOUND"}
                      </span>
                    </td>
                    <td className="p-5">
                      <p className="text-[10px] font-black text-slate-500 uppercase">
                        {item.brokerId?.name || "Self"}
                      </p>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => navigate(`/customers/${item.customerId?._id}`)}
                        className="cursor-pointer p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="View Customer Details"
                      >
                        <MdOutlineArrowForward size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <Pagination
            page={filters.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
          />
        </div>
      </div>
    </div>
  );
}