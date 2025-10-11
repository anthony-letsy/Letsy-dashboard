'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Building2, Clock, CheckCircle2, XCircle } from 'lucide-react'

type Formation = {
    id: string
    payload: {
        company?: {
            name?: string
            [key: string]: unknown
        }
        [key: string]: unknown
    }
    status: 'pending' | 'verified' | 'failed'
    created_at: string
}

export default function FormationsPage() {
    const [formations, setFormations] = useState<Formation[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'failed'>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

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

    // Calculate counts for each status
    const statusCounts = {
        all: formations.length,
        pending: formations.filter((f) => f.status === 'pending').length,
        verified: formations.filter((f) => f.status === 'verified').length,
        failed: formations.filter((f) => f.status === 'failed').length,
    }

    // Pagination calculations
    const totalPages = Math.ceil(filteredFormations.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = filteredFormations.slice(startIndex, endIndex)

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1)
    }, [filter])

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
            <div className="mb-8 flex items-center gap-4 border-b border-[#e3e8ef] pb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d4ff]/10 to-[#0099cc]/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#00d4ff]" />
                </div>
                <div>
                    <h1 className="text-[28px] font-semibold text-[#0a2540] mb-1">
                        Formations
                    </h1>
                    <p className="text-[15px] text-[#425466]">
                        Track the status of company formations
                    </p>
                </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
                <button
                    onClick={() => setFilter('all')}
                    className={`group flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-lg transition-all ${filter === 'all'
                        ? 'bg-[#635bff] text-white shadow-md'
                        : 'bg-white text-[#425466] border border-[#e3e8ef] hover:border-[#635bff] hover:shadow-sm'
                        }`}
                >
                    <Building2 className={`w-4 h-4 ${filter === 'all' ? 'text-white' : 'text-[#635bff]'}`} />
                    <span>All</span>
                    <span
                        className={`ml-1 px-2 py-0.5 text-[11px] font-semibold rounded-full ${filter === 'all'
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 text-[#425466] group-hover:bg-[#635bff]/10'
                            }`}
                    >
                        {statusCounts.all}
                    </span>
                </button>

                <button
                    onClick={() => setFilter('pending')}
                    className={`group flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-lg transition-all ${filter === 'pending'
                        ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-md'
                        : 'bg-white text-[#425466] border border-[#e3e8ef] hover:border-yellow-500 hover:shadow-sm'
                        }`}
                >
                    <Clock className={`w-4 h-4 ${filter === 'pending' ? 'text-white' : 'text-yellow-600'}`} />
                    <span>Pending</span>
                    <span
                        className={`ml-1 px-2 py-0.5 text-[11px] font-semibold rounded-full ${filter === 'pending'
                            ? 'bg-white/20 text-white'
                            : 'bg-yellow-50 text-yellow-700 group-hover:bg-yellow-100'
                            }`}
                    >
                        {statusCounts.pending}
                    </span>
                </button>

                <button
                    onClick={() => setFilter('verified')}
                    className={`group flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-lg transition-all ${filter === 'verified'
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md'
                        : 'bg-white text-[#425466] border border-[#e3e8ef] hover:border-green-500 hover:shadow-sm'
                        }`}
                >
                    <CheckCircle2 className={`w-4 h-4 ${filter === 'verified' ? 'text-white' : 'text-green-600'}`} />
                    <span>Verified</span>
                    <span
                        className={`ml-1 px-2 py-0.5 text-[11px] font-semibold rounded-full ${filter === 'verified'
                            ? 'bg-white/20 text-white'
                            : 'bg-green-50 text-green-700 group-hover:bg-green-100'
                            }`}
                    >
                        {statusCounts.verified}
                    </span>
                </button>

                <button
                    onClick={() => setFilter('failed')}
                    className={`group flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-lg transition-all ${filter === 'failed'
                        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md'
                        : 'bg-white text-[#425466] border border-[#e3e8ef] hover:border-red-500 hover:shadow-sm'
                        }`}
                >
                    <XCircle className={`w-4 h-4 ${filter === 'failed' ? 'text-white' : 'text-red-600'}`} />
                    <span>Failed</span>
                    <span
                        className={`ml-1 px-2 py-0.5 text-[11px] font-semibold rounded-full ${filter === 'failed'
                            ? 'bg-white/20 text-white'
                            : 'bg-red-50 text-red-700 group-hover:bg-red-100'
                            }`}
                    >
                        {statusCounts.failed}
                    </span>
                </button>
            </div>

            <div className="bg-white border border-[#e3e8ef] rounded-lg overflow-hidden">
                {loading ? (
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
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4">
                                            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                                {currentItems.map((formation) => (
                                    <tr
                                        key={formation.id}
                                        className="hover:bg-[#f7fafc] transition-colors"
                                    >
                                        <td className="px-6 py-4 text-[14px] text-[#0a2540] font-medium">
                                            {formation.payload?.company?.name || 'N/A'}
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

            {/* Pagination */}
            {!loading && filteredFormations.length > itemsPerPage && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-[13px] text-[#425466]">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredFormations.length)} of{' '}
                        {filteredFormations.length} results
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-[13px] font-medium text-[#425466] bg-white border border-[#e3e8ef] rounded-md hover:border-[#635bff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => {
                            const pageNumber = i + 1
                            // Show first page, last page, current page, and pages around current
                            if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${currentPage === pageNumber
                                            ? 'bg-[#635bff] text-white'
                                            : 'text-[#425466] bg-white border border-[#e3e8ef] hover:border-[#635bff]'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                )
                            } else if (
                                pageNumber === currentPage - 2 ||
                                pageNumber === currentPage + 2
                            ) {
                                return <span key={pageNumber} className="px-2 text-[#425466]">...</span>
                            }
                            return null
                        })}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-[13px] font-medium text-[#425466] bg-white border border-[#e3e8ef] rounded-md hover:border-[#635bff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
