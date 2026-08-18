import type { ReactNode } from 'react'

type StatusBadgeTone = 'indigo' | 'amber' | 'emerald' | 'slate'

interface StatusBadgeProps {
	children: ReactNode
	tone?: StatusBadgeTone
	className?: string
}

const toneClasses: Record<StatusBadgeTone, string> = {
	indigo: 'bg-indigo-500/15 text-indigo-300',
	amber: 'bg-amber-500/15 text-amber-300',
	emerald: 'bg-emerald-500/15 text-emerald-300',
	slate: 'bg-slate-800 text-slate-300'
}

export default function StatusBadge({ children, tone = 'indigo', className = '' }: StatusBadgeProps) {
	return (
		<span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]} ${className}`}>
			{children}
		</span>
	)
}
