import type { ReactNode } from 'react'

interface EmptyStateProps {
	title: string
	description?: string
	action?: ReactNode
	icon?: ReactNode
	compact?: boolean
	className?: string
}

export default function EmptyState({ title, description, action, icon, compact = false, className = '' }: EmptyStateProps) {
	return (
		<div className={`flex flex-col items-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 text-center ${compact ? 'p-4' : 'px-6 py-10'} ${className}`}>
			{icon && (
				<div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-lg font-semibold text-indigo-300">
					{icon}
				</div>
			)}
			<p className={`${compact ? 'text-sm' : 'text-base'} font-semibold text-slate-200`}>{title}</p>
			{description && <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>}
			{action && <div className="mt-4">{action}</div>}
		</div>
	)
}
