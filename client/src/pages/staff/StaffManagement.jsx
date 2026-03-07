// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { MdPersonAdd, MdDelete, MdBadge, MdPhone, MdFingerprint, MdClose, MdPowerSettingsNew, MdOutlineMailOutline, MdLockOutline } from 'react-icons/md';
// import { getStaffApi, createStaffApi, deleteStaffApi, ToggleStaff } from '../../services/staff.service.js';
// import Input from "../../components/ui/Input";
// import toast from 'react-hot-toast';
// import ConfirmModal from '../../components/ui/ConfirmModal.jsx';

// export default function StaffManagement() {
//     const [staff, setStaff] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [togglingId, setTogglingId] = useState(null); // Local loading for toggle action
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     // Deletion States
//     const [deleteDocId, setDeleteDocId] = useState(null);
//     const [docDelLoading, setDocDelLoading] = useState(false);
//     // Form State
//     const [form, setForm] = useState({ name: '', mobile: '', aadhar: '', email: '', password: '' });
//     const [errors, setErrors] = useState({});

//     useEffect(() => { loadStaff(); }, []);

//     const loadStaff = async () => {
//         setLoading(true);
//         try {
//             const { data } = await getStaffApi();
//             setStaff(data);
//         } catch (err) {
//             toast.error("Could not load staff members");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//         if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }));
//     };

//     const validate = () => {
//         const errs = {};
//         if (!form.name.trim()) errs.name = "Legal name is required";
//         if (!/^\d{10}$/.test(form.mobile)) errs.mobile = "Valid 10-digit mobile required";
//         if (!form.aadhar) errs.aadhar = "Aadhar is required";
//         else if (!/^\d{12}$/.test(form.aadhar)) errs.aadhar = "Aadhar must be 12 digits";
//         if (!form.email.trim()) errs.email = "Email is required";
//         if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Please enter a valid email address";
//         if (!form.password || form.password.length < 6) errs.password = "Password (min 6 chars) required";

//         setErrors(errs);
//         return Object.keys(errs).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validate()) return;
//         setLoading(true);

