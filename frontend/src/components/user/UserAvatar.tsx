import type { UserIdentityData } from '../../features/user/types/UserProfile'

export type UserAvatarSize = 'small' | 'medium' | 'large'

interface UserAvatarProps {
	user: UserIdentityData
	size?: UserAvatarSize
	className?: string
}

const sizeClasses: Record<UserAvatarSize, string> = {
	small: 'h-8 w-8 text-xs',
	medium: 'h-11 w-11 text-sm',
	large: 'h-24 w-24 text-2xl'
}

function getInitials(user: UserIdentityData) {
	const name = (user.displayName || user.username).trim()
	const parts = name.split(/\s+/).filter(Boolean)

	if (parts.length === 0) return '?'
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

	return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export default function UserAvatar({ user, size = 'small', className = '' }: UserAvatarProps) {
	const name = user.displayName || user.username

	if (user.avatarUrl) {
		return (
			<img
				src={user.avatarUrl}
				alt={`${name} avatar`}
				className={`shrink-0 rounded-full border border-slate-700 object-cover ${sizeClasses[size]} ${className}`}
			/>
		)
	}

	return (
		<span
			aria-label={`${name} avatar`}
			role="img"
			className={`inline-flex shrink-0 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/15 font-semibold text-indigo-200 ${sizeClasses[size]} ${className}`}
		>
			{getInitials(user)}
		</span>
	)
}
