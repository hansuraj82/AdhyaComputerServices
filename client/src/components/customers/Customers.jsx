import { useEffect, useState } from "react";
import {
    getCustomersApi,
    searchCustomersApi,
    softDeleteCustomer,
    bulkSoftDeleteCustomers
} from "../../services/customer.service";
import SearchBar from "../../components/customers/SearchBar";
import CustomerTable from "../../components/customers/CustomerTable";
import Pagination from "../../components/customers/Pagination";
import toast from "react-hot-toast";
import ConfirmModal from "../ui/ConfirmModal";

export default function Customers() {
    document.title = "Home | Adhya Computer"
    const [customers, setCustomers] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(null);
    const [trashId, setTrashId] = useState(null);
    const [bulkTrashId, setBulkTrashId] = useState(null);
    const [trashLoading, setTrashLoading] = useState(false);
    const [bulkTrashLoading, setBulkTrashLoading] = useState(false);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            setSelectedIds([]);
            const res = search
                ? await searchCustomersApi({ ...search, isDeleted: false, page, limit: 10 })
                : await getCustomersApi({ page, limit: 10 });

            setCustomers(res.data.customers);
            setTotalPages(res.data.pagination.totalPages);

        } catch (err) {
            toast.error(err.message || "Failed To Load Customers");
        }

        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [page, search]);

    const handleSearch = (type, q) => {
        setPage(1);
        setSearch({ type, q });
    };

    const clearSearch = () => {
        setSearch(null);
        setPage(1);
    };

    // 🔹 Selection
    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    // Select all rows on current page
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

    // 🔹 Single trash
    const handleTrash = async () => {
        if (!trashId) return;
        try {
            const isLastItemOnPage = customers.length === 1 && page > 1;
            setTrashLoading(true);
            await softDeleteCustomer(trashId);
            toast.success("Customer Deleted Successfully");

            if (isLastItemOnPage) {
                setPage((prev) => prev - 1);
            } else {
                await fetchCustomers();
            }
        } catch (error) {
            toast.error(error.message || "something went wrong while Deleting")
        } finally {
            setTrashLoading(false);
            setTrashId(null);
        }

    };

    // 🔹 Bulk trash
    const handleBulkTrash = async () => {
        if (selectedIds.length === 0) return;
        try {
            const isLastItemOnPage = customers.length === selectedIds.length && page > 1;
            setBulkTrashLoading(true);
            await bulkSoftDeleteCustomers(selectedIds);
            toast.success(`${selectedIds.length} Customer${selectedIds.length > 1 ? "s" : ""} Deleted Successfully`);
            setBulkTrashId(null);
            if (isLastItemOnPage) {
                setPage((prev) => prev - 1);
            } else {
                await fetchCustomers();
            }
        } catch (error) {
            toast.error(error.message || "something went wrong while Deleting")
        } finally {
            setBulkTrashLoading(false);
        }


    };

    const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

    return (
        <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                {/* Left Side: Title & Description */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Customer Directory
                    </h1>
                    <p className="text-[13px] text-slate-500 font-medium">
                        Manage your CyberCafe clients and their records.
                    </p>
                </div>

                {/* Right Side: The Search Wrapper */}
                <div className="w-full lg:w-[450px]">
                    {/* We wrap it in a div to ensure the SearchBar doesn't stretch vertically */}
                    <SearchBar
                        onSearch={handleSearch}
                        onClear={clearSearch}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    /* Refined Loading State */
                    <div className="flex flex-col items-center justify-center py-24 bg-slate-50/30">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-slate-200 rounded-full" />
                            <div className="absolute top-0 w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="text-sm font-semibold text-slate-600 mt-4 tracking-wide">
                            Optimizing Directory...
                        </p>
                    </div>
                ) : customers.length === 0 ? (
                    /* "Extraordinary" Empty State */
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-4xl">📂</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No Customers Found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm">
                            {search
                                ? "No results match your search criteria. Try a different term."
                                : "Your customer list is currently empty. Add your first customer to get started."}
                        </p>
                        {search && (
                            <button
                                onClick={clearSearch}
                                className="mt-6 text-sm font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Table Component */}
                        <CustomerTable
                            customers={customers}
                            selectedIds={selectedIds}
                            onSelect={toggleSelect}
                            onSelectAll={selectAll}
                            onUnselectAll={unselectAll}
                            isAllSelected={isAllSelected}
                            isSomeSelected={isSomeSelected}
                            selectedCount={selectedIds.length}
                            setTrashId={setTrashId}
                            // Added this to trigger the Bulk modal from inside Table
                            onBulkTrash={() => setBulkTrashId(selectedIds)}
                        />

                        {/* Pagination Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            <ConfirmModal
                open={!!bulkTrashId}
                loading={bulkTrashLoading}
                onClose={() => setBulkTrashId(null)}
                onConfirm={handleBulkTrash}
                title="Bulk Delete"
                message={`Are you sure you want to move ${selectedIds.length} customers to trash? This action can be undone from the Trash tab.`}
                trash={true}
                variant="danger"
            />

            <ConfirmModal
                open={!!trashId}
                loading={trashLoading}
                onClose={() => setTrashId(null)}
                onConfirm={handleTrash}
                title="Delete Customer"
                message="Moving this customer to trash will restrict their access immediately."
                trash={true}
                variant="danger"
            />
        </div>
    );
}