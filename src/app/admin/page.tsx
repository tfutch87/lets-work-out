import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, name, email')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  return <AdminDashboardClient adminName={profile.name || profile.email} />
}
