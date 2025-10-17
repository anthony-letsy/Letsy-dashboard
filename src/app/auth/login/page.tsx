'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
            } else {
                router.refresh()
                router.push('/dashboard')
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#635bff]/5 via-white to-[#0a2540]/5"></div>

            {/* Animated orbs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Content */}
            <div className="relative w-full max-w-[440px]">
                {/* Card with glassmorphism effect */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-[#635bff]/10 border border-white/20 p-8 sm:p-10">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#635bff] to-[#0a2540] mb-4 shadow-lg shadow-[#635bff]/30">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-[#0a2540] tracking-tight mb-2 bg-gradient-to-r from-[#0a2540] to-[#635bff] bg-clip-text text-transparent">
                            Welcome back
                        </h1>
                        <p className="text-[15px] text-[#425466]">
                            Sign in to continue to Letsy
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email field */}
                        <div className="group">
                            <label
                                htmlFor="email"
                                className="block text-[13px] font-medium text-[#0a2540] mb-2"
                            >
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-[#425466] group-focus-within:text-[#635bff] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 text-[15px] border border-[#e3e8ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635bff]/50 focus:border-[#635bff] transition-all bg-white/50 hover:bg-white/80"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="group">
                            <label
                                htmlFor="password"
                                className="block text-[13px] font-medium text-[#0a2540] mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-[#425466] group-focus-within:text-[#635bff] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 text-[15px] border border-[#e3e8ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635bff]/50 focus:border-[#635bff] transition-all bg-white/50 hover:bg-white/80"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#425466] hover:text-[#0a2540] transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl animate-shake">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-[13px] text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full px-4 py-3 text-[15px] font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#0a2540] hover:shadow-xl hover:shadow-[#635bff]/50 hover:-translate-y-0.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a2540] to-[#635bff] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-[14px] text-[#425466]">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/auth/signup"
                                className="text-[#635bff] hover:text-[#0a2540] font-semibold transition-colors hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -z-10 -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#635bff]/20 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute -z-10 -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-[#0a2540]/20 to-transparent rounded-full blur-2xl"></div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                }
            `}</style>
        </div>
    )
}