//         try {
//             await createStaffApi(form);
//             toast.success("New staff member onboarded!");
//             closeModal();
//             loadStaff();
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Operation failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleToggleStatus = async (id) => {
//         setTogglingId(id);
//         try {
//             await ToggleStaff(id);
//             setStaff(prev => prev.map(s => s._id === id ? { ...s, isActive: !s.isActive } : s));
//             toast.success("Staff access updated");
//         } catch (err) {
//             toast.error("Status update failed");
//         } finally {
//             setTogglingId(null);
//         }
//     };

//     const handleDelete = async () => {
//         if (!deleteDocId) return;
//         setDocDelLoading(true);
//         try {
//             await deleteStaffApi(deleteDocId);
//             toast.success("Staff member removed successfully");
//             setStaff(prev => prev.filter(item => item._id !== deleteDocId));
//             setDeleteDocId(null); // Close modal on success
//         } catch (err) {
//             toast.error("Error deleting staff");
//         } finally {
//             setDocDelLoading(false);
//         }
//     };

//     const openModal = () => {
//         setForm({ name: '', mobile: '', aadhar: '', email: '', password: '' });
//         setErrors({});
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         if (!togglingId || !loading) {
//             setIsModalOpen(false);
//         }
//     }
//     return (
//         <div className="p-8 max-w-7xl mx-auto">
//             {/* Header */}
//             <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
//                 <div>
//                     <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Team <span className="text-indigo-600">Hub</span></h1>
//                     <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Access Control & Staff Management</p>
//                 </div>
//                 <button onClick={openModal} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-2xl active:scale-95">
//                     <MdPersonAdd size={20} /> Onboard New Staff
//                 </button>
//             </div>

//             {/* Staff List Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 <AnimatePresence>
//                     {staff.map((member) => (
//                         <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={member._id}
//                             className={`bg-white border p-8 rounded-[3rem] shadow-sm transition-all group relative overflow-hidden ${!member.isActive ? 'border-red-100 bg-slate-50/50' : 'border-slate-100 hover:shadow-2xl'}`}
//                         >
//                             <div className="flex justify-between items-start mb-6">
//                                 <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-colors ${member.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-400'}`}>
//                                     <MdBadge size={32} />
//                                 </div>

//                                 {/* Status Toggle */}
//                                 <button
//                                     onClick={() => handleToggleStatus(member._id)}
//                                     disabled={togglingId === member._id}
//                                     className={`p-3 rounded-xl transition-all ${member.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-600 text-white hover:bg-red-700'}`}
//                                 >
//                                     {togglingId === member._id ? (
//                                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                                     ) : (
//                                         <MdPowerSettingsNew size={20} />
//                                     )}
//                                 </button>
//                             </div>

//                             <h3 className={`text-2xl font-black mb-1 ${!member.isActive ? 'text-slate-400' : 'text-slate-800'}`}>{member.name}</h3>
//                             <p className={`text-[10px] font-black uppercase tracking-widest mb-6 ${member.isActive ? 'text-emerald-500' : 'text-red-400'}`}>
//                                 {member.isActive ? '● Active Access' : '○ Access Revoked'}
//                             </p>

//                             <div className="space-y-3 mb-8">
//                                 <div className="flex items-center gap-3 text-slate-400 font-bold text-sm italic"><MdPhone className="text-indigo-500" /> {member.mobile}</div>
//                                 <div className="flex items-center gap-3 text-slate-400 font-bold text-sm italic"><MdFingerprint className="text-purple-500" /> {member.aadhar}</div>
//                             </div>

//                             <button onClick={() => setDeleteDocId(member._id)} className="w-full bg-slate-100 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2">
//                                 <MdDelete size={14} /> Remove Permanently
//                             </button>
//                         </motion.div>
//                     ))}
//                 </AnimatePresence>
//             </div>

//             {/* Onboarding Modal */}
//             <AnimatePresence>
//                 {isModalOpen && (
//                     <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
//                         <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100 }} className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
//                             <button onClick={closeModal} className="absolute top-10 right-10 text-slate-300 hover:text-slate-600"><MdClose size={28} /></button>
//                             <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Register Staff</h2>
//                             <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-10 italic">Account Setup & Security</p>

//                             <form onSubmit={handleSubmit} className="space-y-6">
//                                 <Input label="Full Legal Name" name="name" placeholder="Staff Member Name" value={form.name} onChange={handleChange} error={errors.name} />

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <Input label="Mobile Number" name="mobile" placeholder="10-digit mobile" value={form.mobile} onChange={handleChange} error={errors.mobile} />
//                                     <Input label="Aadhar Number" name="aadhar" placeholder="12-digit UID" value={form.aadhar} onChange={handleChange} error={errors.aadhar} />
//                                 </div>

//                                 <Input label="Email Address" name="email" type="text" placeholder="staff@adhya.com" value={form.email} onChange={handleChange} error={errors.email} />

//                                 <div className="relative">
//                                     <Input label="Login Password" name="password" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={handleChange} error={errors.password} />
//                                     <MdLockOutline className="absolute right-6 top-[54px] text-slate-300" size={20} />
//                                 </div>

//                                 <button disabled={loading} className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all mt-4">
//                                     {loading ? 'Initializing...' : 'Initialize Staff member'}
//                                 </button>
//                             </form>
//                         </motion.div>
//                     </div>
//                 )}
//             </AnimatePresence>
//             <ConfirmModal
//                 open={!!deleteDocId}
//                 onClose={() => !docDelLoading && setDeleteDocId(null)}
//                 loading={docDelLoading}
//                 onConfirm={handleDelete}
//                 title="Remove Staff Member"
//                 message="Are you sure you want to permanently remove this staff member? This action cannot be undone."
//                 variant="danger"
//             />
//         </div>
//     );
// }








import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdPersonAdd, MdVerifiedUser, MdDelete, MdBadge, MdPhone, MdFingerprint, MdClose, MdPowerSettingsNew, MdLockOutline, MdOutlineMailOutline } from 'react-icons/md';
import { getStaffApi, createStaffApi, deleteStaffApi, ToggleStaff } from '../../services/staff.service.js';
import Input from "../../components/ui/Input";
import ConfirmModal from "../../components/ui/ConfirmModal";
import toast from 'react-hot-toast';

export default function StaffManagement() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true); // Initial fetch loading
    const [togglingId, setTogglingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [deleteDocId, setDeleteDocId] = useState(null);
    const [docDelLoading, setDocDelLoading] = useState(false);

    const [form, setForm] = useState({ name: '', mobile: '', aadhar: '', email: '', password: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => { loadStaff(); }, []);

    const loadStaff = async () => {
        try {
            const { data } = await getStaffApi();
            setStaff(data);
        } catch (err) {
            toast.error("Could not load staff members");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Legal name is required";
        if (!/^\d{10}$/.test(form.mobile)) errs.mobile = "Valid 10-digit mobile required";
        if (!/^\d{12}$/.test(form.aadhar)) errs.aadhar = "Aadhar must be 12 digits";
        if (!form.email.trim()) errs.email = "Email is required";
         if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Please enter a valid email address";
        if (!form.password || form.password.length < 6) errs.password = "Password (min 6 chars) required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setFormLoading(true);

        try {
            await createStaffApi(form);
            toast.success("New staff onboarded!");
            setForm({ name: '', mobile: '', aadhar: '', email: '', password: '' }); // Reset but stay open
            setIsModalOpen(false);
            loadStaff();
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        setTogglingId(id); // This disables all buttons for this card
        try {
            await ToggleStaff(id);
            setStaff(prev => prev.map(s => s._id === id ? { ...s, isActive: !s.isActive } : s));
            toast.success("Access status updated");
        } catch (err) {
            toast.error("Failed to update status");
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async () => {
        setDocDelLoading(true);
        try {
            await deleteStaffApi(deleteDocId);
            toast.success("Staff member removed");
            setStaff(prev => prev.filter(item => item._id !== deleteDocId));
            setDeleteDocId(null);
        } catch (err) {
            toast.error("Error deleting staff");
        } finally {
            setDocDelLoading(false);
        }
    };

    const closeModal = () => {
        if (formLoading) return;
        setIsModalOpen(false);
        setErrors({})
        setForm({ name: '', mobile: '', aadhar: '', email: '', password: '' });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Team <span className="text-indigo-600">Hub</span></h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Access Control & Staff Management</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white cursor-pointer px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-2xl active:scale-95">
                    <MdPersonAdd size={20} /> Onboard New Staff
                </button>
            </div>

            {/* Staff List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    // Skeleton Loader
                    [1, 2, 3].map((i) => (
                        <div key={i} className="bg-slate-50 border border-slate-100 p-8 rounded-[3rem] animate-pulse">
                            <div className="w-16 h-16 bg-slate-200 rounded-[1.5rem] mb-6" />
                            <div className="h-6 w-3/4 bg-slate-200 rounded mb-4" />
                            <div className="h-4 w-1/2 bg-slate-200 rounded mb-8" />
                            <div className="space-y-3">
                                <div className="h-4 w-full bg-slate-200 rounded" />
                                <div className="h-4 w-full bg-slate-200 rounded" />
                            </div>
                        </div>
                    ))
                ) : staff.length > 0 ? (
                    <AnimatePresence>
                        {staff.map((member) => (
                            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={member._id}
                                className={`bg-white border p-8 rounded-[3rem] shadow-sm transition-all group relative overflow-hidden ${!member.isActive ? 'border-red-100 bg-slate-50/50' : 'border-slate-100 hover:shadow-2xl'}`}
                            >
                                <div className="flex justify-between items-center mb-8">
                                    {/* Avatar/Badge Container */}
                                    <div className="relative">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner ${member.isActive
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            <MdBadge size={32} />
                                        </div>
                                        {/* Small pulse indicator for active staff */}
                                        {member.isActive && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Toggle Pill Section */}
                                    <button
                                        onClick={() => handleToggleStatus(member._id)}
                                        disabled={togglingId !== null}
                                        className={`group relative flex items-center gap-2 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${member.isActive
                                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
                                            : 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100'
                                            } ${togglingId !== null ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        {togglingId === member._id ? (
                                            <>
                                                <div className={`w-3 h-3 border-2 rounded-full animate-spin ${member.isActive ? 'border-emerald-200 border-t-emerald-600' : 'border-red-200 border-t-red-600'}`} />
                                                <span>Processing</span>
                                            </>
                                        ) : (
                                            <>
                                                <MdPowerSettingsNew size={16} className={member.isActive ? 'text-emerald-500' : 'text-red-500'} />
                                                <span>{member.isActive ? 'Active' : 'Disabled'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`text-2xl font-black truncate tracking-tighter ${!member.isActive ? 'text-slate-400 italic' : 'text-slate-900'
                                            }`}>
                                            {member.name}
                                        </h3>

                                        {/* Subtle verification/status badge next to name */}
                                        {member.isActive && (
                                            <MdVerifiedUser className="text-indigo-500 shrink-0" size={18} title="Verified Active" />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${member.isActive ? 'bg-emerald-500' : 'bg-red-400'
                                            }`} />
                                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${member.isActive ? 'text-emerald-600' : 'text-red-400'
                                            }`}>
                                            {member.isActive ? 'System Access Granted' : 'Access Revoked'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-slate-400 font-bold text-xs italic truncate"><MdOutlineMailOutline className="text-slate-400" /> {member.email}</div>
                                    <div className="flex items-center gap-3 text-slate-400 font-bold text-xs italic"><MdPhone className="text-indigo-500" /> {member.mobile}</div>
                                    <div className="flex items-center gap-3 text-slate-400 font-bold text-xs italic"><MdFingerprint className="text-purple-500" /> {member.aadhar}</div>
                                </div>

                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="col-span-full border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center bg-slate-50/30">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <MdBadge size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">No staff members yet</h2>
                        <p className="text-slate-500 text-sm mb-8">Click the button below to add your first staff member to the system.</p>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            <MdPersonAdd size={18} />
                            Add Staff Member
                        </button>
                    </div>
                )}

            </div>

            {/* Onboarding Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100 }} className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
                            <button onClick={closeModal} className="absolute top-10 cursor-pointer right-10 text-slate-300 hover:text-slate-600"><MdClose size={28} /></button>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 ">Register Staff</h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-10 italic">Form stays open for bulk entry</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input label="Full Legal Name" name="name" placeholder="Staff Name" value={form.name} onChange={handleChange} error={errors.name} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Mobile" name="mobile" placeholder="10-digit" value={form.mobile} onChange={handleChange} error={errors.mobile} />
                                    <Input label="Aadhar" name="aadhar" placeholder="12-digit UID" type="text" value={form.aadhar} onChange={handleChange} error={errors.aadhar} />
                                </div>
                                <Input label="Email Address" name="email" type="text" placeholder="staff@adhya.com" value={form.email} onChange={handleChange} error={errors.email} />
                                <div className="relative">
                                    <Input label="Login Password" name="password" type="password" placeholder="Min 6 chars" value={form.password} onChange={handleChange} error={errors.password} />
                                    <MdLockOutline className="absolute right-6 top-[54px] text-slate-300" size={20} />
                                </div>
                                <button disabled={formLoading} className="w-full bg-indigo-600 cursor-pointer text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all">
                                    {formLoading ? 'Registring...' : 'Register Staff member'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmModal
                open={!!deleteDocId}
                onClose={() => !docDelLoading && setDeleteDocId(null)}
                loading={docDelLoading}
                onConfirm={handleDelete}
                title="Remove Staff Member"
                message="Are you sure you want to permanently remove this staff member? This action cannot be undone."
                variant="danger"
            />
        </div>
    );
}