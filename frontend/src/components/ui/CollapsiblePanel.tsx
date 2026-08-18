import { useId, useState, type ReactNode } from 'react'

type CollapsiblePanelVariant = 'default' | 'muted' | 'danger'

interface CollapsiblePanelProps {
	title: string
	description?: string
	children: ReactNode
	className?: string
	variant?: CollapsiblePanelVariant
	defaultOpen?: boolean
}

const variantClasses: Record<CollapsiblePanelVariant, string> = {
	default: 'border-slate-800 bg-slate-950/50',
	muted: 'border-slate-800 bg-slate-900/60',
	danger: 'border-red-500/30 bg-red-500/5'
}

export default function CollapsiblePanel({
	title,
	description,
	children,
	className = '',
	variant = 'default',
	defaultOpen = false
}: CollapsiblePanelProps) {
	const isDanger = variant === 'danger'
	const [isOpen, setIsOpen] = useState(defaultOpen)
	const contentId = useId()

	return (
		<section className={`rounded-3xl border ${variantClasses[variant]} ${className}`}>
			<button
				type="button"
				aria-controls={contentId}
				aria-expanded={isOpen}
				onClick={() => setIsOpen((currentValue) => !currentValue)}
				className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-3xl p-6 text-left outline-none transition hover:bg-white/[0.02] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400"
			>
				<div>
					<h2 className={`text-lg font-semibold ${isDanger ? 'text-red-200' : 'text-white'}`}>{title}</h2>
					{description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
				</div>
				<span aria-hidden="true" className={`shrink-0 text-lg transition ${isOpen ? 'rotate-90' : ''} ${isDanger ? 'text-red-300' : 'text-slate-500'}`}>
					›
				</span>
			</button>
			<div id={contentId} className={`border-t border-slate-800/80 px-6 pb-6 pt-5 ${isOpen ? '' : 'hidden'}`}>
				{children}
			</div>
		</section>
	)
}
