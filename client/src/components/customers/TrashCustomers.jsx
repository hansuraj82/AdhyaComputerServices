import { useEffect, useState } from "react";
import { MdOutlineAutoDelete, MdRestorePage, MdDeleteForever, MdOutlineClose, MdChecklist } from "react-icons/md";
import TrashRow from "./TrashRow";
import Pagination from "../../components/customers/Pagination";
import {
  getTrashCustomers,
  restoreCustomer,
  permanentDeleteCustomer,
  bulkRestoreCustomers,
  bulkPermanentDeleteCustomers,
  searchCustomersApi
} from "../../services/customer.service";
import SearchBar from "./SearchBar";
import toast from "react-hot-toast";
import ConfirmRestoreModal from "../ui/ConfirmRestoreModal";
import ConfirmModal from "../ui/ConfirmModal";

export default function TrashCustomers() {
  document.title = "Trash-Customers | Adhya Computer"
  const [customers, setCustomers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [showPermanentDel, setShowPermanentDel] = useState(false);
  const [permanentDelLoading, setPermanentDelLoading] = useState(false);
  const [permanentDelOneLoading, setPermanentDelOneLoading] = useState(false);
  const [permanentDelId, setPermanentDelId] = useState(null);
  const [restoreOneLoading, setRestoreOneLoading] = useState(false);
  const [restoreId, setRestoreId] = useState(null);



  const LIMIT = 10;

  // 🔹 Fetch trash customers
  const fetchTrashCustomers = async () => {
    setLoading(true);
    try {
      const res = search ? await searchCustomersApi({ ...search, isDeleted: true, page, limit: 10 }) : await getTrashCustomers(page, LIMIT);
      setCustomers(res?.data?.customers);
      setTotalPages(res?.data?.pagination?.totalPages);

    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Server not reachable";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashCustomers();
  }, [page, search]);

  const handleSearch = (type, q) => {
    setPage(1);
    setSearch({ type, q });
  };

  const clearSearch = () => {
    setSearch(null);
    setPage(1);
  };

  // 🔹 Selection logic
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(customers.map((c) => c._id));
  };

  const isAllSelected =
    customers.length > 0 &&
    customers.every((c) => selectedIds.includes(c._id));


  // Unselect all
  const unselectAll = () => {
    setSelectedIds([]);
  };

  const handleRestore = async () => {
    if (!restoreId) return;

    const isLastItemOnPage =
      customers.length === 1 && page > 1;

    try {
      setRestoreOneLoading(true);

      await restoreCustomer(restoreId);

      toast.success("Customer restored successfully");

      if (isLastItemOnPage) {
        setPage((prev) => prev - 1);
      } else {
        await fetchTrashCustomers();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to restore customer"
      );
    } finally {
      setRestoreOneLoading(false);
      setRestoreId(null);
    }
  };

  // 🔹 Single permanent delete
  const handlePermanentDelete = async () => {
    if (!permanentDelId) return;

    const isLastItemOnPage = customers.length === 1 && page > 1;

    try {
      setPermanentDelOneLoading(true);
      await permanentDeleteCustomer(permanentDelId);
      toast.success("Customer Permanently Deleted Successfully");

      if (isLastItemOnPage) {
        setPage((prev) => prev - 1);
      } else {
        await fetchTrashCustomers();
      }
    } catch (err) {
      toast.error(err.message || "Failed to permanently delete customer !");
    } finally {
      setPermanentDelId(null);
      setPermanentDelOneLoading(false);
    }
  };

  // 🔹 Bulk restore
  const handleBulkRestore = async () => {
    if (selectedIds.length === 0) return;

    try {
      setRestoreLoading(true);

      const isLastItemOnPage = customers.length === selectedIds.length && page > 1;

      await bulkRestoreCustomers(selectedIds);

      toast.success(
        `${selectedIds.length} Customer${selectedIds.length > 1 ? "s" : ""
        } restored successfully`
      );

      // 🔑 CRITICAL FIX
      if (isLastItemOnPage) {
        setPage((prev) => prev - 1);
      } else {
        await fetchTrashCustomers();
      }

      setSelectedIds([]);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Bulk restore failed"
      );
    } finally {
      setRestoreLoading(false);
      setShowRestoreModal(false);
    }
  };


  // 🔹 Bulk permanent delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setPermanentDelLoading(true);

      const isLastItemOnPage = customers.length === selectedIds.length && page > 1;

      await bulkPermanentDeleteCustomers(selectedIds);
      toast.success(`${selectedIds.length} Customer${selectedIds.length > 1 ? "s" : ""} Permanently Deleted Successfully`);

      if (isLastItemOnPage) {
        setPage((prev) => prev - 1);
      } else {
        await fetchTrashCustomers();
      }
      setSelectedIds([]);

    } catch (err) {
      toast.error(err.message || "Bulk Delete Failed!");
    }
    finally {
      setPermanentDelLoading(false);
      setShowPermanentDel(false);
    }
  };


  return (
    <div className="max-w-[1600px] mx-auto space-y-6 relative pb-20">

      {/* 🔹 Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MdOutlineAutoDelete className="text-amber-500" />
            Archive & Trash
          </h1>
          <p className="text-[13px] text-slate-500 font-medium">
            Restore customers or delete them permanently from the system.
          </p>
        </div>
        <div className="w-full lg:w-[450px]">
          <SearchBar onSearch={handleSearch} onClear={clearSearch} />
        </div>
      </div>

      {/* 🔹 Floating Bulk Action Bar (Amber Style) */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
            <div className="bg-amber-500 h-6 w-6 rounded-full flex items-center justify-center text-[12px] font-bold text-slate-900">
              {selectedIds.length}
            </div>
            <span className="text-sm font-medium">Item{selectedIds.length > 1 ? "s" : ""} selected</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRestoreModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <MdRestorePage size={20} /> Restore
            </button>
            <button
              onClick={() => setShowPermanentDel(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <MdDeleteForever size={20} /> Burn
            </button>
            <button onClick={unselectAll} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              <MdOutlineClose size={22} />
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => e.target.checked ? selectAll() : unselectAll()}
              className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">{isAllSelected ? "unselect All" : "Select All"}</span>
          </label>
          <div className="flex items-center gap-2 text-slate-400">
            <MdChecklist size={20} />
            <span className="text-xs font-medium uppercase">{customers.length} Total Records</span>
          </div>
        </div>


        <div className="p-4 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4 opacity-20">🗑️</div>
              <h3 className="text-lg font-bold text-slate-900 italic">The trash is empty</h3>
              <p className="text-slate-400 text-sm mt-1">Good job! No records found in the archive.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {customers.map((c) => (
                <TrashRow
                  key={c._id}
                  customer={c}
                  isSelected={selectedIds.includes(c._id)}
                  onSelect={toggleSelect}
                  onRestore={setRestoreId}
                  onPermanentDelete={setPermanentDelId}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <ConfirmRestoreModal
        open={!!showRestoreModal}
        count={selectedIds.length}
        onConfirm={handleBulkRestore}
        onCancel={() => setShowRestoreModal(false)}
        loading={restoreLoading}
      />
      <ConfirmRestoreModal
        open={!!restoreId}
        count={0}
        onConfirm={handleRestore}
        onCancel={() => setRestoreId(null)}
        loading={restoreOneLoading}
      />

      <ConfirmModal
        open={!!showPermanentDel}
        loading={permanentDelLoading}
        onClose={() => setShowPermanentDel(false)}
        onConfirm={handleBulkDelete}
        message={`Permanently Delete ${selectedIds.length} customer${selectedIds.length > 1 ? "s" : ""}?`}
        trash={false}
      />
      <ConfirmModal
        open={!!permanentDelId}
        loading={permanentDelOneLoading}
        onClose={() => setPermanentDelId(null)}
        onConfirm={handlePermanentDelete}
        message={`Permanently Delete this customer?`}
        trash={false}
      />
    </div>
  );
}