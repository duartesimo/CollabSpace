import { useEffect, useState, type FormEvent } from 'react'
import client from '../api/client'
import Card from '../components/ui/Card'
import LoadingState from '../components/ui/LoadingState'
import StatusBadge from '../components/ui/StatusBadge'
import UserAvatar from '../components/user/UserAvatar'
import type { UserProfile } from '../features/user/types/UserProfile'

export default function Profile() {
	const [user, setUser] = useState<UserProfile | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [username, setUsername] = useState('')
	const [saving, setSaving] = useState(false)
	const [saveError, setSaveError] = useState<string | null>(null)
	const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

	useEffect(() => {
		async function fetchUser() {
			setLoading(true)
			setError(null)

			try {
				const response = await client.get<UserProfile>('/users/me')
				setUser(response.data)
				setUsername(response.data.username)
			} catch (err) {
				const apiMessage = (err as any)?.response?.data?.message
				setError(apiMessage || 'Failed to load profile.')
			} finally {
				setLoading(false)
			}
		}

		void fetchUser()
	}, [])

	const handleStartEditing = () => {
		if (!user) return

		setUsername(user.username)
		setSaveError(null)
		setSaveSuccess(null)
		setIsEditing(true)
	}

	const handleCancelEditing = () => {
		if (user) setUsername(user.username)
		setSaveError(null)
		setIsEditing(false)
	}

	const handleSaveProfile = async (event: FormEvent) => {
		event.preventDefault()
		if (!user) return

		const trimmedUsername = username.trim()
		if (trimmedUsername.length < 3) {
			setSaveError('Username must be at least 3 characters.')
			return
		}

		setSaving(true)
		setSaveError(null)
		setSaveSuccess(null)

		try {
			const response = await client.put<UserProfile>(`/users/${user.id}`, {
				username: trimmedUsername,
				email: user.email
			})
			setUser(response.data)
			setUsername(response.data.username)
			setIsEditing(false)
			setSaveSuccess('Your profile was updated.')
		} catch (err) {
			const apiMessage = (err as any)?.response?.data?.message
			setSaveError(apiMessage || 'Unable to update your profile right now.')
		} finally {
			setSaving(false)
		}
	}

	if (loading) {
		return (
			<div className="mx-auto w-full max-w-5xl py-8 text-slate-100">
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

	if (!user) return null

	const memberSince = new Intl.DateTimeFormat(undefined, {
		month: 'long',
		year: 'numeric'
	}).format(new Date(user.createdAt))

	return (
		<div className="py-8 text-slate-100">
			<div className="mx-auto w-full max-w-5xl">
				<header className="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-7 shadow-2xl shadow-black/20 sm:p-10">
					<div className="max-w-2xl">
						<p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300">Your profile</p>
						<p className="mt-3 leading-7 text-slate-400">Your identity across workspaces, projects, and conversations.</p>
					</div>

					<div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
						<div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-end">
							<UserAvatar user={user} size="large" className="h-28 w-28 text-3xl ring-4 ring-slate-950/80 sm:h-32 sm:w-32" />
							<div className="min-w-0 pb-1">
								<h1 className="break-words text-4xl font-semibold tracking-tight text-white sm:text-5xl">
									{user.displayName || user.username}
								</h1>
								<p className="mt-2 text-base font-medium text-slate-400">@{user.username}</p>
								<p className="mt-2 break-all text-sm text-slate-300">{user.email}</p>
								<div className="mt-5 flex flex-wrap items-center gap-3">
									<StatusBadge tone="emerald">Active account</StatusBadge>
									<span className="text-sm text-slate-500">Member since {memberSince}</span>
								</div>
							</div>
						</div>

						{!isEditing && (
							<button
								type="button"
								onClick={handleStartEditing}
								className="inline-flex w-full shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-indigo-400/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 sm:w-auto"
							>
								Edit profile
							</button>
						)}
					</div>
				</header>

				{saveSuccess && (
					<div role="status" className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
						{saveSuccess}
					</div>
				)}

				<section aria-labelledby="account-details-title" className="mt-10">
					<div>
						<h2 id="account-details-title" className="text-xl font-semibold text-white">Account details</h2>
						<p className="mt-1 text-sm text-slate-500">The information teammates use to recognize you across CollabSpace.</p>
					</div>

					<div className="mt-5 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/50">
						{isEditing ? (
							<form onSubmit={handleSaveProfile} className="p-6 sm:p-8">
								<div className="flex items-center gap-4">
									<UserAvatar user={{ ...user, username: username || user.username }} size="medium" />
									<div>
										<h3 className="font-semibold text-white">Edit your identity</h3>
										<p className="mt-1 text-sm text-slate-500">Changes appear anywhere your username is shown.</p>
									</div>
								</div>

								<div className="mt-7 grid gap-5 md:grid-cols-2">
									<div>
										<label htmlFor="profile-username" className="text-sm font-medium text-slate-200">Username</label>
										<input
											id="profile-username"
											type="text"
											value={username}
											onChange={(event) => setUsername(event.target.value)}
											minLength={3}
											maxLength={50}
											required
											className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
										/>
									</div>
									<div>
										<label htmlFor="profile-email" className="text-sm font-medium text-slate-200">Email address</label>
										<input
											id="profile-email"
											type="email"
											value={user.email}
											readOnly
											className="mt-2 w-full cursor-not-allowed rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-500 outline-none"
										/>
										<p className="mt-2 text-xs leading-5 text-slate-500">Email identifies your current authentication session and remains read-only.</p>
									</div>
								</div>

								{saveError && (
									<div role="alert" className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
										{saveError}
									</div>
								)}

								<div className="mt-7 flex flex-col gap-3 sm:flex-row">
									<button
										type="submit"
										disabled={saving}
										className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-60"
									>
										{saving ? 'Saving...' : 'Save changes'}
									</button>
									<button
										type="button"
										onClick={handleCancelEditing}
										disabled={saving}
										className="rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
									>
										Cancel
									</button>
								</div>
							</form>
						) : (
							<div className="grid gap-0 sm:grid-cols-3">
								<div className="p-6 sm:p-8">
									<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Username</p>
									<p className="mt-3 break-words text-lg font-semibold text-white">@{user.username}</p>
									<p className="mt-2 text-sm leading-6 text-slate-500">Your shared identity across the product.</p>
								</div>
								<div className="border-t border-slate-800 p-6 sm:border-l sm:border-t-0 sm:p-8">
									<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</p>
									<p className="mt-3 break-all text-lg font-semibold text-white">{user.email}</p>
									<p className="mt-2 text-sm leading-6 text-slate-500">Used to sign in and identify your account.</p>
								</div>
								<div className="border-t border-slate-800 p-6 sm:border-l sm:border-t-0 sm:p-8">
									<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Joined</p>
									<p className="mt-3 text-lg font-semibold text-white">{memberSince}</p>
									<p className="mt-2 text-sm leading-6 text-slate-500">An active CollabSpace member.</p>
								</div>
							</div>
						)}
					</div>
				</section>
			</div>
		</div>
	)
}
