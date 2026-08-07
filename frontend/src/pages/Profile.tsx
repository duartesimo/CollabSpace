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
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<p className="text-gray-700">Loading profile…</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="max-w-md p-6 bg-white rounded shadow">
					<p className="text-red-700">{error}</p>
				</div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-lg p-8 bg-white rounded shadow">
				<h1 className="text-2xl font-semibold mb-4">Profile</h1>
				<div className="space-y-4 text-gray-700">
					<div>
						<h2 className="text-sm font-medium text-gray-500">Username</h2>
						<p className="mt-1 text-lg">{user.username}</p>
					</div>
					<div>
						<h2 className="text-sm font-medium text-gray-500">Email</h2>
						<p className="mt-1 text-lg">{user.email}</p>
					</div>
					<div>
						<h2 className="text-sm font-medium text-gray-500">Member since</h2>
						<p className="mt-1 text-lg">{new Date(user.createdAt).toLocaleString()}</p>
					</div>
				</div>
			</div>
		</div>
	)
}
