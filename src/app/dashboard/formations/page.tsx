'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Formation = {
    id: string
    company_name: string
    status: 'pending' | 'verified' | 'failed'
    created_at: string
}

export default function FormationsPage() {
    const [formations, setFormations] = useState<Formation[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'failed'>('all')

    useEffect(() => {
        fetchFormations()
    }, [])

    const fetchFormations = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('formations')
            .select('*')
            .eq('partner_id', user.id)
            .order('created_at', { ascending: false })

        if (data) {
            setFormations(data)
        }
        setLoading(false)
    }

    const filteredFormations =
        filter === 'all'
            ? formations
            : formations.filter((f) => f.status === filter)

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified':
                return 'bg-green-50 text-green-700'
            case 'pending':
                return 'bg-yellow-50 text-yellow-700'
            case 'failed':
                return 'bg-red-50 text-red-700'
            default:
                return 'bg-gray-50 text-gray-700'
        }
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-[28px] font-semibold text-[#0a2540] mb-2">
                    Formations
                </h1>
                <p className="text-[15px] text-[#425466]">
                    Track the status of company formations
                </p>
            </div>

            <div className="mb-6 flex gap-2">
                {(['all', 'pending', 'verified', 'failed'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${filter === status
                            ? 'bg-[#635bff] text-white'
                            : 'bg-white text-[#425466] border border-[#e3e8ef] hover:border-[#635bff]'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-[#e3e8ef] rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-[#425466]">Loading...</div>
                ) : filteredFormations.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-[15px] text-[#425466]">
                            No formations found
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f7fafc] border-b border-[#e3e8ef]">
                                <tr>
                                    <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                        Company
                                    </th>
                                    <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                        Created
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e3e8ef]">
                                {filteredFormations.map((formation) => (
                                    <tr
                                        key={formation.id}
                                        className="hover:bg-[#f7fafc] transition-colors"
                                    >
                                        <td className="px-6 py-4 text-[14px] text-[#0a2540] font-medium">
                                            {formation.company_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2 py-1 text-[11px] font-medium rounded-full ${getStatusColor(
                                                    formation.status
                                                )}`}
                                            >
                                                {formation.status.charAt(0).toUpperCase() +
                                                    formation.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-[#425466]">
                                            {new Date(
                                                formation.created_at
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
