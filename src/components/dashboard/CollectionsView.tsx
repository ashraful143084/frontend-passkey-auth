import React from 'react';
import { Code, LayoutDashboard, Database } from 'lucide-react';

export const CollectionsView: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto px-8 py-12 custom-scrollbar animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <h1 className="text-5xl font-black text-white tracking-tighter">Neural Library</h1>
                    <button className="px-8 py-4 bg-teal-600 text-white rounded-3xl font-black shadow-2xl shadow-teal-600/30 hover:bg-teal-500 transition-all active:scale-95 uppercase tracking-widest text-xs">Register New Asset</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[
                        { name: 'Quantum Core', count: 124, size: '84.2 GB', icon: Code, color: 'from-teal-500 to-teal-700' },
                        { name: 'Synapse Flow', count: 56, size: '1.2 TB', icon: LayoutDashboard, color: 'from-ocean-500 to-blue-700' },
                        { name: 'Digital Soul', count: 8, size: '4.5 MB', icon: Database, color: 'from-emerald-500 to-teal-600' },
                    ].map((item, i) => (
                        <div key={i} className="group p-1 bg-teal-500/10 rounded-[48px] border border-teal-500/5 hover:border-teal-500/30 transition-all cursor-pointer">
                            <div className="bg-slate-900 rounded-[45px] p-8 space-y-8">
                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center bg-gradient-to-br ${item.color} shadow-2xl transition-transform group-hover:-rotate-6 group-hover:scale-110`}>
                                    <item.icon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-2">{item.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-teal-500/60">{item.count} Neural Bundles</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-900" />
                                        <span className="text-xs font-bold text-teal-500/60">{item.size} Metadata</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-1 flex-1 bg-teal-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-teal-500 rounded-full w-[65%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
