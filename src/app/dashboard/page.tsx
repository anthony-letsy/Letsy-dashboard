'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { KeyRound, Building2, Settings, FileText, BookOpen, LayoutDashboard } from 'lucide-react'

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        totalFormations: 0,
        pendingFormations: 0,
        verifiedFormations: 0,
        activeKeys: 0,
    })

    useEffect(() => {
        setIsLoading(true)
        const fetchStats = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) return

            // Fetch formations stats
            const { data: formations } = await supabase
                .from('companies')
                .select('status')
                .eq('partner_id', user.id)

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
            setIsLoading(false)
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

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="mb-8">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-5 w-96 bg-gray-100 rounded animate-pulse" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white border border-[#e3e8ef] rounded-lg p-6"
                        >
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-[#e3e8ef] rounded-lg p-6">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="p-5 border border-[#e3e8ef] rounded-lg"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse" />
                                    <div className="flex-1">
                                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                                        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center gap-4 border-b border-[#e3e8ef] pb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#635bff]/10 to-[#4f46e5]/10 flex items-center justify-center">
                    <LayoutDashboard className="w-6 h-6 text-[#635bff]" />
                </div>
                <div>
                    <h1 className="text-[28px] font-semibold text-[#0a2540] mb-1">
                        Overview
                    </h1>
                    <p className="text-[15px] text-[#425466]">
                        Monitor your formation activity and metrics
                    </p>
                </div>
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
                <h2 className="text-[18px] font-semibold text-[#0a2540] mb-6">
                    Quick actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <a
                        href="https://letsy.co/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-5 border border-[#e3e8ef] rounded-lg hover:border-[#635bff] hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-[#f8f9fc]"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] font-semibold text-[#0a2540] mb-1">
                                    View documentation
                                </p>
                                <p className="text-[13px] text-[#425466] leading-relaxed">
                                    Learn how to integrate with Letsy API
                                </p>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 text-[#635bff] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            →
                        </div>
                    </a>
                    <Link
                        href="/dashboard/api-keys"
                        className="group relative p-5 border border-[#e3e8ef] rounded-lg hover:border-[#635bff] hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-[#f8f9fc]"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#635bff] to-[#4f46e5] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <KeyRound className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] font-semibold text-[#0a2540] mb-1">
                                    Generate API key
                                </p>
                                <p className="text-[13px] text-[#425466] leading-relaxed">
                                    Create a new API key to integrate with Letsy
                                </p>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 text-[#635bff] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            →
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/formations"
                        className="group relative p-5 border border-[#e3e8ef] rounded-lg hover:border-[#635bff] hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-[#f8f9fc]"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#0099cc] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] font-semibold text-[#0a2540] mb-1">
                                    View formations
                                </p>
                                <p className="text-[13px] text-[#425466] leading-relaxed">
                                    Check the status of company formations
                                </p>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 text-[#635bff] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            →
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/settings"
                        className="group relative p-5 border border-[#e3e8ef] rounded-lg hover:border-[#635bff] hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-[#f8f9fc]"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff6b6b] to-[#ee5a52] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <Settings className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] font-semibold text-[#0a2540] mb-1">
                                    Account settings
                                </p>
                                <p className="text-[13px] text-[#425466] leading-relaxed">
                                    Manage your profile and preferences
                                </p>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 text-[#635bff] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            →
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/billing"
                        className="group relative p-5 border border-[#e3e8ef] rounded-lg hover:border-[#635bff] hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-[#f8f9fc]"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#51cf66] to-[#37b24d] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] font-semibold text-[#0a2540] mb-1">
                                    Billing & usage
                                </p>
                                <p className="text-[13px] text-[#425466] leading-relaxed">
                                    View invoices and manage subscription
                                </p>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 text-[#635bff] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            →
                        </div>
                    </Link>


                </div>
            </div>
        </div>
    )
}
