'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogOut, Building2, User } from 'lucide-react'

export default function Navbar() {
    const [companyName, setCompanyName] = useState<string>('')
    const [userEmail, setUserEmail] = useState<string>('')
    const [showUserMenu, setShowUserMenu] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (user) {
                setUserEmail(user.email || '')
                const { data } = await supabase
                    .from('partners')
                    .select('company_name')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setCompanyName(data.company_name)
                }
            }
        }

        fetchProfile()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/auth/login')
    }

    return (
        <header className="h-16 border-b border-[#e3e8ef] bg-white flex items-center px-8">
            <div className="flex items-center justify-between w-full">
                {/* Brand Section */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#635bff] to-[#5048e5] flex items-center justify-center shadow-sm">
                            <span className="text-white text-[16px] font-bold">L</span>
                        </div>
                        <span className="text-[18px] font-semibold text-[#0a2540]">
                            Letsy
                        </span>
                    </div>
                    <div className="h-6 w-px bg-[#e3e8ef] mx-2" />
                    <div className="flex items-center gap-2 text-[13px] text-[#425466]">
                        <Building2 className="w-4 h-4" />
                        <span>{companyName || 'Loading...'}</span>
                    </div>
                </div>

                {/* User Section */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 hover:bg-[#f7fafc] rounded-lg px-3 py-2 transition-colors"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-[13px] font-medium text-[#0a2540]">
                                {companyName || 'Partner'}
                            </p>
                            <p className="text-[11px] text-[#425466]">
                                {userEmail || 'Loading...'}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#635bff] to-[#5048e5] flex items-center justify-center shadow-sm">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#e3e8ef] py-2 z-20">
                                <div className="px-4 py-2 border-b border-[#e3e8ef]">
                                    <p className="text-[13px] font-medium text-[#0a2540]">
                                        {companyName}
                                    </p>
                                    <p className="text-[11px] text-[#425466] truncate">
                                        {userEmail}
                                    </p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-[13px] text-[#425466] hover:bg-[#f7fafc] transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
