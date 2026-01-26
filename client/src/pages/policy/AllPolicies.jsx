import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { MdOutlineArrowForward, MdPhone, MdShield, MdOutlinePolicy } from "react-icons/md";
import toast from "react-hot-toast";
import { getAllPolicies } from "../../services/policy.service";
import Pagination from "../../components/customers/Pagination";

export default function PolicyVault() {
    const [policies, setPolicies] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Local state for filters
    const [filters, setFilters] = useState({
        page: 1,
        status: "", // "active" | "expiring" | "expired"
        archived: "false",
        limit: 20
    });

    const fetchPolicies = useCallback(async () => {
        try {
            setLoading(true);
            // This sends ?page=X&status=X&archived=X to your backend
            const { data } = await getAllPolicies(filters);
            setPolicies(data.policies);
            setPagination(data.pagination);
        } catch (err) {
            toast.error("Failed to sync with vault");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies]);

    const updateFilter = (updates) => {
        setFilters(prev => ({
            ...prev,
            ...updates, // Apply all changes (e.g., status AND archived)
            page: 1     // Always reset pagination
        }));
    };

    return (
        // <div className="p-6 space-y-6">
        //     {/* Header & Tabs */}
        //     <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        //         <div className="space-y-4 w-full">
        //             {/* Title Section */}
        //             <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
        //                 <MdShield className="text-indigo-600" /> Policy Master Vault
        //             </h2>

        //             {/* Filter & Result Row */}
        //             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        //                 {/* Left Side: Filter Tabs */}
        //                 <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-2xl w-fit border border-slate-200/50">
        //                     <FilterTab
        //                         active={filters.status === "" && filters.archived === "false"}
        //                         label="All"
        //                         onClick={() => updateFilter({ status: "", archived: "false" })}
        //                     />
        //                     <FilterTab
        //                         active={filters.status === "active" && filters.archived === "false"}
        //                         label="Active"
        //                         onClick={() => updateFilter({ status: "active", archived: "false" })}
        //                     />
        //                     <FilterTab
        //                         active={filters.status === "expiring" && filters.archived === "false"}
        //                         label="Expiring"
        //                         onClick={() => updateFilter({ status: "expiring", archived: "false" })}
        //                     />
        //                     <FilterTab
        //                         active={filters.status === "expired" && filters.archived === "false"}
        //                         label="Expired"
        //                         onClick={() => updateFilter({ status: "expired", archived: "false" })}
        //                     />
        //                     <FilterTab
        //                         active={filters.archived === "true"}
        //                         label="Archived"
        //                         onClick={() => updateFilter({ status: "", archived: "true" })}
        //                     />
        //                 </div>

        //                 {/* Right Side: Results Count */}
        //                 <div className="flex items-center gap-3  self-end md:self-center bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
        //                     <div className="flex flex-col items-end">
        //                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
        //                             Total Records
        //                         </span>
        //                         <div className="flex items-baseline gap-1">
        //                             <span className="text-xl font-black text-indigo-600 leading-none">
        //                                 {pagination?.totalItems || 0}
        //                             </span>
        //                             <span className="text-[10px] font-bold text-slate-500 lowercase">
        //                                 {pagination?.totalItems > 1 ? "policies" : "Policy"}
        //                             </span>
        //                         </div>
        //                     </div>
        //                     {/* Small decorative pulse to show "Live" data */}
        //                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:block" />
        //                 </div>
        //             </div>
        //         </div>
        //     </div>

        //     {/* Responsive Table */}
        //     <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        //         <div className="overflow-x-auto">
        //             <table className="w-full text-left">
        //                 <thead>
        //                     <tr className="bg-slate-50/50 border-b border-slate-100">
        //                         <th className="p-5 text-[10px] font-black uppercase text-slate-400">Customer</th>
        //                         <th className="p-5 text-[10px] font-black uppercase text-slate-400">Policy No.</th>
        //                         <th className="p-5 text-[10px] font-black uppercase text-slate-400">Status</th>
        //                         <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-right">Action</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody className="divide-y divide-slate-50">
        //                     {loading ? (
        //                         <tr>
        //                             <td colSpan="4" className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">
        //                                 Accessing Encrypted Records...
        //                             </td>
        //                         </tr>
        //                     ) : policies.length === 0 ? (
        //                         /* NO POLICY FOUND STATE */
        //                         <tr>
        //                             <td colSpan="4" className="p-20 text-center">
        //                                 <div className="flex flex-col items-center justify-center space-y-3">
        //                                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
        //                                         <MdOutlinePolicy size={32} />
        //                                     </div>
        //                                     <p className="text-slate-400 font-bold text-sm uppercase tracking-tight">No Policies Found</p>
        //                                     <p className="text-[10px] text-slate-300 font-medium max-w-[200px] mx-auto">
        //                                         There are no insurance records matching your current filter criteria.
        //                                     </p>
        //                                 </div>
        //                             </td>
        //                         </tr>
        //                     ) : (
        //                         policies.map((item) => (
        //                             <tr key={item._id} className="group hover:bg-slate-50/50">
        //                                 <td className="p-5">
        //                                     <p className="font-black text-slate-800 uppercase text-xs">{item.customerId?.name}</p>
        //                                     <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
        //                                         <MdPhone size={12} /> {item.customerId?.mobile}
        //                                     </p>
        //                                 </td>
        //                                 <td className="p-5">
        //                                     <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
        //                                         {item.policyNumber}
        //                                     </span>
        //                                 </td>
        //                                 <td className="p-5">
        //                                     <StatusBadge status={item.status} days={item.daysLeft} />
        //                                 </td>
        //                                 <td className="p-5 text-right">
        //                                     <button
        //                                         onClick={() => navigate(`/customers/${item.customerId?._id}`)}
        //                                         className="cursor-pointer p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"
        //                                     >
        //                                         <MdOutlineArrowForward size={20} />
        //                                     </button>
        //                                 </td>
        //                             </tr>
        //                         ))
        //                     )}
        //                 </tbody>
        //             </table>
        //         </div>

        //         {/* Pagination Section - Only show if there are policies or multiple pages */}
        //         {policies.length > 0 && (
        //             <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
        //                 <Pagination
        //                     page={pagination.page}
        //                     totalPages={pagination.totalPages}
        //                     onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
        //                 />
        //             </div>
        //         )}
        //     </div>
        // </div>




        <div className="p-4 sm:p-6 space-y-6">
            {/* Header & Tabs */}
            <div className="flex flex-col gap-6">
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <MdShield className="text-indigo-600 shrink-0" /> Policy Master Vault
                </h2>

                {/* Filters + Count */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/50 w-full lg:w-auto">
                        <FilterTab
                            active={filters.status === "" && filters.archived === "false"}
                            label="All"
                            onClick={() => updateFilter({ status: "", archived: "false" })}
                        />
                        <FilterTab
                            active={filters.status === "active" && filters.archived === "false"}
                            label="Active"
                            onClick={() => updateFilter({ status: "active", archived: "false" })}
                        />
                        <FilterTab
                            active={filters.status === "expiring" && filters.archived === "false"}
                            label="Expiring"
                            onClick={() => updateFilter({ status: "expiring", archived: "false" })}
                        />
                        <FilterTab
                            active={filters.status === "expired" && filters.archived === "false"}
                            label="Expired"
                            onClick={() => updateFilter({ status: "expired", archived: "false" })}
                        />
                        <FilterTab
                            active={filters.archived === "true"}
                            label="Archived"
                            onClick={() => updateFilter({ status: "", archived: "true" })}
                        />
                    </div>

                    {/* Count */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Total Records
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg sm:text-xl font-black text-indigo-600">
                                    {pagination?.totalItems || 0}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 lowercase">
                                    {pagination?.totalItems > 1 ? "policies" : "policy"}
                                </span>
                            </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:block" />
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[640px] w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-slate-400">
                                    Customer
                                </th>
                                <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-slate-400">
                                    Policy No.
                                </th>
                                <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-slate-400">
                                    Status
                                </th>
                                <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-slate-400 text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="p-12 sm:p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs"
                                    >
                                        Accessing Encrypted Records...
                                    </td>
                                </tr>
                            ) : policies.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-12 sm:p-20 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                                <MdOutlinePolicy size={32} />
                                            </div>
                                            <p className="text-slate-400 font-bold text-sm uppercase">
                                                No Policies Found
                                            </p>
                                            <p className="text-[10px] text-slate-300 font-medium max-w-[240px]">
                                                There are no insurance records matching your current filter
                                                criteria.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                policies.map((item) => (
                                    <tr
                                        key={item._id}
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="p-4 sm:p-5">
                                            <p className="font-black text-slate-800 uppercase text-xs truncate">
                                                {item.customerId?.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                                                <MdPhone size={12} /> {item.customerId?.mobile}
                                            </p>
                                        </td>

                                        <td className="p-4 sm:p-5">
                                            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                                                {item.policyNumber}
                                            </span>
                                        </td>

                                        <td className="p-4 sm:p-5">
                                            <StatusBadge
                                                status={item.status}
                                                days={item.daysLeft}
                                            />
                                        </td>

                                        <td className="p-4 sm:p-5 text-right">
                                            <button
                                                onClick={() =>
                                                    navigate(`/customers/${item.customerId?._id}`)
                                                }
                                                className="cursor-pointer p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"
                                            >
                                                <MdOutlineArrowForward size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {policies.length > 0 && (
                    <div className="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-100">
                        <Pagination
                            page={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={(p) =>
                                setFilters((prev) => ({ ...prev, page: p }))
                            }
                        />
                    </div>
                )}
            </div>
        </div>

    );
}

/* UI Helper: Filter Tab */
const FilterTab = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-xl text-[11px] cursor-pointer font-black uppercase transition-all ${active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
    >
        {label}
    </button>
);

/* UI Helper: Status Badge */
const StatusBadge = ({ status, days }) => {
    // Config for colors
    const styles = {
        ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-100",
        EXPIRING: "bg-amber-50 text-amber-600 border-amber-100",
        EXPIRED: "bg-rose-50 text-rose-600 border-rose-100",
        ARCHIVED: "bg-slate-100 text-slate-400 border-slate-200"
    };

    let label = "";

    // 1. Handle Archived
    if (status === "ARCHIVED") {
        label = "Archived";
    }
    // 2. Handle Today (days is 0)
    else if (days === 0 && status !== "EXPIRED") {
        label = "Expiring Today";
    }
    // 3. Handle Expired (days is 0 or less)
    else if (status === "EXPIRED") {
        // Math.abs handles negative numbers just in case
        label = `Expired ${Math.abs(days)}d ago`;
    }
    // 4. Handle Expiring Soon
    else if (status === "EXPIRING") {
        label = `Expiring in ${days}d`;
    }
    // 5. Default Active
    else {
        label = "Active";
    }

    return (
        <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase inline-flex items-center gap-1.5 ${styles[status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-current ${days === 0 ? 'animate-ping' : ''}`} />
            {label}
        </div>
    );
};