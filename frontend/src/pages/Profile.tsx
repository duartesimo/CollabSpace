import { useEffect, useState } from 'react'
import client from '../api/client'
import Card from '../components/ui/Card'
import LoadingState from '../components/ui/LoadingState'
import UserAvatar from '../components/user/UserAvatar'
import type { UserProfile } from '../features/user/types/UserProfile'

export default function Profile() {
	const [user, setUser] = useState<UserProfile | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchUser() {
			setLoading(true)
			setError(null)

			try {
				const response = await client.get<UserProfile>('/users/me')
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
			<div className="mx-auto w-full max-w-4xl py-8 text-slate-100">
				<LoadingState label="Loading your profile" variant="page" />
			</div>
		)
	}

	if (error) {
		return (
			<div className="py-8 text-slate-100">
				<div className="mx-auto w-full max-w-3xl">
					<div className="rounded-[2rem] border border-red-900/50 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
						<p className="text-center text-red-400">{error}</p>
					</div>
				</div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	return (
		<div className="py-8 text-slate-100">
			<div className="mx-auto w-full max-w-4xl">
				<header className="flex flex-col gap-6 border-b border-slate-800/80 pb-8 sm:flex-row sm:items-center">
					<UserAvatar user={user} size="large" />
					<div className="min-w-0">
						<p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300">Your profile</p>
						<h1 className="mt-3 truncate text-3xl font-semibold tracking-tight text-white sm:text-4xl">
							{user.displayName || user.username}
						</h1>
						<p className="mt-2 truncate text-slate-400">{user.email}</p>
					</div>
				</header>

				<section aria-labelledby="account-information-title" className="mt-8">
					<div>
						<h2 id="account-information-title" className="text-xl font-semibold text-white">Account information</h2>
						<p className="mt-1 text-sm text-slate-500">The identity associated with your CollabSpace account.</p>
					</div>
					<div className="mt-6 grid gap-4 sm:grid-cols-2">
						<Card>
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Username</p>
							<p className="mt-3 break-words text-lg font-semibold text-white">{user.username}</p>
						</Card>
						<Card>
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email address</p>
							<p className="mt-3 break-words text-lg font-semibold text-white">{user.email}</p>
						</Card>
						<Card>
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Member since</p>
							<p className="mt-3 text-lg font-semibold text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
						</Card>
						<Card>
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Account ID</p>
							<p className="mt-3 text-lg font-semibold text-white">#{user.id}</p>
						</Card>
					</div>
				</section>
			</div>
		</div>
	)
}
