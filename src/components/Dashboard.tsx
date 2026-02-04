import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
    Plus,
    MessageSquare,
    Settings as SettingsIcon,
    LogOut,
    Send,
    Menu,
    X,
    ChevronDown,
    Zap,
    LayoutDashboard,
    BrainCircuit,
    Code,
    Lock,
    Database,
    Share2,
    Trash2,
    MoreHorizontal,
    ThumbsUp,
    RefreshCw,
    Copy,
    CreditCard,
    Monitor,
    ShieldCheck,
    History as HistoryIcon,
    Fingerprint,
    ScanFace,
    Key,
    Smartphone,
    Laptop,
    Usb
} from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';
import { mockPasskeyService } from '../services/mockPasskeyService';

interface SidebarItemProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, active, onClick, onDelete }) => (
    <div className="group relative">
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_15px_-5px_var(--color-teal-500/30)]'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <MessageSquare className={`w-4 h-4 flex-shrink-0 ${active ? 'text-teal-400' : 'text-gray-500'}`} />
            <span className="truncate pr-8">{label}</span>
        </button>
        {active && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); onDelete?.(); }} className="p-1 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        )}
        {!active && (
            <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-white transition-all">
                <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
        )}
    </div>
);

type View = 'chat' | 'settings' | 'profile' | 'collections';
type SettingsTab = 'general' | 'security' | 'personalization' | 'billing';

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentView, setCurrentView] = useState<View>('chat');
    const [settingsTab, setSettingsTab] = useState<SettingsTab>('general');
    const [activeChatId, setActiveChatId] = useState<string>('1');
    const [input, setInput] = useState('');

    // Passkey State
    const [savedPasskeys, setSavedPasskeys] = useState<any[]>([]);
    const [showPasskeyModal, setShowPasskeyModal] = useState(false);
    const [passkeyLoading, setPasskeyLoading] = useState(false);
    const [newPasskeyName, setNewPasskeyName] = useState('');
    const [authType, setAuthType] = useState<'platform' | 'cross-platform'>('platform');

    useEffect(() => {
        setSavedPasskeys(mockPasskeyService.getRegisteredPasskeys());
    }, []);

    const [messages, setMessages] = useState<Record<string, Array<{ role: 'user' | 'ai', content: string }>>>({
        '1': [
            { role: 'ai', content: "Hello! I'm BrainBoosterAI, your specialized cognitive assistant. Our system is now optimized with the Teal-Ocean intelligence layers. How can I help you today?" }
        ],
        '2': [
            { role: 'ai', content: "Neural link established. Quantum processing at peak efficiency. Ready for your query." }
        ]
    });

    const [chatGroups, setChatGroups] = useState([
        {
            title: 'Current Neurons',
            chats: [
                { id: '1', label: 'Teal Optimization' },
            ]
        },
        {
            title: 'Previous Syncs',
            chats: [
                { id: '2', label: 'Quantum Algorithm' },
            ]
        }
    ]);

    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(sidebarRef.current, {
                width: isSidebarOpen ? 280 : 0,
                duration: 0.6,
                ease: 'expo.inOut'
            });
            gsap.from(mainRef.current, { opacity: 0, scale: 0.99, duration: 0.8, ease: 'expo.out', clearProps: 'all' });
        }, [isSidebarOpen]);
        return () => ctx.revert();
    }, [isSidebarOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, activeChatId]);

    const handleSend = () => {
        if (!input.trim()) return;
        const currentMsgs = messages[activeChatId] || [];
        setMessages(prev => ({
            ...prev,
            [activeChatId]: [...currentMsgs, { role: 'user', content: input }]
        }));
        setInput('');

        setTimeout(() => {
            setMessages(prev => {
                const msgs = prev[activeChatId] || [];
                return {
                    ...prev,
                    [activeChatId]: [...msgs, { role: 'ai', content: "Cognitive analysis complete. Optimal neural pathways suggest a multidimensional approach to your inquiry." }]
                };
            });
        }, 1000);
    };

    const handleNewChat = () => {
        const newId = Date.now().toString();
        const newChat = { id: newId, label: 'Neuro-Link Evolution' };

        setChatGroups(prev => {
            const todayGroup = prev.find(g => g.title === 'Current Neurons');
            if (todayGroup) {
                return prev.map(g => g.title === 'Current Neurons' ? { ...g, chats: [newChat, ...g.chats] } : g);
            }
            return [{ title: 'Current Neurons', chats: [newChat] }, ...prev];
        });

        setMessages(prev => ({
            ...prev,
            [newId]: [{ role: 'ai', content: "Quantum neural link initialized. How shall we evolve your thoughts today?" }]
        }));
        setActiveChatId(newId);
        setCurrentView('chat');
    };

    const deleteChat = (id: string) => {
        setChatGroups(prev => prev.map(g => ({
            ...g,
            chats: g.chats.filter(c => c.id !== id)
        })).filter(g => g.chats.length > 0));
        if (activeChatId === id) {
            const remaining = chatGroups.flatMap(g => g.chats).find(c => c.id !== id);
            if (remaining) setActiveChatId(remaining.id);
        }
    };

    const handleRegisterPasskey = async () => {
        if (!newPasskeyName.trim()) {
            alert('Please give your passkey a name (e.g. "MacBook Pro")');
            return;
        }

        setPasskeyLoading(true);
        try {
            // 1. Get options with specific attachment preference
            const options = mockPasskeyService.getRegistrationOptions('John Doe', authType);

            // 2. Start WebAuthn ceremony
            const attResp = await startRegistration({ optionsJSON: options });

            // 3. Verify
            const verified = await mockPasskeyService.verifyRegistration(attResp, newPasskeyName);

            if (verified) {
                setSavedPasskeys(mockPasskeyService.getRegisteredPasskeys());
                setShowPasskeyModal(false);
                setNewPasskeyName('');
                alert('Passkey registered successfully! It is now saved for future logins.');
            } else {
                alert('Passkey registration failed');
            }
        } catch (error) {
            console.error('Passkey registration error:', error);
            if ((error as Error).name !== 'NotAllowedError') {
                alert('Failed to register Passkey. Please try again.');
            }
        } finally {
            setPasskeyLoading(false);
        }
    };

    const renderChat = () => (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
                    {(messages[activeChatId] || []).map((msg, i) => (
                        <div key={i} className={`flex gap-4 md:gap-6 ${msg.role === 'ai' ? 'items-start' : 'items-start justify-end'}`}>
                            {msg.role === 'ai' && (
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-ocean-700 flex-shrink-0 flex items-center justify-center shadow-lg shadow-teal-500/20 translate-y-1">
                                    <BrainCircuit className="w-6 h-6 text-white" />
                                </div>
                            )}
                            <div className={`group relative max-w-[85%] md:max-w-[75%] ${msg.role === 'user'
                                ? 'bg-teal-950/40 border border-teal-500/20 px-5 py-3 rounded-[24px] text-teal-50 shadow-xl'
                                : 'text-[#ececec] py-2 leading-relaxed tracking-wide'
                                }`}>
                                <div className="prose prose-invert text-[15px] font-normal leading-relaxed">
                                    {msg.content}
                                </div>
                                {msg.role === 'ai' && (
                                    <div className="mt-5 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-teal-500/10 rounded-xl text-teal-400/60 hover:text-teal-400 transition-all"><Copy className="w-4 h-4" /></button>
                                        <button className="p-2 hover:bg-teal-500/10 rounded-xl text-teal-400/60 hover:text-teal-400 transition-all"><ThumbsUp className="w-4 h-4" /></button>
                                        <button className="p-2 hover:bg-teal-500/10 rounded-xl text-teal-400/60 hover:text-teal-400 transition-all"><RefreshCw className="w-4 h-4" /></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            <div className="p-6 md:p-10 pt-0">
                <div className="max-w-3xl mx-auto relative group">
                    <div className="relative flex items-end gap-3 bg-teal-950/20 border border-teal-500/10 rounded-[32px] p-2.5 pl-5 md:pl-7 focus-within:border-teal-500/40 focus-within:bg-teal-950/30 transition-all shadow-2xl backdrop-blur-md">
                        <textarea
                            placeholder="Message BrainBoosterAI..."
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                            }}
                            className="flex-1 bg-transparent py-4 resize-none outline-none text-teal-50 placeholder-teal-700/60 text-[15px] max-h-[200px] custom-scrollbar"
                        />
                        <div className="pb-2 pr-2">
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className={`p-3 md:p-3.5 rounded-2xl transition-all shadow-xl ${input.trim()
                                    ? 'bg-gradient-to-br from-teal-500 to-ocean-600 text-white hover:shadow-teal-500/30 active:scale-95'
                                    : 'bg-white/5 text-teal-900 cursor-not-allowed'
                                    }`}
                            >
                                <Send className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-teal-800 font-black uppercase tracking-widest mt-4">
                        Neural sync active • v8.4 Quantum Intelligence
                    </p>
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
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
                        <button key={tab.id} onClick={() => setSettingsTab(tab.id as SettingsTab)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${settingsTab === tab.id ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'text-teal-600/60 hover:bg-white/5 hover:text-teal-100'}`}>
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

    const renderProfile = () => (
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

    const renderCollections = () => (
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

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden text-teal-100 font-sans selection:bg-teal-500/40 selection:text-white">
            {/* Sidebar - Transition handled by CSS classes for layout adjustment, GSAP for width */}
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

            {/* Main Content Area */}
            <main ref={mainRef} className="flex-1 flex flex-col h-full relative z-30 transition-all duration-500 bg-slate-950">
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

                <div className="flex-1 overflow-hidden h-full relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.03)_0%,transparent_70%)] pointer-events-none" />
                    {currentView === 'chat' && renderChat()}
                    {currentView === 'settings' && renderSettings()}
                    {currentView === 'profile' && renderProfile()}
                    {currentView === 'collections' && renderCollections()}
                </div>
            </main>

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(20, 184, 166, 0.1); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(20, 184, 166, 0.3); }
      `}} />
        </div>
    );
};

export default Dashboard;
