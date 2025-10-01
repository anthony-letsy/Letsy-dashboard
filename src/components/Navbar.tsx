'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
    const [companyName, setCompanyName] = useState<string>('')

    useEffect(() => {
        const fetchProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (user) {
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

    return (
        <header className="h-16 border-b border-[#e3e8ef] bg-white flex items-center px-8">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#635bff] flex items-center justify-center">
                    <span className="text-white text-[14px] font-semibold">
                        {companyName ? companyName[0].toUpperCase() : 'L'}
                    </span>
                </div>
                <div>
                    <p className="text-[14px] font-medium text-[#0a2540]">
                        {companyName || 'Loading...'}
                    </p>
                </div>
            </div>
        </header>
    )
}
