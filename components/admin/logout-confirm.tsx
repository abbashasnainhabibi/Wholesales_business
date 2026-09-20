'use client'

import { LogOut, X } from 'lucide-react'

export function LogoutConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-4 ring-rose-50/50">
            <LogOut size={20} />
          </div>
          <button
            type="button"
            aria-label="Close logout confirmation"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        <h2 id="logout-title" className="mt-4 text-base sm:text-lg font-bold text-slate-900">
          Log out of Tahira Syndicate?
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
          Are you sure you want to end your session? Any unsaved catalog drafts will be lost.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition shadow-xs"
          >
            Yes, Log out
          </button>
        </div>
      </div>
    </div>
  )
}
