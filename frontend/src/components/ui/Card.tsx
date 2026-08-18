import type { ReactNode } from 'react'

type CardVariant = 'default' | 'muted' | 'danger'

interface CardProps {
	children: ReactNode
	className?: string
	variant?: CardVariant
}

const variantClasses: Record<CardVariant, string> = {
	default: 'border-slate-800 bg-slate-950/50',
	muted: 'border-slate-800 bg-slate-900/60',
	danger: 'border-red-500/30 bg-red-500/5'
}

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
	return (
		<div className={`rounded-3xl border p-6 ${variantClasses[variant]} ${className}`}>
			{children}
		</div>
	)
}
