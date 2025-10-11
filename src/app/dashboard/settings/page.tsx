'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
    const [companyName, setCompanyName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        setEmail(user.email || '')

        const { data } = await supabase
            .from('partners')
            .select('company_name')
            .eq('id', user.id)
            .single()

        if (data) {
            setCompanyName(data.company_name)
        }
        setLoading(false)
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage('')

        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('partners')
            .update({ company_name: companyName })
            .eq('id', user.id)

        if (error) {
            setMessage('Failed to update settings')
        } else {
            setMessage('Settings updated successfully')
            router.refresh()
        }
        setSaving(false)

        setTimeout(() => setMessage(''), 3000)
    }

    const handleDeleteAccount = async () => {
        if (
            !confirm(
                'Are you sure you want to delete your account? This action cannot be undone.'
            )
        ) {
            return
        }

        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        // Delete partner record
        await supabase.from('partners').delete().eq('id', user.id)

        // Sign out
        await supabase.auth.signOut()
        router.push('/auth/login')
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-[#425466]">Loading...</div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center gap-4 border-b border-[#e3e8ef] pb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff6b6b]/10 to-[#ee5a52]/10 flex items-center justify-center">
                    <Settings className="w-6 h-6 text-[#ff6b6b]" />
                </div>
                <div>
                    <h1 className="text-[28px] font-semibold text-[#0a2540] mb-1">
                        Settings
                    </h1>
                    <p className="text-[15px] text-[#425466]">
                        Manage your account settings and preferences
                    </p>
                </div>
            </div>

            <div className="max-w-2xl">
                <div className="bg-white border border-[#e3e8ef] rounded-lg p-6 mb-6">
                    <h2 className="text-[18px] font-semibold text-[#0a2540] mb-6">
                        Profile
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <label
                                htmlFor="companyName"
                                className="block text-[13px] font-medium text-[#0a2540] mb-2"
                            >
                                Company name
                            </label>
                            <input
                                id="companyName"
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full px-3 py-2 text-[15px] border border-[#e3e8ef] rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-[13px] font-medium text-[#0a2540] mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                disabled
                                className="w-full px-3 py-2 text-[15px] border border-[#e3e8ef] rounded-md bg-[#f7fafc] text-[#425466] cursor-not-allowed"
                            />
                            <p className="mt-2 text-[13px] text-[#425466]">
                                Email cannot be changed
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 text-[14px] font-medium text-white bg-[#635bff] hover:bg-[#0a2540] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : 'Save changes'}
                        </button>
                        {message && (
                            <p
                                className={`text-[13px] ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-white border border-red-200 rounded-lg p-6">
                    <h2 className="text-[18px] font-semibold text-red-600 mb-2">
                        Danger zone
                    </h2>
                    <p className="text-[14px] text-[#425466] mb-4">
                        Permanently delete your account and all associated data. This action
                        cannot be undone.
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 text-[14px] font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                    >
                        Delete account
                    </button>
                </div>
            </div>
        </div>
    )
}
