import type { ReactNode } from 'react'

interface SectionHeaderProps {
	title: string
	description?: string
	actions?: ReactNode
	className?: string
}

export default function SectionHeader({ title, description, actions, className = '' }: SectionHeaderProps) {
	return (
		<div className={`flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between ${className}`}>
			<div>
				<h2 className="text-lg font-semibold text-white">{title}</h2>
				{description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
			</div>
			{actions}
		</div>
	)
}
