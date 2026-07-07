import { getProfile } from '@/lib/services/profile'
import { ProfileHero } from './profile-hero'

export async function ProfileSection() {
  const profile = await getProfile()
  if (!profile) return null
  return <ProfileHero profile={profile} />
}
