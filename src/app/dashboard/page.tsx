'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalFormations: 0,
        pendingFormations: 0,
        verifiedFormations: 0,
        activeKeys: 0,
    })

    useEffect(() => {
        const fetchStats = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) return

            // Fetch formations stats
            const { data: formations } = await supabase
                .from('formations')
                .select('status')

            const { data: apiKeys } = await supabase
                .from('api_keys')
                .select('revoked')
                .eq('partner_id', user.id)

            if (formations) {
                setStats({
                    totalFormations: formations.length,
                    pendingFormations: formations.filter((f) => f.status === 'pending')
                        .length,
                    verifiedFormations: formations.filter((f) => f.status === 'verified')
                        .length,
                    activeKeys: apiKeys?.filter((k) => !k.revoked).length || 0,
                })
            }
        }

        fetchStats()
    }, [])

    const statCards = [
        {
            label: 'Total formations',
            value: stats.totalFormations,
            href: '/dashboard/formations',
        },
        {
            label: 'Pending verification',
            value: stats.pendingFormations,
            href: '/dashboard/formations',
        },
        {
            label: 'Verified companies',
            value: stats.verifiedFormations,
            href: '/dashboard/formations',
        },
        {
            label: 'Active API keys',
            value: stats.activeKeys,
            href: '/dashboard/api-keys',
        },
    ]

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-[28px] font-semibold text-[#0a2540] mb-2">
                    Overview
                </h1>
                <p className="text-[15px] text-[#425466]">
                    Monitor your partnership activity and metrics
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="bg-white border border-[#e3e8ef] rounded-lg p-6 hover:border-[#635bff] transition-colors"
                    >
                        <p className="text-[13px] text-[#425466] mb-2">{card.label}</p>
                        <p className="text-[32px] font-semibold text-[#0a2540]">
                            {card.value}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="bg-white border border-[#e3e8ef] rounded-lg p-6">
                <h2 className="text-[18px] font-semibold text-[#0a2540] mb-4">
                    Quick actions
                </h2>
                <div className="space-y-3">
                    <Link
                        href="/dashboard/api-keys"
                        className="flex items-center justify-between p-4 border border-[#e3e8ef] rounded-md hover:border-[#635bff] transition-colors"
                    >
                        <div>
                            <p className="text-[14px] font-medium text-[#0a2540]">
                                Generate API key
                            </p>
                            <p className="text-[13px] text-[#425466] mt-1">
                                Create a new API key to integrate with Letsy
                            </p>
                        </div>
                        <span className="text-[#635bff]">→</span>
                    </Link>
                    <Link
                        href="/dashboard/formations"
                        className="flex items-center justify-between p-4 border border-[#e3e8ef] rounded-md hover:border-[#635bff] transition-colors"
                    >
                        <div>
                            <p className="text-[14px] font-medium text-[#0a2540]">
                                View formations
                            </p>
                            <p className="text-[13px] text-[#425466] mt-1">
                                Check the status of company formations
                            </p>
                        </div>
                        <span className="text-[#635bff]">→</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
