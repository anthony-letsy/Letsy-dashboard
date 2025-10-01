'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/auth/login')
    }

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: '🏠' },
        { name: 'API Keys', href: '/dashboard/api-keys', icon: '🔑' },
        { name: 'Formations', href: '/dashboard/formations', icon: '📋' },
        { name: 'Billing', href: '/dashboard/billing', icon: '💳' },
        { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
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
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-[14px] transition-colors ${isActive
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className="text-[16px]">{item.icon}</span>
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
                    <span className="text-[16px]">🚪</span>
                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    )
}
