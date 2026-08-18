import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
	label: string
	href?: string
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
	return (
		<nav aria-label="Breadcrumb" className="min-w-0">
			<ol className="flex min-w-0 items-center gap-2 overflow-hidden text-sm text-slate-500">
				{items.map((item, index) => (
					<li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
						{index > 0 && <span className="text-slate-700">/</span>}
						{item.href ? (
							<Link to={item.href} className="truncate transition hover:text-indigo-300">
								{item.label}
							</Link>
						) : (
							<span aria-current="page" className="truncate font-medium text-slate-300">
								{item.label}
							</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	)
}
