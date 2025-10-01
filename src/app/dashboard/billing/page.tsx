'use client'

export default function BillingPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-[28px] font-semibold text-[#0a2540] mb-2">
                    Billing & Usage
                </h1>
                <p className="text-[15px] text-[#425466]">
                    Track your API usage and manage your billing
                </p>
            </div>

            {/* Current Plan */}
            <div className="bg-white border border-[#e3e8ef] rounded-lg p-6 mb-6">
                <h2 className="text-[18px] font-semibold text-[#0a2540] mb-4">
                    Current Plan
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[20px] font-semibold text-[#0a2540]">Free Plan</p>
                        <p className="text-[14px] text-[#425466] mt-1">1,000 API calls per month</p>
                    </div>
                    <button className="px-4 py-2 text-[14px] font-medium text-white bg-[#635bff] hover:bg-[#0a2540] rounded-md transition-colors">
                        Upgrade Plan
                    </button>
                </div>
            </div>

            {/* Usage This Month */}
            <div className="bg-white border border-[#e3e8ef] rounded-lg p-6 mb-6">
                <h2 className="text-[18px] font-semibold text-[#0a2540] mb-4">
                    Usage This Month
                </h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-[14px] text-[#425466]">API Calls</span>
                            <span className="text-[14px] font-semibold text-[#0a2540]">237 / 1,000</span>
                        </div>
                        <div className="w-full bg-[#e3e8ef] rounded-full h-2">
                            <div className="bg-[#635bff] h-2 rounded-full" style={{ width: '23.7%' }}></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center p-4 bg-[#f7fafc] border border-[#e3e8ef] rounded-lg">
                            <p className="text-[24px] font-semibold text-[#0a2540]">237</p>
                            <p className="text-[13px] text-[#425466] mt-1">Total Calls</p>
                        </div>
                        <div className="text-center p-4 bg-[#f7fafc] border border-[#e3e8ef] rounded-lg">
                            <p className="text-[24px] font-semibold text-[#0a2540]">763</p>
                            <p className="text-[13px] text-[#425466] mt-1">Remaining</p>
                        </div>
                        <div className="text-center p-4 bg-[#f7fafc] border border-[#e3e8ef] rounded-lg">
                            <p className="text-[24px] font-semibold text-[#0a2540]">$0.00</p>
                            <p className="text-[13px] text-[#425466] mt-1">Current Cost</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing History */}
            <div className="bg-white border border-[#e3e8ef] rounded-lg p-6">
                <h2 className="text-[18px] font-semibold text-[#0a2540] mb-4">
                    Billing History
                </h2>
                <div className="text-[15px] text-[#425466] text-center py-8">
                    No billing history yet
                </div>
            </div>
        </div>
    )
}
