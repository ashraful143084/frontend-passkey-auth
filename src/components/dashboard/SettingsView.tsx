import React from 'react';
import { Monitor, Lock, CreditCard, ChevronDown, Usb, Fingerprint, Plus, Laptop, Zap } from 'lucide-react';

interface SettingsViewProps {
    settingsTab: 'general' | 'security' | 'personalization' | 'billing';
    setSettingsTab: (tab: any) => void;
    savedPasskeys: any[];
    showPasskeyModal: boolean;
    setShowPasskeyModal: (show: boolean) => void;
    passkeyLoading: boolean;
    newPasskeyName: string;
    setNewPasskeyName: (name: string) => void;
    authType: 'platform' | 'cross-platform';
    setAuthType: (type: 'platform' | 'cross-platform') => void;
    handleRegisterPasskey: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
    settingsTab,
    setSettingsTab,
    savedPasskeys,
    showPasskeyModal,
    setShowPasskeyModal,
    passkeyLoading,
    newPasskeyName,
    setNewPasskeyName,
    authType,
    setAuthType,
    handleRegisterPasskey
}) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-full max-w-4xl bg-slate-900 rounded-[40px] border border-teal-500/10 flex h-[650px] overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />
                <div className="w-64 bg-black/30 border-r border-teal-500/10 p-6 space-y-2 relative z-10">
                    <h2 className="px-3 py-4 text-xl font-black text-white mb-4 tracking-tighter">Control Center</h2>
                    {[
                        { id: 'general', icon: Monitor, label: 'Neural Interface' },
                        { id: 'security', icon: Lock, label: 'Access Protocol' },
                        { id: 'billing', icon: CreditCard, label: 'Power Grid' }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setSettingsTab(tab.id as any)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${settingsTab === tab.id ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'text-teal-600/60 hover:bg-white/5 hover:text-teal-100'}`}>
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </button>
                    ))}
                </div>
                <div className="flex-1 p-10 overflow-y-auto custom-scrollbar relative z-10">
                    {settingsTab === 'general' && (
                        <div className="space-y-10">
                            <div className="flex items-center justify-between border-b border-teal-500/10 pb-8">
                                <div>
                                    <h3 className="text-xl font-black text-white">Visual Mode</h3>
                                    <p className="text-sm text-teal-700/80 font-medium">Select your preferred cognitive luminance.</p>
                                </div>
                                <div className="flex p-1.5 bg-black/40 rounded-2xl border border-teal-500/10">
                                    <button className="px-6 py-2 bg-teal-500 text-white rounded-xl text-sm font-black shadow-lg">Teal Dark</button>
                                    <button className="px-6 py-2 text-teal-700 hover:text-teal-400 rounded-xl text-sm font-black transition-colors">Ocean Light</button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-white">Linguistic Core</h3>
                                    <p className="text-sm text-teal-700/80 font-medium">Primary neural communication language.</p>
                                </div>
                                <button className="px-6 py-3 bg-white/5 border border-teal-500/10 rounded-2xl text-sm font-black text-teal-400 flex items-center gap-3 hover:bg-white/10 transition-all">English (US) <ChevronDown className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )}
                    {settingsTab === 'security' && (
                        <div className="space-y-8">
                            <div className="p-8 bg-teal-950/30 rounded-[32px] border border-teal-500/10 space-y-5">
                                <h3 className="text-xl font-black text-white">Biometric & Device Auth</h3>
                                <p className="text-sm text-teal-700 leading-relaxed font-medium">Manage your registered authenticator devices.</p>

                                {savedPasskeys.length > 0 && (
                                    <div className="space-y-3 mb-6">
                                        {savedPasskeys.map((pk, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-teal-500/5 rounded-2xl border border-teal-500/20">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-teal-900/50 flex items-center justify-center text-teal-400">
                                                        {pk.transports?.includes('usb') ? <Usb className="w-5 h-5" /> : <Fingerprint className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white">{pk.name}</h4>
                                                        <p className="text-[10px] text-teal-500/60 font-medium">Added {new Date(pk.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="px-2 py-1 rounded bg-teal-500/10 text-[10px] font-black text-teal-500 uppercase">Active</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {!showPasskeyModal ? (
                                    <button
                                        onClick={() => setShowPasskeyModal(true)}
                                        className="px-6 py-3 bg-teal-600 text-white rounded-2xl text-sm font-black hover:bg-teal-500 shadow-xl shadow-teal-600/20 transition-all flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add New Passkey</span>
                                    </button>
                                ) : (
                                    <div className="p-6 bg-slate-950/50 rounded-2xl border border-teal-500/20 space-y-4 animate-in fade-in zoom-in-95">
                                        <div>
                                            <label className="text-xs font-bold text-teal-500 uppercase tracking-wider mb-1.5 block">1. Name your Device</label>
                                            <input
                                                type="text"
                                                value={newPasskeyName}
                                                onChange={(e) => setNewPasskeyName(e.target.value)}
                                                placeholder="e.g. MacBook Pro, Pixel 7, YubiKey"
                                                className="w-full bg-slate-900 border border-teal-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-teal-800 focus:outline-none focus:border-teal-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-teal-500 uppercase tracking-wider mb-2 block">2. Choose Method</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => setAuthType('platform')}
                                                    className={`p-4 rounded-xl border text-left transition-all ${authType === 'platform' ? 'bg-teal-500/20 border-teal-500' : 'bg-slate-900 border-teal-500/10 hover:border-teal-500/30'}`}
                                                >
                                                    <div className="flex items-center gap-2 mb-2 text-white">
                                                        <Laptop className="w-4 h-4" />
                                                        <span className="font-bold text-xs">This Device</span>
                                                    </div>
                                                    <p className="text-[10px] text-teal-300/60 leading-tight">Use built-in sensor (TouchID, FaceID, Hello) or PIN.</p>
                                                </button>

                                                <button
                                                    onClick={() => setAuthType('cross-platform')}
                                                    className={`p-4 rounded-xl border text-left transition-all ${authType === 'cross-platform' ? 'bg-teal-500/20 border-teal-500' : 'bg-slate-900 border-teal-500/10 hover:border-teal-500/30'}`}
                                                >
                                                    <div className="flex items-center gap-2 mb-2 text-white">
                                                        <Usb className="w-4 h-4" />
                                                        <span className="font-bold text-xs">Security Key</span>
                                                    </div>
                                                    <p className="text-[10px] text-teal-300/60 leading-tight">Hardware key (YubiKey, Titan) via USB or NFC.</p>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={handleRegisterPasskey}
                                                disabled={passkeyLoading || !newPasskeyName.trim()}
                                                className="flex-1 py-3 bg-teal-500 hover:bg-teal-400 text-teal-950 font-black rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {passkeyLoading ? 'Registering...' : 'Register Device'}
                                            </button>
                                            <button
                                                onClick={() => setShowPasskeyModal(false)}
                                                className="px-4 py-3 border border-teal-500/20 text-teal-500 font-bold rounded-xl text-sm hover:bg-teal-500/10"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {settingsTab === 'billing' && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in slide-in-from-top-4">
                            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-teal-500 to-ocean-600 flex items-center justify-center text-white shadow-2xl relative">
                                <div className="absolute inset-0 bg-white/20 rounded-[32px] blur-xl opacity-50" />
                                <Zap className="w-10 h-10 relative z-10" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-white tracking-tighter">Neuro-Free Tier</h3>
                                <p className="text-sm text-teal-700/80 font-bold max-w-xs mx-auto">Elevate to Neural+ for unlimited synaptic bursts and priority processing speeds.</p>
                            </div>
                            <button className="px-10 py-4 bg-white text-teal-950 font-black rounded-2xl shadow-2xl hover:bg-teal-50 transition-all active:scale-95 uppercase tracking-widest text-xs">Upgrade Power Core</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
