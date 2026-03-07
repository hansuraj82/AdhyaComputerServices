import { useEffect, useState } from "react";
import { getAuditLogsApi } from "../../services/audit.service";
import AuditTable from "./AuditTable";
import Pagination from "../../components/customers/Pagination";
import { MdOutlineHistory, MdRefresh } from "react-icons/md";

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getAuditLogsApi({ page });
      setLogs(res.data.logs || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            System <span className="text-indigo-600">Audit</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">
            Real-time security & activity tracking
          </p>
        </div>
        
        <button 
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center cursor-pointer gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
        >
          <MdRefresh size={18} className={loading ? "animate-spin" : ""} />
          Refresh Feed
        </button>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {loading ? (
          <AuditSkeleton />
        ) : (
          <AuditTable logs={logs} />
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && logs.length > 0 && (
        <div className="mt-10 border-t border-slate-100 pt-8">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

/**
 * 1. SKELETON LOADER
 * Matches the 12-column grid layout of the AuditTable rows
 */
function AuditSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Fake Header */}
      <div className="grid grid-cols-12 px-8 py-4 bg-slate-50 rounded-2xl mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-2 bg-slate-200 rounded ${i === 3 ? 'col-span-5' : 'col-span-2'}`} />
        ))}
      </div>
      
      {/* Fake Rows */}
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="grid grid-cols-12 items-center px-8 py-6 bg-white border border-slate-100 rounded-2xl">
          <div className="col-span-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
          <div className="col-span-2">
            <div className="h-5 w-16 bg-slate-100 rounded-md" />
          </div>
          <div className="col-span-5">
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
          <div className="col-span-2">
            <div className="h-3 w-16 bg-slate-100 rounded ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}