import React, { useEffect, useState } from 'react'
import client from '../api/client'

type User = {
	id: number
	username: string
	email: string
	createdAt: string
}

export default function Profile() {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchUser() {
			setLoading(true)
			setError(null)

			try {
				const response = await client.get<User>('/users/me')
				setUser(response.data)
			} catch (err) {
				const apiMessage = (err as any)?.response?.data?.message
				setError(apiMessage || 'Failed to load profile.')
			} finally {
				setLoading(false)
			}
		}

		fetchUser()
	}, [])

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-50 py-16">
				<div className="mx-auto w-full max-w-xl px-4 text-center">
					<p className="text-sm font-medium text-slate-500">Loading profile…</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen bg-slate-50 py-16">
				<div className="mx-auto w-full max-w-xl px-4">
					<div className="rounded-[2rem] border border-red-200 bg-white p-8 shadow-sm">
						<p className="text-center text-red-700">{error}</p>
					</div>
				</div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	return (
		<div className="h-screen bg-slate-950 py-16 text-slate-100">
			<div className="mx-auto w-full max-w-3xl px-4">
				<div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
					<div className="mb-8">
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Account</p>
						<h1 className="mt-4 text-3xl font-semibold text-slate-900">Your profile</h1>
						<p className="mt-2 text-sm leading-6 text-slate-500">
							This is your account information, powered by your authentication session.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						<div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
							<p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">Username</p>
							<p className="mt-3 text-xl font-semibold text-slate-900">{user.username}</p>
						</div>
						<div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
							<p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">Email</p>
							<p className="mt-3 text-xl font-semibold text-slate-900">{user.email}</p>
						</div>
						<div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:col-span-2">
							<p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">Member since</p>
							<p className="mt-3 text-xl font-semibold text-slate-900">{new Date(user.createdAt).toLocaleString()}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
