type LoadingStateVariant = 'page' | 'cards' | 'list'

interface LoadingStateProps {
	label: string
	variant?: LoadingStateVariant
	count?: number
	className?: string
}

function SkeletonLine({ className = '' }: { className?: string }) {
	return <div className={`h-3 rounded-full bg-slate-800 ${className}`} />
}

export default function LoadingState({
	label,
	variant = 'list',
	count = 3,
	className = ''
}: LoadingStateProps) {
	const items = Array.from({ length: count }, (_, index) => index)

	return (
		<div role="status" aria-label={label} className={`animate-pulse motion-reduce:animate-none ${className}`}>
			<span className="sr-only">{label}</span>

			{variant === 'page' && (
				<div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
					<SkeletonLine className="h-4 w-24 bg-indigo-500/20" />
					<SkeletonLine className="mt-5 h-8 w-2/3 max-w-xl" />
					<SkeletonLine className="mt-4 w-full max-w-2xl" />
					<SkeletonLine className="mt-2 w-4/5 max-w-xl" />
				</div>
			)}

			{variant === 'cards' && (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{items.map((item) => (
						<div key={item} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
							<div className="h-10 w-10 rounded-2xl bg-slate-800" />
							<SkeletonLine className="mt-5 h-5 w-2/3" />
							<SkeletonLine className="mt-4 w-full" />
							<SkeletonLine className="mt-2 w-3/4" />
						</div>
					))}
				</div>
			)}

			{variant === 'list' && (
				<div className="space-y-3">
					{items.map((item) => (
						<div key={item} className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
							<SkeletonLine className="h-4 w-1/3" />
							<SkeletonLine className="mt-3 w-full" />
						</div>
					))}
				</div>
			)}
		</div>
	)
}
