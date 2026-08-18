import type { ReactNode } from 'react'

interface EmptyStateProps {
	title: string
	description?: string
	action?: ReactNode
	className?: string
}

export default function EmptyState({ title, description, action, className = '' }: EmptyStateProps) {
	return (
		<div className={`rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-5 text-center ${className}`}>
			<p className="text-sm font-medium text-slate-300">{title}</p>
			{description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
			{action && <div className="mt-4">{action}</div>}
		</div>
	)
}
