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
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
			<div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
				<h1 className="text-2xl font-semibold text-gray-900">Create Workspace</h1>
				<p className="mt-2 text-sm text-gray-600">Start a new workspace for your team.</p>

				<form onSubmit={handleSubmit} className="mt-6 space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">Name</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Description</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={4}
							className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>

					{error && <p className="text-sm text-red-600">{error}</p>}

					<div className="flex gap-3">
						<button
							type="submit"
							disabled={submitting}
							className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
						>
							{submitting ? 'Creating...' : 'Create workspace'}
						</button>
						<button
							type="button"
							onClick={() => navigate('/')}
							className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
