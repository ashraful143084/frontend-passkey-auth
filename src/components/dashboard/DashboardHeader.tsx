import React from 'react';
import { X, Menu, BrainCircuit, Share2, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    onLogout: () => void;
    setCurrentView: (view: any) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    isSidebarOpen,
    setIsSidebarOpen,
    onLogout,
    setCurrentView
}) => {
    return (
        <header className="h-16 flex items-center justify-between px-6 sticky top-0 left-0 right-0 z-[60] bg-slate-950/90 backdrop-blur-xl border-b border-teal-500/10">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2.5 hover:bg-teal-500/10 rounded-2xl text-teal-500 hover:text-white transition-all active:scale-90 shadow-lg shadow-teal-500/10 border border-teal-500/20"
                    title={isSidebarOpen ? "Collapse Neural Sidebar" : "Expand Neural Sidebar"}
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <div className={`flex items-center gap-4 transition-all duration-300 ${!isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-500 to-ocean-600 flex items-center justify-center shadow-2xl">
                        <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter">BrainBooster</span>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button className="flex items-center gap-2.5 px-5 py-2.5 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-xs font-black text-teal-400 hover:bg-teal-500/20 transition-all uppercase tracking-widest shadow-xl active:scale-95">
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Transmit</span>
                </button>
                <button
                    onClick={onLogout}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 hover:bg-red-500/20 transition-all active:scale-90"
                    title="Terminate Neural Connection"
                >
                    <LogOut className="w-5 h-5" />
                </button>
                <div
                    onClick={() => setCurrentView('profile')}
                    className="flex items-center gap-2 p-1.5 pr-4 rounded-2xl border border-teal-500/10 hover:bg-teal-500/10 transition-all cursor-pointer group"
                >
                    <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-[10px] font-black text-white shadow-xl">JD</div>
                    <span className="hidden md:inline text-xs font-black text-white uppercase tracking-tighter">Neural Profile</span>
                </div>
            </div>
        </header>
    );
};
