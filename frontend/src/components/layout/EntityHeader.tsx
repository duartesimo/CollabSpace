import type { ReactNode } from 'react'

interface EntityHeaderProps {
	eyebrow: string
	title: string
	description?: string
	children?: ReactNode
}

export default function EntityHeader({ eyebrow, title, description, children }: EntityHeaderProps) {
	return (
		<header className="border-b border-slate-800/80 pb-8">
			<p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300">{eyebrow}</p>
			<div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
				<div className="min-w-0">
					<h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
					{description && <p className="mt-3 max-w-3xl leading-7 text-slate-400">{description}</p>}
				</div>
				{children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
			</div>
		</header>
	)
}
