import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Login() {
	const { login } = useAuth()
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError(null)
		setSubmitting(true)

		try {
			await login(email, password)
			navigate('/')
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setError(apiMessage || 'Login failed. Please check your credentials.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen bg-slate-950 py-16 text-slate-100">
			<div className="mx-auto w-full max-w-md px-4">
				<div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
					<div className="mb-8 space-y-3 text-center">
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Welcome back</p>
						<h1 className="text-3xl font-semibold tracking-tight text-white">Sign in to CollabSpace</h1>
						<p className="text-sm leading-6 text-slate-400">
							Secure access to your workspace and collaboration tools.
						</p>
					</div>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-slate-300">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								placeholder="you@example.com"
								className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-300">Password</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								placeholder="••••••••"
								className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
							/>
						</div>
						{error && <p className="text-sm text-red-400">{error}</p>}
						<button
							type="submit"
							disabled={submitting}
							className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{submitting ? 'Logging in...' : 'Login'}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
