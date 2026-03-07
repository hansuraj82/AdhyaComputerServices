import React from 'react';
import { MdOutlineHistory, MdPerson, MdFingerprint, MdUpdate, MdDeleteOutline, MdAddCircleOutline } from 'react-icons/md';

export default function AuditTable({ logs }) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-3xl border border-slate-100">
        <MdOutlineHistory size={40} className="text-slate-300 mb-2" />
        <p className="text-slate-500 font-medium text-sm text-center">No activity recorded yet</p>
      </div>
    );
  }

  // Pure CSS-based color mapping (No heavy logic)
  const getActionTheme = (action) => {
    const act = action.toLowerCase();
    if (act.includes('delete')) return 'text-red-600 bg-red-50 ring-red-100';
    if (act.includes('create')) return 'text-emerald-600 bg-emerald-50 ring-emerald-100';
    return 'text-indigo-600 bg-indigo-50 ring-indigo-100';
  };

  return (
    <div className="w-full space-y-3">
      {/* Table Header - Static & Clean */}
      <div className="grid grid-cols-12 px-8 py-4 bg-slate-100/50 rounded-2xl mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <div className="col-span-3">User / Operator</div>
        <div className="col-span-2">Action</div>
        <div className="col-span-5">Activity Details</div>
        <div className="col-span-2 text-right">Time</div>
      </div>

      {/* Log Rows */}
      <div className="space-y-2">
        {logs.map((log) => (
          <div 
            key={log._id} 
            className="grid grid-cols-12 items-center px-8 py-5 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors shadow-sm"
          >
            {/* User Info */}
            <div className="col-span-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {log.userId?.name?.charAt(0) || 'S'}
              </div>
              <div className="truncate pr-4">
                <p className="text-sm font-bold text-slate-800 truncate">{log.userId?.name || 'System'}</p>
              </div>
            </div>

            {/* Action Badge */}
            <div className="col-span-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ring-1 ring-inset ${getActionTheme(log.action)}`}>
                {log.action}
              </span>
            </div>

            {/* Details */}
            <div className="col-span-5 flex items-center gap-2">
              <p className="text-sm text-slate-500 font-medium truncate">
                <span className="text-slate-900 font-bold pr-2 italic">[{log.entity}]</span>
                {log.details}
              </p>
            </div>

            {/* Timestamp */}
            <div className="col-span-2 text-right">
              <p className="text-xs font-bold text-slate-800">
                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                {new Date(log.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}