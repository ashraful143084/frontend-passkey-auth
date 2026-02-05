import React from 'react';
import { BrainCircuit, X, Plus, LayoutDashboard, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
    sidebarRef: React.RefObject<HTMLDivElement>;
    setIsSidebarOpen: (open: boolean) => void;
    chatGroups: Array<{ title: string; chats: Array<{ id: string; label: string }> }>;
    activeChatId: string;
    setActiveChatId: (id: string) => void;
    currentView: string;
    setCurrentView: (view: any) => void;
    handleNewChat: () => void;
    deleteChat: (id: string) => void;
    onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    sidebarRef,
    setIsSidebarOpen,
    chatGroups,
    activeChatId,
    setActiveChatId,
    currentView,
    setCurrentView,
    handleNewChat,
    deleteChat,
    onLogout
}) => {
    return (
        <aside
            ref={sidebarRef}
            className={`fixed md:relative z-40 h-full bg-slate-900 border-r border-teal-500/10 overflow-hidden flex flex-col`}
        >
            <div className="w-[280px] h-full flex flex-col p-4">
                <div className="flex items-center gap-4 mb-8 px-2">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-ocean-600 flex items-center justify-center shadow-2xl shadow-teal-500/30">
                        <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-white tracking-tighter leading-none">BrainBooster</span>
                        <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-0.5">Quantum Intel</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="ml-auto p-2 hover:bg-white/5 rounded-xl text-teal-700 hover:text-white md:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-50 font-black text-xs uppercase tracking-widest hover:bg-teal-500/20 transition-all group shadow-xl"
                    >
                        <Plus className="w-5 h-5 text-teal-400 group-hover:scale-125 transition-transform" />
                        <span>Activate Neuro-Link</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-1 space-y-8">
                    {chatGroups.map(group => (
                        <div key={group.title} className="space-y-2">
                            <h3 className="text-[10px] font-black text-teal-900 uppercase tracking-[0.2em] px-3 mb-2">{group.title}</h3>
                            {group.chats.map(chat => (
                                <SidebarItem
                                    key={chat.id}
                                    label={chat.label}
                                    active={activeChatId === chat.id && currentView === 'chat'}
                                    onClick={() => { setActiveChatId(chat.id); setCurrentView('chat'); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                                    onDelete={() => deleteChat(chat.id)}
                                />
                            ))}
                        </div>
                    ))}

                    <div className="space-y-2">
                        <h3 className="text-[10px] font-black text-teal-900 uppercase tracking-[0.2em] px-3 mb-2">Knowledge Core</h3>
                        <button
                            onClick={() => { setCurrentView('collections'); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${currentView === 'collections' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'text-teal-600/60 hover:bg-white/5 hover:text-teal-400'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Neural Library</span>
                        </button>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-teal-500/10 space-y-2">
                    <div className="relative group/user px-1">
                        <button
                            onClick={() => setCurrentView('profile')}
                            className={`w-full flex items-center gap-3 p-2 rounded-2xl transition-all ${currentView === 'profile' ? 'bg-teal-500/10' : 'hover:bg-white/5'}`}
                        >
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-ocean-600 flex items-center justify-center text-xs font-black text-white shadow-lg ring-2 ring-teal-500/20">JD</div>
                            <div className="text-left overflow-hidden">
                                <div className="text-sm font-black text-white truncate">John Doe</div>
                                <div className="text-[10px] font-bold text-teal-600 uppercase tracking-tight">Master Path</div>
                            </div>
                        </button>
                        <div className="absolute bottom-full left-0 w-full mb-3 hidden group-focus-within/user:block animate-in slide-in-from-bottom-2 duration-200">
                            <div className="bg-slate-900 border border-teal-500/10 rounded-[28px] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <button onClick={() => setCurrentView('settings')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-teal-500/10 text-sm font-black text-teal-100"><SettingsIcon className="w-4 h-4" /> Settings</button>
                                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-sm font-black text-red-500 mt-2 border-t border-teal-500/10 pt-4"><LogOut className="w-4 h-4" /> Detachable Link</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};
