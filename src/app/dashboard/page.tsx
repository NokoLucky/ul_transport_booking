import { redirect } from 'next/navigation'

export default function DashboardPage() {
  // In a real app, you'd get the user's role from their session
  // and redirect accordingly. For this demo, we'll default to the admin dashboard.
  redirect('/dashboard/admin')
}
