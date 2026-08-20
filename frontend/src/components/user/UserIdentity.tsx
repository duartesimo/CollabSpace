import type { UserIdentityData } from '../../features/user/types/UserProfile'
import UserAvatar, { type UserAvatarSize } from './UserAvatar'

interface UserIdentityProps {
	user: UserIdentityData
	size?: UserAvatarSize
	showEmail?: boolean
	className?: string
}

export default function UserIdentity({
	user,
	size = 'small',
	showEmail = true,
	className = ''
}: UserIdentityProps) {
	const primaryName = user.displayName || user.username
	const secondaryText = showEmail && user.email
		? user.email
		: user.displayName
			? user.username
			: undefined

	return (
		<div className={`flex min-w-0 items-center gap-3 ${className}`}>
			<UserAvatar user={user} size={size} />
			<div className="min-w-0">
				<p className="truncate font-medium text-white">{primaryName}</p>
				{secondaryText && <p className="mt-0.5 truncate text-sm text-slate-400">{secondaryText}</p>}
			</div>
		</div>
	)
}
