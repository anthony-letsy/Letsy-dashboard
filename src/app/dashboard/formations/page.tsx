'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Building2, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, MapPin, Users, Calendar, FileText, Search } from 'lucide-react'

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
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const itemsPerPage = 10

    const toggleExpand = (id: string) => {
        setExpandedId(prev => prev === id ? null : id)
    }

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

    // Apply status filter
    const statusFilteredFormations =
        filter === 'all'
            ? formations
            : formations.filter((f) => f.status === filter)

    // Apply search filter
    const filteredFormations = statusFilteredFormations.filter((formation) => {
        if (!searchQuery.trim()) return true
        const companyName = formation.payload?.company?.name
        if (typeof companyName === 'string') {
            return companyName.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return false
    })

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

    // Reset to page 1 when filter or search changes
    useEffect(() => {
        setCurrentPage(1)
    }, [filter, searchQuery])

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

            {/* Search and Filter Section */}
            <div className="mb-6 bg-white border border-[#e3e8ef] rounded-xl p-5 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    {/* Search Bar */}
                    <div className="flex-1 w-full lg:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8896a8] group-focus-within:text-[#635bff] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search companies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-10 py-3 text-[14px] bg-[#f7fafc] border border-[#e3e8ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent focus:bg-white transition-all placeholder:text-[#8896a8]"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8896a8] hover:text-[#0a2540] transition-colors"
                                    aria-label="Clear search"
                                >
                                    <XCircle className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block w-px h-10 bg-[#e3e8ef]" />

                    {/* Status Filters */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`relative flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg transition-all ${filter === 'all'
                                ? 'bg-[#635bff] text-white shadow-sm scale-105'
                                : 'bg-[#f7fafc] text-[#425466] hover:bg-[#e3e8ef] hover:scale-105'
                                }`}
                        >
                            <Building2 className={`w-3.5 h-3.5 ${filter === 'all' ? 'text-white' : 'text-[#635bff]'}`} />
                            <span>All</span>
                            <span
                                className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full ${filter === 'all'
                                    ? 'bg-white/25 text-white'
                                    : 'bg-white text-[#635bff]'
                                    }`}
                            >
                                {statusCounts.all}
                            </span>
                        </button>

                        <button
                            onClick={() => setFilter('pending')}
                            className={`relative flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg transition-all ${filter === 'pending'
                                ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-sm scale-105'
                                : 'bg-[#f7fafc] text-[#425466] hover:bg-yellow-50 hover:scale-105'
                                }`}
                        >
                            <Clock className={`w-3.5 h-3.5 ${filter === 'pending' ? 'text-white' : 'text-yellow-600'}`} />
                            <span>Pending</span>
                            <span
                                className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full ${filter === 'pending'
                                    ? 'bg-white/25 text-white'
                                    : 'bg-yellow-100 text-yellow-700'
                                    }`}
                            >
                                {statusCounts.pending}
                            </span>
                        </button>

                        <button
                            onClick={() => setFilter('verified')}
                            className={`relative flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg transition-all ${filter === 'verified'
                                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm scale-105'
                                : 'bg-[#f7fafc] text-[#425466] hover:bg-green-50 hover:scale-105'
                                }`}
                        >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${filter === 'verified' ? 'text-white' : 'text-green-600'}`} />
                            <span>Verified</span>
                            <span
                                className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full ${filter === 'verified'
                                    ? 'bg-white/25 text-white'
                                    : 'bg-green-100 text-green-700'
                                    }`}
                            >
                                {statusCounts.verified}
                            </span>
                        </button>

                        <button
                            onClick={() => setFilter('failed')}
                            className={`relative flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg transition-all ${filter === 'failed'
                                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm scale-105'
                                : 'bg-[#f7fafc] text-[#425466] hover:bg-red-50 hover:scale-105'
                                }`}
                        >
                            <XCircle className={`w-3.5 h-3.5 ${filter === 'failed' ? 'text-white' : 'text-red-600'}`} />
                            <span>Failed</span>
                            <span
                                className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full ${filter === 'failed'
                                    ? 'bg-white/25 text-white'
                                    : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                {statusCounts.failed}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Active Filters Indicator */}
                {(searchQuery || filter !== 'all') && (
                    <div className="mt-4 pt-4 border-t border-[#e3e8ef] flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-[#8896a8] font-medium uppercase tracking-wide">
                            Active Filters:
                        </span>
                        {searchQuery && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#635bff]/10 text-[#635bff] text-[11px] font-medium rounded-full">
                                <Search className="w-3 h-3" />
                                {searchQuery}
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="hover:bg-white/50 rounded-full p-0.5 transition-colors"
                                >
                                    <XCircle className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filter !== 'all' && (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full ${filter === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    filter === 'verified' ? 'bg-green-100 text-green-700' :
                                        filter === 'failed' ? 'bg-red-100 text-red-700' : ''
                                }`}>
                                {filter === 'pending' && <Clock className="w-3 h-3" />}
                                {filter === 'verified' && <CheckCircle2 className="w-3 h-3" />}
                                {filter === 'failed' && <XCircle className="w-3 h-3" />}
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                <button
                                    onClick={() => setFilter('all')}
                                    className="hover:bg-white/50 rounded-full p-0.5 transition-colors"
                                >
                                    <XCircle className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setFilter('all')
                            }}
                            className="ml-auto text-[11px] text-[#8896a8] hover:text-[#635bff] font-medium transition-colors"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white border border-[#e3e8ef] rounded-lg overflow-hidden">
                {loading ? (
                    <div className="divide-y divide-[#e3e8ef]">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredFormations.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f7fafc] mb-4">
                            {searchQuery ? (
                                <Search className="w-8 h-8 text-[#8896a8]" />
                            ) : (
                                <Building2 className="w-8 h-8 text-[#8896a8]" />
                            )}
                        </div>
                        <h3 className="text-[16px] font-semibold text-[#0a2540] mb-2">
                            {searchQuery ? 'No results found' : 'No formations found'}
                        </h3>
                        <p className="text-[14px] text-[#425466] max-w-sm mx-auto">
                            {searchQuery ? (
                                <>
                                    No companies match &ldquo;<span className="font-medium text-[#0a2540]">{searchQuery}</span>&rdquo;.
                                    Try adjusting your search.
                                </>
                            ) : filter !== 'all' ? (
                                `No ${filter} formations at the moment.`
                            ) : (
                                'No company formations have been created yet.'
                            )}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 px-4 py-2 text-[13px] font-medium text-[#635bff] hover:text-[#4c3fe4] transition-colors"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-[#e3e8ef]">
                        {currentItems.map((formation) => {
                            const isExpanded = expandedId === formation.id
                            const company = formation.payload?.company || {}

                            return (
                                <div key={formation.id} className="transition-colors">
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => toggleExpand(formation.id)}
                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#f7fafc] transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#635bff]/10 to-[#0099cc]/10 flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-[#635bff]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[14px] font-medium text-[#0a2540] truncate">
                                                    {company.name ? String(company.name) : 'N/A'}
                                                </h3>
                                                <p className="text-[13px] text-[#425466] mt-0.5">
                                                    {new Date(formation.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`inline-flex px-2.5 py-1 text-[11px] font-medium rounded-full ${getStatusColor(
                                                    formation.status
                                                )}`}
                                            >
                                                {formation.status.charAt(0).toUpperCase() +
                                                    formation.status.slice(1)}
                                            </span>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-[#425466] flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-[#425466] flex-shrink-0" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Accordion Content */}
                                    {isExpanded && (
                                        <div className="px-6 pb-6 bg-[#f7fafc]/50">
                                            <div className="bg-white border border-[#e3e8ef] rounded-lg p-5">
                                                <h4 className="text-[13px] font-semibold text-[#0a2540] mb-4 flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-[#635bff]" />
                                                    Company Details
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Company Name */}
                                                    {typeof company.name === 'string' && company.name && (
                                                        <div className="flex items-start gap-3">
                                                            <Building2 className="w-4 h-4 text-[#425466] mt-0.5 flex-shrink-0" />
                                                            <div className="min-w-0">
                                                                <p className="text-[11px] text-[#425466] uppercase tracking-wide font-medium mb-1">
                                                                    Company Name
                                                                </p>
                                                                <p className="text-[13px] text-[#0a2540] font-medium break-words">
                                                                    {company.name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Registration Number */}
                                                    {(typeof company.registration_number === 'string' || typeof company.registration_number === 'number') && (
                                                        <div className="flex items-start gap-3">
                                                            <FileText className="w-4 h-4 text-[#425466] mt-0.5 flex-shrink-0" />
                                                            <div className="min-w-0">
                                                                <p className="text-[11px] text-[#425466] uppercase tracking-wide font-medium mb-1">
                                                                    Registration Number
                                                                </p>
                                                                <p className="text-[13px] text-[#0a2540] font-medium break-words">
                                                                    {String(company.registration_number)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Address */}
                                                    {company.address !== undefined && (
                                                        <div className="flex items-start gap-3">
                                                            <MapPin className="w-4 h-4 text-[#425466] mt-0.5 flex-shrink-0" />
                                                            <div className="min-w-0">
                                                                <p className="text-[11px] text-[#425466] uppercase tracking-wide font-medium mb-1">
                                                                    Address
                                                                </p>
                                                                <p className="text-[13px] text-[#0a2540] break-words">
                                                                    {typeof company.address === 'string'
                                                                        ? company.address
                                                                        : JSON.stringify(company.address)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Company Type */}
                                                    {typeof company.type === 'string' && company.type && (
                                                        <div className="flex items-start gap-3">
                                                            <Building2 className="w-4 h-4 text-[#425466] mt-0.5 flex-shrink-0" />
                                                            <div className="min-w-0">
                                                                <p className="text-[11px] text-[#425466] uppercase tracking-wide font-medium mb-1">
                                                                    Company Type
                                                                </p>
                                                                <p className="text-[13px] text-[#0a2540] break-words">
                                                                    {company.type}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Directors */}
                                                    {company.directors !== undefined && (
                                                        <div className="flex items-start gap-3 md:col-span-2">
                                                            <Users className="w-4 h-4 text-[#425466] mt-0.5 flex-shrink-0" />
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-[11px] text-[#425466] uppercase tracking-wide font-medium mb-1">
                                                                    Directors
                                                                </p>
                                                                <p className="text-[13px] text-[#0a2540] break-words">
                                                                    {Array.isArray(company.directors)
                                                                        ? company.directors.map((d: unknown) =>
                                                                            typeof d === 'string' ? d : (d as Record<string, unknown>)?.name ? String((d as Record<string, unknown>).name) : JSON.stringify(d)
                                                                        ).join(', ')
                                                                        : JSON.stringify(company.directors)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Incorporation Date */}
                                                    {(typeof company.incorporation_date === 'string' || typeof company.incorporation_date === 'number') && (
                                                        <div className="flex items-start gap-3">
                                                            <Calendar className="w-4 h-4 text-[#425466] mt-0.5 flex-shrink-0" />
                                                            <div className="min-w-0">
                                                                <p className="text-[11px] text-[#425466] uppercase tracking-wide font-medium mb-1">
                                                                    Incorporation Date
                                                                </p>
                                                                <p className="text-[13px] text-[#0a2540] break-words">
                                                                    {new Date(String(company.incorporation_date)).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Additional payload data */}
                                                {Object.keys(company).length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-[#e3e8ef]">
                                                        <details className="group">
                                                            <summary className="text-[11px] text-[#425466] uppercase tracking-wide font-medium cursor-pointer hover:text-[#635bff] transition-colors flex items-center gap-2">
                                                                <span>View Full Payload</span>
                                                                <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
                                                            </summary>
                                                            <pre className="mt-3 p-3 bg-[#f7fafc] border border-[#e3e8ef] rounded text-[11px] text-[#0a2540] overflow-x-auto">
                                                                {JSON.stringify(formation.payload, null, 2)}
                                                            </pre>
                                                        </details>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
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
