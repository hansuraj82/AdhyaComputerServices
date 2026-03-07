import { useEffect, useState, useCallback, useContext } from "react";
import toast from "react-hot-toast";
import {
    getNotesByCustomer,
    addNote,
    updateNote,
    deleteNote
} from "../../services/note.service.js";
import Input from "../ui/Input";
import ConfirmModal from "../ui/ConfirmModal";
import {
    MdEdit,
    MdDeleteOutline,
    MdClose,
    MdAdd,
    MdRefresh,
    MdOutlineNoteAlt,
    MdEventNote,
    MdSave
} from "react-icons/md";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function CustomerNotes({ customerId }) {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newNote, setNewNote] = useState({ title: "", content: "" });
    const [errors, setErrors] = useState({});


    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getNotesByCustomer(customerId);
            setNotes(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load notes");
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        if (customerId) fetchNotes();
    }, [fetchNotes]);

    const validate = (data) => {
        const errs = {};
        if (!data.title.trim()) errs.title = "Title is required";
        if (!data.content.trim()) errs.content = "Content is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleAdd = async () => {
        if (!validate(newNote)) return;
        try {
            setIsSubmitting(true);
            await addNote({ ...newNote, customerId });
            toast.success("Note added successfully");
            setNewNote({ title: "", content: "" });
            setShowAddForm(false);
            fetchNotes();
        } catch (err) {
            toast.error("Failed to add note");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="flex flex-col items-center justify-center py-32">
        <MdRefresh style={{ color: "oklch(0.511 0.262 276.966)" }} size={32} className="animate-spin mb-4 opacity-80" />
        <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Loading Notes...</span>
    </div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">CUSTOMER NOTES</h3>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${showAddForm ? "bg-slate-100 text-slate-500" : "bg-indigo-600 text-white shadow-lg"
                        }`}
                >
                    {showAddForm ? <><MdClose /> Cancel</> : <><MdAdd /> Add Note</>}
                </button>
            </div>

            {showAddForm && (
                <div className="bg-white border-2 border-indigo-50 rounded-2xl p-6 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <Input
                        name="title"
                        label="Note Title"
                        placeholder="e.g., Follow up regarding document"
                        value={newNote.title}
                        onChange={(e) => { setNewNote({ ...newNote, title: e.target.value }); setErrors(prev => ({ ...prev, ["title"]: "" })) }}
                        error={errors.title}
                    />
                    <div className="space-y-1">
                        <div className="flex justify-between items-center px-0.5 min-h-[1.25rem]">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Content</label>
                            {errors.content && <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 animate-in fade-in slide-in-from-right-1">{errors.content}</span>}
                        </div>
                        <textarea
                            name="content"
                            rows="3"
                            className="w-full border rounded-xl p-3 text-sm bg-slate-50 outline-none focus:ring-2 ring-indigo-500 font-medium"
                            placeholder="Write note details here..."
                            value={newNote.content}
                            onChange={(e) => { setNewNote({ ...newNote, content: e.target.value }); setErrors(prev => ({ ...prev, ["content"]: "" })) }}
                        />

                    </div>
                    <button
                        disabled={isSubmitting}
                        onClick={handleAdd}
                        className="w-full bg-emerald-600 disabled:bg-emerald-300 text-white py-3 cursor-pointer rounded-xl font-bold shadow-md transition-all flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : null}
                        {isSubmitting ? "Saving..." : "Save Note"}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.length === 0 ? (
                    <div className="col-span-full py-12 flex flex-col items-center opacity-40">
                        <MdOutlineNoteAlt size={48} />
                        <p className="text-xs font-bold uppercase mt-2">No notes found for this customer</p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <NoteCard key={note._id} note={note} onRefresh={fetchNotes} />
                    ))
                )}
            </div>
        </div>
    );
}

/* ================= NOTE CARD COMPONENT ================= */

const NoteCard = ({ note, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editForm, setEditForm] = useState({ title: note.title, content: note.content });
    const [errors, setErrors] = useState({});
    const { auth } = useContext(AuthContext);

    const validate = (data) => {
        const errs = {};
        if (!data.title.trim()) errs.title = "Title is required";
        if (!data.content.trim()) errs.content = "Content is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleUpdate = async () => {
        if (!validate(editForm)) return;
        try {
            setIsProcessing(true);
            await updateNote(note._id, editForm);
            toast.success("Note updated");
            setIsEditing(false);
            onRefresh();
        } catch {
            toast.error("Failed to update note");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsProcessing(true);
            await deleteNote(note._id);
            toast.success("Note deleted");
            onRefresh();
        } catch {
            toast.error("Delete failed");
        } finally {
            setIsProcessing(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <>
            <ConfirmModal
                open={showDeleteModal}
                loading={isProcessing}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                message="Are you sure you want to delete this note?"
            />

            <div className="bg-white border border-slate-100 rounded-[2rem] p-5 hover:shadow-xl hover:shadow-slate-100 transition-all group relative overflow-hidden">
                {/* Loading Overlay */}
                {isProcessing && !showDeleteModal && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-3xl">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {isEditing ? (
                    <div className="space-y-3 animate-in zoom-in-95">
                        <Input
                            className="w-full font-bold text-slate-800 border-b pb-1 outline-none focus:border-indigo-500"
                            label="Note Title"
                            value={editForm.title}
                            onChange={(e) => { setEditForm({ ...editForm, title: e.target.value }); setErrors(prev => ({ ...prev, ["title"]: "" })) }}
                            error={errors.title}
                        />
                        <div className="space-y-1">
                            <div className="flex justify-between items-center px-0.5 min-h-[1.25rem]">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Content</label>
                                {errors.content && <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 animate-in fade-in slide-in-from-right-1">{errors.content}</span>}
                            </div>
                            <textarea
                                name="content"
                                rows="3"
                                className="w-full border rounded-xl p-3 text-sm bg-slate-50 outline-none focus:ring-2 ring-indigo-500 font-medium"
                                placeholder="Write note details here..."
                                value={editForm.content}
                                onChange={(e) => { setEditForm({ ...editForm, content: e.target.value }); setErrors(prev => ({ ...prev, ["content"]: "" })) }}
                            />

                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleUpdate} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer">
                                <MdSave size={16} /> Save
                            </button>
                            <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 text-slate-500 py-2 rounded-xl text-[10px] font-black uppercase cursor-pointer">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-[300px] relative group overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 p-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-2">

                        {/* EXTRAORDINARY: Background Decorative Blur (Visible on Hover) */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-5 shrink-0 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-transform duration-300">
                                    <MdEventNote size={22} />
                                </div>
                                {/* Added: Pulse dot to show it's a recent or active note */}
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            </div>

                            {auth.role === "owner" && <div className="flex gap-1 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                <button onClick={() => setIsEditing(true)} className="p-2 bg-white shadow-sm border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all cursor-pointer">
                                    <MdEdit size={18} />
                                </button>
                                <button onClick={() => setShowDeleteModal(true)} className="p-2 bg-white shadow-sm border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all cursor-pointer">
                                    <MdDeleteOutline size={18} />
                                </button>
                            </div>}
                        </div>

                        {/* Title - Increased font weight and letter spacing */}
                        <h4 className="font-black text-slate-800 mb-3 line-clamp-2 leading-tight tracking-tight text-lg group-hover:text-indigo-900 transition-colors">
                            {note.title}
                        </h4>

                        {/* Content Section - Added a Fade-out mask at the bottom */}
                        <div className="relative flex-grow overflow-hidden mb-4">
                            <div className="h-full overflow-y-auto custom-scrollbar pr-2 pb-4">
                                <p className="text-sm text-slate-500 leading-relaxed font-medium whitespace-pre-wrap">
                                    {note.content}
                                </p>
                            </div>
                            {/* EXTRAORDINARY: Gradient Overlay to hint at more content */}
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        </div>

                        {/* Footer Section - Enhanced with a more modern 'Badge' look */}
                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center shrink-0 relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-0.5">
                                    Time
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">
                                    {new Date(note.createdAt).toLocaleDateString("en-IN", {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};