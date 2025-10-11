'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, KeyRound, Building2, CreditCard, Settings, LogOut } from 'lucide-react'

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/auth/login')
    }

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
        { name: 'API Keys', href: '/dashboard/api-keys', icon: KeyRound },
        { name: 'Formations', href: '/dashboard/formations', icon: Building2 },
        { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]

    return (
        <aside className="w-[220px] bg-[#0a2540] text-white flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-[20px] font-semibold tracking-tight">Letsy</h1>
            </div>

            <nav className="flex-1 px-3">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-[14px] transition-colors ${isActive
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={18} className="flex-shrink-0" />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="p-3 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[14px] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <LogOut size={18} className="flex-shrink-0" />
                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    )
}
