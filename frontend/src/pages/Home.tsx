import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Home() {
	const { isAuthenticated } = useAuth()

	return (
		<div className="min-h-full bg-slate-950 text-slate-100">
			<div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24 lg:px-8">
				<div className="mx-auto w-full max-w-3xl text-center">
					<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Collaboration made simple</p>
					<h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
						CollabSpace brings your team together in one polished workspace.
					</h1>
					<p className="mt-6 text-lg leading-8 text-slate-300">
						Build, share, and review work with confidence — all backed by modern authentication and a clean responsive dashboard.
					</p>
					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Link
							to={isAuthenticated ? '/profile' : '/register'}
							className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500"
						>
							{isAuthenticated ? 'View Your Profile' : 'Get Started'}
						</Link>
						<Link
							to={isAuthenticated ? '/' : '/login'}
							className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
						>
							{isAuthenticated ? 'Back to Home' : 'Login'}
						</Link>
					</div>
				</div>
				<div className="mt-16 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-8">
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Secure by default</p>
						<p className="mt-4 text-sm leading-6 text-slate-300">
							JWT-protected endpoints and token handling are ready to go.
						</p>
					</div>
					<div className="rounded-3xl border border-white/10 bg-white/5 p-8">
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Fast frontend</p>
						<p className="mt-4 text-sm leading-6 text-slate-300">
							Vite-powered performance means fast reloads and a snappy UI.
						</p>
					</div>
					<div className="rounded-3xl border border-white/10 bg-white/5 p-8">
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Built for teams</p>
						<p className="mt-4 text-sm leading-6 text-slate-300">
							A clean architecture makes it easy to extend auth and protected routes.
						</p>
					</div>
					<div className="rounded-3xl border border-white/10 bg-white/5 p-8">
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Ready to launch</p>
						<p className="mt-4 text-sm leading-6 text-slate-300">
							The app shell and auth flow are already wired for production-ready UX.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
