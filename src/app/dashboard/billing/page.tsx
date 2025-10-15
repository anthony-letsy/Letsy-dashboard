'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CreditCard } from 'lucide-react'

type Formation = {
    id: string
    status: 'pending' | 'verified' | 'failed'
    created_at: string
}

export default function BillingPage() {
    const [formations, setFormations] = useState<Formation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFormations()
    }, [])

    const fetchFormations = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('companies')
            .select('id, status, created_at')
            .eq('partner_id', user.id)
            .order('created_at', { ascending: false })

        if (data) {
            setFormations(data)
        }
        setLoading(false)
    }

    // Calculate formations this month
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const currentMonth = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    const formationsThisMonth = formations.filter(f => {
        const createdDate = new Date(f.created_at)
        return createdDate >= firstDayOfMonth
    })

    const successfulFormationsThisMonth = formationsThisMonth.filter(
        f => f.status === 'verified'
    ).length

    // Calculate costs
    const platformFee = 399
    const formationFee = 129
    const formationCharges = successfulFormationsThisMonth * formationFee
    const totalCharges = platformFee + formationCharges

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center gap-4 border-b border-[#e3e8ef] pb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#635bff]/10 to-[#4f46e5]/10 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#4f46e5]" />
                </div>
                <div>
                    <h1 className="text-[28px] font-semibold text-[#0a2540] mb-1">
                        Billing
                    </h1>
                    <p className="text-[15px] text-[#425466]">
                        View your monthly charges and formation activity
                    </p>
                </div>
            </div>

            {/* Current Month Summary */}
            <div className="bg-white border border-[#e3e8ef] rounded-lg p-6 mb-6">
                <h2 className="text-[18px] font-semibold text-[#0a2540] mb-4">
                    {currentMonth}
                </h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-[#f7fafc] border border-[#e3e8ef] rounded-lg">
                        {loading ? (
                            <>
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto mt-2" />
                            </>
                        ) : (
                            <>
                                <p className="text-[32px] font-bold text-[#0a2540]">{formationsThisMonth.length}</p>
                                <p className="text-[13px] text-[#425466] mt-1">Total Formations</p>
                            </>
                        )}
                    </div>
                    <div className="text-center p-4 bg-[#f7fafc] border border-[#e3e8ef] rounded-lg">
                        {loading ? (
                            <>
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto mt-2" />
                            </>
                        ) : (
                            <>
                                <p className="text-[32px] font-bold text-green-600">{successfulFormationsThisMonth}</p>
                                <p className="text-[13px] text-[#425466] mt-1">Successful (Billed)</p>
                            </>
                        )}
                    </div>
                    <div className="text-center p-4 bg-[#f7fafc] border border-[#e3e8ef] rounded-lg">
                        {loading ? (
                            <>
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto mt-2" />
                            </>
                        ) : (
                            <>
                                <p className="text-[32px] font-bold text-[#635bff]">£{totalCharges.toFixed(0)}</p>
                                <p className="text-[13px] text-[#425466] mt-1">Total Charges</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="border-t border-[#e3e8ef] pt-4">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[14px] text-[#425466]">Platform fee</span>
                            <span className="text-[14px] font-medium text-[#0a2540]">£{platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[14px] text-[#425466]">
                                {successfulFormationsThisMonth} formation{successfulFormationsThisMonth !== 1 ? 's' : ''} × £{formationFee}
                            </span>
                            <span className="text-[14px] font-medium text-[#0a2540]">£{formationCharges.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-[#e3e8ef]">
                            <span className="text-[16px] font-semibold text-[#0a2540]">Total</span>
                            <span className="text-[20px] font-bold text-[#635bff]">£{totalCharges.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-[13px] text-blue-800">
                    <strong>Note:</strong> You are charged £{platformFee} per month for platform access, plus £{formationFee} for each successful company formation. Only verified formations are billed.
                </p>
            </div>

            {/* Billing History */}
            <div className="bg-white border border-[#e3e8ef] rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-[#e3e8ef]">
                    <h2 className="text-[18px] font-semibold text-[#0a2540]">
                        Billing History
                    </h2>
                </div>
                {loading ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f7fafc] border-b border-[#e3e8ef]">
                                <tr>
                                    <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                        Month
                                    </th>
                                    <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                        Formations
                                    </th>
                                    <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                        Platform Fee
                                    </th>
                                    <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                        Formation Fees
                                    </th>
                                    <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e3e8ef]">
                                {[...Array(3)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4">
                                            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (() => {
                    // Calculate billing history by month
                    const monthlyBilling = new Map<string, { count: number; date: Date }>()

                    formations.forEach(formation => {
                        if (formation.status === 'verified') {
                            const date = new Date(formation.created_at)
                            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

                            if (!monthlyBilling.has(monthKey)) {
                                monthlyBilling.set(monthKey, { count: 0, date })
                            }
                            const current = monthlyBilling.get(monthKey)!
                            current.count++
                        }
                    })

                    const historyArray = Array.from(monthlyBilling.entries())
                        .map(([key, value]) => ({
                            monthKey: key,
                            date: value.date,
                            formations: value.count,
                            platformFee,
                            formationFees: value.count * formationFee,
                            total: platformFee + (value.count * formationFee)
                        }))
                        .sort((a, b) => b.date.getTime() - a.date.getTime())

                    return historyArray.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-[15px] text-[#425466]">
                                No billing history yet
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#f7fafc] border-b border-[#e3e8ef]">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                            Month
                                        </th>
                                        <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                            Formations
                                        </th>
                                        <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                            Platform Fee
                                        </th>
                                        <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                            Formation Fees
                                        </th>
                                        <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e3e8ef]">
                                    {historyArray.map((item) => (
                                        <tr
                                            key={item.monthKey}
                                            className="hover:bg-[#f7fafc] transition-colors"
                                        >
                                            <td className="px-6 py-4 text-[14px] text-[#0a2540] font-medium">
                                                {item.date.toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-[14px] text-[#425466]">
                                                {item.formations}
                                            </td>
                                            <td className="px-6 py-4 text-[14px] text-[#425466]">
                                                £{item.platformFee.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-[14px] text-[#425466]">
                                                £{item.formationFees.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-[14px] font-semibold text-[#0a2540]">
                                                £{item.total.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                })()}
            </div>
        </div>
    )
}
