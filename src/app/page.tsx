import Link from "next/link";

export default function Home() {
    // In production, redirect to https://app.letsy.co/
    // In development, use local /auth/login
    const signInUrl = process.env.NODE_ENV === 'production'
        ? 'https://app.letsy.co/'
        : '/auth/login';

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a2540] to-[#1a365d] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    Letsy Partner Dashboard
                </h1>
                <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                    Manage your API keys, track company formations, and access your partner account.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Link
                        href={signInUrl}
                        className="px-8 py-4 bg-[#635bff] hover:bg-[#5048e5] text-white font-medium rounded-lg transition-colors text-lg"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/auth/signup"
                        className="px-8 py-4 bg-white hover:bg-gray-100 text-[#0a2540] font-medium rounded-lg transition-colors text-lg"
                    >
                        Get Started
                    </Link>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-white mb-3">API Key Management</h3>
                        <p className="text-gray-300">Generate, manage, and secure your API keys with bcrypt hashing.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-white mb-3">Track Formations</h3>
                        <p className="text-gray-300">Monitor company formation status and manage your clients.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-white mb-3">Secure Access</h3>
                        <p className="text-gray-300">Protected routes with Supabase authentication and RLS policies.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
