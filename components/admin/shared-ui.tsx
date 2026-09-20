'use client'

import React from 'react'
import { AlertCircle, X } from 'lucide-react'

export function StatusBadge({ status, variant = 'default' }: { status: string; variant?: 'default' | 'inquiry' | 'seo' | 'availability' }) {
  const getClasses = () => {
    if (variant === 'inquiry') {
      return status === 'New' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
        : status === 'Contacted' ? 'bg-amber-50 text-amber-700 border border-amber-200'
        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    } else if (variant === 'seo') {
      return status === 'Complete' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
    } else if (variant === 'availability') {
      return status === 'In Stock' || status === 'InStock' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
    }
    return 'bg-indigo-50 text-indigo-700 border border-indigo-200'
  }
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${getClasses()}`}>{status}</span>
}

export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <section className="relative z-10 flex h-full sm:h-auto sm:max-h-[90vh] w-full max-w-2xl flex-col bg-white rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/50 shrink-0">
          <h2 className="text-base font-bold text-slate-900 truncate pr-2">{title}</h2>
          <button 
            type="button" 
            aria-label="Close modal" 
            onClick={onClose} 
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 overscroll-contain bg-white">
          {children}
        </div>
      </section>
    </div>
  )
}

export function ConfirmDialog({ item, onConfirm, onCancel }: { item: { type?: string; id?: number; name?: string; inUse?: boolean; inUseMessage?: string }; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-4 ring-rose-50/50">
          <AlertCircle size={22} />
        </div>
        <h3 className="mt-4 font-bold text-slate-900">Delete {item.name ? `"${item.name}"` : item.type || 'item'}?</h3>
        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
          {item.inUse ? (item.inUseMessage || `This ${item.type} is in use and cannot be deleted.`) : `Are you sure you want to delete this item? This action will permanently remove it from the database.`}
        </p>
        <div className="mt-6 flex gap-2.5">
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            Cancel
          </button>
          {!item.inUse && (
            <button 
              type="button" 
              onClick={onConfirm} 
              className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition shadow-xs"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action, actionLabel }: { icon: React.ComponentType<{ size?: number }>; title: string; description: string; action?: () => void; actionLabel?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 sm:p-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Icon size={24} />
      </div>
      <p className="mt-3 font-bold text-slate-900 text-sm">{title}</p>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">{description}</p>
      {action && (
        <button 
          onClick={action} 
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs"
        >
          {actionLabel || 'Create New'}
        </button>
      )}
    </div>
  )
}

export function BulletListEditor({ label, items, onChange, tone = 'neutral' }: { label: string; items: string[]; onChange: (items: string[]) => void; tone?: 'neutral' | 'positive' | 'negative' }) {
  const color = tone === 'positive' ? 'text-emerald-600' : tone === 'negative' ? 'text-rose-500' : 'text-indigo-600'
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <button 
          type="button" 
          onClick={() => onChange([...items, ''])} 
          className="text-xs font-bold text-indigo-600 hover:underline"
        >
          + Add bullet
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex items-center gap-2">
            <span className={`text-sm font-bold ${color}`}>
              {tone === 'positive' ? '✓' : tone === 'negative' ? '✕' : '•'}
            </span>
            <input 
              value={item} 
              onChange={e => onChange(items.map((value, i) => i === index ? e.target.value : value))} 
              placeholder="Enter bullet point..." 
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
            />
            <button 
              type="button" 
              aria-label={`Remove row ${index + 1}`} 
              onClick={() => onChange(items.filter((_, i) => i !== index))} 
              className="p-1 text-slate-400 hover:text-rose-600 transition"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
