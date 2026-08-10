import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWorkspace } from '../features/workspace/api/workspace'

export default function CreateWorkspace() {
	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError(null)
		setSubmitting(true)

		try {
			await createWorkspace({ name, description })
			navigate('/')
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message || 'Unable to create workspace. Please try again.'
			setError(apiMessage)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
			<div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
				<div className="w-full rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
					<h1 className="text-2xl font-semibold text-white">Create Workspace</h1>
					<p className="mt-2 text-sm text-slate-400">Start a new workspace for your team.</p>

					<form onSubmit={handleSubmit} className="mt-6 space-y-4">
						<div>
							<label className="block text-sm font-medium text-slate-300">Name</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								placeholder="Product launch"
								className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-300">Description</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={4}
								placeholder="What should this workspace be used for?"
								className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
							/>
						</div>

						{error && <p className="text-sm text-red-400">{error}</p>}

						<div className="flex flex-col gap-3 pt-2 sm:flex-row">
							<button
								type="submit"
								disabled={submitting}
								className="inline-flex justify-center rounded-2xl border border-transparent bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:opacity-60"
							>
								{submitting ? 'Creating...' : 'Create workspace'}
							</button>
							<button
								type="button"
								onClick={() => navigate('/')}
								className="inline-flex justify-center rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
