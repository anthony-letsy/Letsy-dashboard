import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-[#f7fafc]">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-[220px]">
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
