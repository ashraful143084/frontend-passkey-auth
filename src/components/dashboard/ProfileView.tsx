import React from 'react';
import { BrainCircuit, History as HistoryIcon, Database } from 'lucide-react';

export const ProfileView: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col items-center p-6 md:p-12 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-3xl space-y-12">
                <div className="relative p-10 rounded-[48px] bg-slate-900 border border-teal-500/10 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[100px]" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-teal-500 to-ocean-600 p-1 group cursor-pointer shadow-2xl">
                            <div className="w-full h-full rounded-[38px] bg-teal-950 flex items-center justify-center text-5xl font-black text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-ocean-600 opacity-20 group-hover:opacity-40 transition-opacity" />
                                JD
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <h1 className="text-5xl font-black text-white tracking-tighter">John Doe</h1>
                            <p className="text-lg font-bold text-teal-500/80">Quantum Data Architect • Master Tier</p>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <div className="px-4 py-2 bg-teal-500/10 rounded-xl text-[10px] font-black text-teal-400 border border-teal-500/20 uppercase tracking-widest">Neural Link Verified</div>
                                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_var(--color-teal-400)]" title="Online" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Neural Synapses', value: '14.2k', sub: '+12% weekly', icon: BrainCircuit },
                        { label: 'Uptime Pulse', value: '99.98%', sub: 'Global stability', icon: HistoryIcon },
                        { label: 'Cloud Buffer', value: '4.8 GB', sub: '92% Capacity', icon: Database }
                    ].map((stat, i) => (
                        <div key={i} className="p-8 bg-slate-900/60 backdrop-blur-md rounded-[40px] border border-teal-500/10 text-center space-y-4 hover:border-teal-500/30 transition-all group">
                            <div className="inline-flex p-4 rounded-3xl bg-teal-500/10 text-teal-500 group-hover:scale-110 transition-transform">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
                                <div className="text-[10px] uppercase font-black text-teal-700 tracking-widest mt-1">{stat.label}</div>
                            </div>
                            <div className="text-[11px] font-bold text-teal-500/60">{stat.sub}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
