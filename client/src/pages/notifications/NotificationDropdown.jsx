import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getNotificationsForBellApi } from "../../services/notification.service";
import {
  MdNotificationsNone,
  MdOutlineErrorOutline,
  MdOutlineWarningAmber,
  MdChevronRight
} from "react-icons/md";
//import { formatDistanceToNow } from "date-fns"; // Recommended library for "time ago"

export default function NotificationDropdown({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsForBellApi();
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* HEADER */}
      <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-black text-slate-800 tracking-tight">Notifications</h3>
        <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full">
          {notifications.length} NEW
        </span>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <NotificationSkeleton />
        ) : notifications.length === 0 ? (
          <EmptyState />
        ) : (
          notifications.map((n) => (
            <div
              key={n.policyId}
              onClick={() => {
                navigate(`/customers/${n.customerId}`);
                onClose();
              }}
              className="group p-4 border-b border-slate-50 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              {/* STATUS ICON */}
              <div className={`mt-1 h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${n.type === "EXPIRED" ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500"
                }`}>
                {n.type === "EXPIRED" ? <MdOutlineErrorOutline size={20} /> : <MdOutlineWarningAmber size={20} />}
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {n.customerName}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Policy {n.policyNumber}
                </p>
                <p className={`text-xs mt-1 font-semibold ${n.type === "EXPIRED" ? "text-rose-600" : "text-amber-700"
                  }`}>
                  {n.type === "EXPIRED"
                    ? `Expired ${Math.abs(n.daysLeft)}d ago`
                    : `Expires in ${n.daysLeft} days`}
                </p>
              </div>

              {/* ACTION INDICATOR */}
              <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                <MdChevronRight className="text-slate-300" size={20} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <div className="p-3 text-center border-t border-slate-50">
        <button
          onClick={() => { navigate("/notifications"); onClose(); }}
          className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 cursor-pointer"
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

const NotificationSkeleton = () => (
  <div className="p-4 space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-3 animate-pulse">
        <div className="h-10 w-10 bg-slate-100 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-100 rounded w-1/2" />
          <div className="h-2 bg-slate-50 rounded w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="p-10 text-center">
    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-slate-50 text-slate-300 mb-3">
      <MdNotificationsNone size={24} />
    </div>
    <p className="text-sm font-bold text-slate-800">All caught up!</p>
    <p className="text-xs text-slate-400 mt-1">No new policy alerts for now.</p>
  </div>
);