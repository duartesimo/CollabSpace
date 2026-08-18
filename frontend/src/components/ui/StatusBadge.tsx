import type { ReactNode } from 'react'

type StatusBadgeTone = 'indigo' | 'amber' | 'emerald' | 'slate'

interface StatusBadgeProps {
	children: ReactNode
	tone?: StatusBadgeTone
	className?: string
}

const toneClasses: Record<StatusBadgeTone, string> = {
	indigo: 'border-indigo-400/20 bg-indigo-500/15 text-indigo-300',
	amber: 'border-amber-400/20 bg-amber-500/15 text-amber-300',
	emerald: 'border-emerald-400/20 bg-emerald-500/15 text-emerald-300',
	slate: 'border-slate-700 bg-slate-800 text-slate-300'
}

export default function StatusBadge({ children, tone = 'indigo', className = '' }: StatusBadgeProps) {
	return (
		<span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${toneClasses[tone]} ${className}`}>
			{children}
		</span>
	)
}
