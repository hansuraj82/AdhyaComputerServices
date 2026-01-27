import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getNotificationsApi, acknowledgeNotificationApi } from "../../services/notification.service";
import {
  MdOutlineTimer,
  MdNotificationsActive,
  MdNotificationsPaused,
  MdChevronRight,
} from "react-icons/md";
import { useNotifications } from "../../components/context/NotificationContext";

export default function NotificationCenter() {
  document.title = `Notifications | Adhya Computer`;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("urgent");
  const [snoozingId, setSnoozingId] = useState(null);
  const navigate = useNavigate();
  const { fetchCount } = useNotifications();

  const fetchAll = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await getNotificationsApi();
      setNotifications(res.data.notifications);
    } catch (err) {
      toast.error("Failed to sync notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const urgentItems = notifications.filter(n => !n.isSnoozed);
  const snoozedItems = notifications.filter(n => n.isSnoozed);

  const handleSnoozeAction = async (e, policyId, days) => {
    e.stopPropagation();
    try {
      setSnoozingId(policyId);
      await acknowledgeNotificationApi(policyId, days);
      toast.success(`Reminder snoozed for ${days} days`, {
        icon: '🕒',
        style: { borderRadius: '12px', background: '#333', color: '#fff' }
      });
      fetchCount();
      await fetchAll(true);
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setSnoozingId(null);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto p-20 text-center space-y-4">
      <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <div className="animate-pulse text-slate-400 font-bold">Synchronizing Alerts...</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Notification Center
            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg text-sm">{notifications.length}</span>
          </h1>
          <p className="text-slate-500 text-sm">Monitor policy expiries and manage follow-ups.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <TabButton
            active={activeTab === "urgent"}
            onClick={() => setActiveTab("urgent")}
            label="Urgent"
            count={urgentItems.length}
            icon={<MdNotificationsActive />}
          />
          <TabButton
            active={activeTab === "snoozed"}
            onClick={() => setActiveTab("snoozed")}
            label="Snoozed"
            count={snoozedItems.length}
            icon={<MdNotificationsPaused />}
          />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="space-y-3">
        {(activeTab === "urgent" ? urgentItems : snoozedItems).length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-slate-50/50">
            <p className="text-slate-400 font-bold italic">No {activeTab} alerts to display.</p>
          </div>
        ) : (
          (activeTab === "urgent" ? urgentItems : snoozedItems).map((n) => {
            const isSnoozing = snoozingId === n.policyId;
            const isExpired = n.daysLeft <= 0;
            const snoozableDays = n.daysLeft - 2;
            const isTooCloseToSnooze = n.daysLeft <= 2 && n.daysLeft > 0;

            return (
              <div
                key={n.policyId}
                onClick={() => !isSnoozing && navigate(`/customers/${n.customerId}`)}
                className={`group bg-white border border-slate-100 p-5 rounded-2xl flex flex-wrap md:flex-nowrap items-center gap-4 hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer ${isSnoozing ? 'opacity-70 pointer-events-none' : ''}`}
              >
                {/* STATUS INDICATOR */}
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 font-bold ${n.type === "EXPIRED" ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500"
                  }`}>
                  {isSnoozing ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    n.type === "EXPIRED" ? "!" : "⚠️"
                  )}
                </div>

                {/* DETAILS */}
                <div className="flex-1 min-w-[200px]">
                  <h4 className="font-black text-slate-800 tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                    {n.customerName}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Policy: <span className="font-mono font-bold text-slate-700">{n.policyNumber}</span>
                  </p>

                  {/* RESTORED BADGES */}
                  <div className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase inline-flex items-center gap-2 mt-2 ${n.type === "EXPIRED"
                    ? "bg-rose-50 text-rose-600 border-rose-100"
                    : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>

                    {/* The Animated Dot Container */}
                    <span className="relative flex h-1.5 w-1.5">
                      {n.daysLeft === 0 && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                      )}
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
                    </span>

                    {/* The Text Label */}
                    <span>
                      {n.type === "EXPIRED"
                        ? `Expired ${Math.abs(n.daysLeft)} d ago`
                        : n.daysLeft === 0 ? "Expiring Today" : `Expires in ${n.daysLeft} d`
                      }
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  {activeTab === "urgent" && (
                    <button
                      disabled={isExpired || isTooCloseToSnooze || isSnoozing}
                      onClick={(e) => handleSnoozeAction(e, n.policyId, snoozableDays)}
                      className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${isExpired || isTooCloseToSnooze
                        ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
                        : "bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 shadow-sm"
                        }`}
                    >
                      {isSnoozing ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <MdOutlineTimer size={16} />
                      )}
                      {isExpired ? "Expired" : isTooCloseToSnooze ? "Action Required" : `Snooze ${snoozableDays}d`}
                    </button>
                  )}
                  <div className="p-2 rounded-full bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                    <MdChevronRight size={20} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const TabButton = ({ active, onClick, label, count, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all cursor-pointer ${active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
      }`}
  >
    {icon} {label}
    <span className={`ml-1 text-[10px] px-1.5 rounded-md ${active ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-500"
      }`}>
      {count}
    </span>
  </button>
);