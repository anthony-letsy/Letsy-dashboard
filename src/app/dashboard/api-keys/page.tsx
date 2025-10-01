'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

type ApiKey = {
    id: string
    name: string
    key: string
    created_at: string
    revoked: boolean
}

export default function ApiKeysPage() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [newKeyName, setNewKeyName] = useState('')
    const [showGenerateModal, setShowGenerateModal] = useState(false)
    const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null)

    useEffect(() => {
        fetchApiKeys()
    }, [])

    const fetchApiKeys = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('api_keys')
            .select('*')
            .eq('partner_id', user.id)
            .order('created_at', { ascending: false })

        if (data) {
            setApiKeys(data)
        }
        setLoading(false)
    }

    const generateApiKey = async () => {
        if (!newKeyName.trim()) {
            alert('Please enter a name for the API key')
            return
        }

        setGenerating(true)
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        // Generate a secure API key
        const newKey = `letsy_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

        // Hash the key for secure storage
        const keyHash = await bcrypt.hash(newKey, 10)

        const { error } = await supabase.from('api_keys').insert({
            partner_id: user.id,
            name: newKeyName,
            key: newKey, // Store plain key temporarily for compatibility
            key_hash: keyHash, // Store hash for API authentication
        })

        if (!error) {
            setNewlyGeneratedKey(newKey)
            setNewKeyName('')
            fetchApiKeys()
        }
        setGenerating(false)
    }

    const revokeApiKey = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this API key?')) {
            return
        }
        await supabase.from('api_keys').update({ revoked: true }).eq('id', id)
        fetchApiKeys()
    }

    const deleteApiKey = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this API key? This action cannot be undone.')) {
            return
        }
        await supabase.from('api_keys').delete().eq('id', id)
        fetchApiKeys()
    }

    const copyToClipboard = (key: string) => {
        navigator.clipboard.writeText(key)
    }

    const closeModal = () => {
        setShowGenerateModal(false)
        setNewKeyName('')
    }

    const closeKeyRevealModal = () => {
        setNewlyGeneratedKey(null)
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold text-[#0a2540] mb-2">
                        API Keys
                    </h1>
                    <p className="text-[15px] text-[#425466]">
                        Manage your API keys for integrating with Letsy
                    </p>
                </div>
                <button
                    onClick={() => setShowGenerateModal(true)}
                    className="px-4 py-2 text-[14px] font-medium text-white bg-[#635bff] hover:bg-[#0a2540] rounded-md transition-colors"
                >
                    Generate new key
                </button>
            </div>

            <div className="bg-white border border-[#e3e8ef] rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-[#425466]">Loading...</div>
                ) : apiKeys.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-[15px] text-[#425466] mb-4">
                            No API keys yet
                        </p>
                        <button
                            onClick={() => setShowGenerateModal(true)}
                            className="px-4 py-2 text-[14px] font-medium text-white bg-[#635bff] hover:bg-[#0a2540] rounded-md transition-colors"
                        >
                            Generate your first key
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f7fafc] border-b border-[#e3e8ef]">
                                <tr>
                                    <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                        Name
                                    </th>
                                    <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                        Created
                                    </th>
                                    <th className="text-left px-6 py-3 text-[13px] font-medium text-[#425466]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e3e8ef]">
                                {apiKeys.map((apiKey) => (
                                    <tr
                                        key={apiKey.id}
                                        className="hover:bg-[#f7fafc] transition-colors"
                                    >
                                        <td className="px-6 py-4 text-[14px] text-[#0a2540] font-medium">
                                            {apiKey.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {apiKey.revoked ? (
                                                <span className="text-[11px] px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium">
                                                    Revoked
                                                </span>
                                            ) : (
                                                <span className="text-[11px] px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-[#425466]">
                                            {new Date(apiKey.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                {!apiKey.revoked ? (
                                                    <button
                                                        onClick={() => revokeApiKey(apiKey.id)}
                                                        className="text-[13px] text-red-600 hover:text-red-700 transition-colors font-medium"
                                                    >
                                                        Revoke
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => deleteApiKey(apiKey.id)}
                                                        className="text-[13px] text-red-600 hover:text-red-700 transition-colors font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Generate Key Modal */}
            {showGenerateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-[20px] font-semibold text-[#0a2540] mb-4">
                            Generate API key
                        </h2>
                        <div className="mb-6">
                            <label
                                htmlFor="keyName"
                                className="block text-[13px] font-medium text-[#0a2540] mb-2"
                            >
                                Key name
                            </label>
                            <input
                                id="keyName"
                                type="text"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                placeholder="e.g., Production API Key"
                                className="w-full px-3 py-2 text-[15px] border border-[#e3e8ef] rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={generateApiKey}
                                disabled={generating}
                                className="flex-1 px-4 py-2 text-[14px] font-medium text-white bg-[#635bff] hover:bg-[#0a2540] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generating ? 'Generating...' : 'Generate'}
                            </button>
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-2 text-[14px] font-medium text-[#425466] bg-white border border-[#e3e8ef] hover:border-[#635bff] rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Key Reveal Modal */}
            {newlyGeneratedKey && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-[20px] font-semibold text-[#0a2540] mb-2">
                            API key generated
                        </h2>
                        <p className="text-[14px] text-[#425466] mb-4">
                            Make sure to copy your API key now. You won&apos;t be able to see
                            it again!
                        </p>
                        <div className="bg-[#f7fafc] border border-[#e3e8ef] rounded-md p-3 mb-4">
                            <code className="text-[13px] font-mono text-[#0a2540] break-all">
                                {newlyGeneratedKey}
                            </code>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    copyToClipboard(newlyGeneratedKey)
                                    alert('API key copied to clipboard!')
                                }}
                                className="flex-1 px-4 py-2 text-[14px] font-medium text-white bg-[#635bff] hover:bg-[#0a2540] rounded-md transition-colors"
                            >
                                Copy to clipboard
                            </button>
                            <button
                                onClick={closeKeyRevealModal}
                                className="flex-1 px-4 py-2 text-[14px] font-medium text-[#425466] bg-white border border-[#e3e8ef] hover:border-[#635bff] rounded-md transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
