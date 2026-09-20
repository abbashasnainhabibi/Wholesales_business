'use client'

import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'

interface FieldProps { label: string; children: ReactNode; hint?: ReactNode }
export function Field({ label, children, hint }: FieldProps) { return <label className="block"><span className="mb-2 block text-xs font-medium">{label}</span>{children}{hint && <span className="mt-1 block text-[10px] text-slate-400">{hint}</span>}</label> }

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> { label: string; value: string; onChange: (value: string) => void }
export function TextInput({ label, value, onChange, ...props }: TextInputProps) { return <Field label={label}><input {...props} type={props.type ?? 'text'} value={value} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-200 transition-all" /></Field> }
