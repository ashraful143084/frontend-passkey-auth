import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { startRegistration } from '@simplewebauthn/browser';
import { mockPasskeyService } from '../services/mockPasskeyService';

// Child Components
import { Sidebar } from './dashboard/Sidebar';
import { ChatView } from './dashboard/ChatView';
import { SettingsView } from './dashboard/SettingsView';
import { ProfileView } from './dashboard/ProfileView';
import { CollectionsView } from './dashboard/CollectionsView';
import { DashboardHeader } from './dashboard/DashboardHeader';

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

        console.log('authType', authType, 'newPasskeyName', newPasskeyName);

        setPasskeyLoading(true);
        try {
            const options = mockPasskeyService.getRegistrationOptions(newPasskeyName, authType);
            console.log('options', options);
            const attResp = await startRegistration({ optionsJSON: options });
            console.log('attResp', attResp);
            const verified = await mockPasskeyService.verifyRegistration(attResp, newPasskeyName);
            console.log('verified', verified);

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

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden text-teal-100 font-sans selection:bg-teal-500/40 selection:text-white">
            <Sidebar
                sidebarRef={sidebarRef as React.RefObject<HTMLDivElement>}
                setIsSidebarOpen={setIsSidebarOpen}
                chatGroups={chatGroups}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
                currentView={currentView}
                setCurrentView={setCurrentView}
                handleNewChat={handleNewChat}
                deleteChat={deleteChat}
                onLogout={onLogout}
            />

            <main ref={mainRef} className="flex-1 flex flex-col h-full relative z-30 transition-all duration-500 bg-slate-950">
                <DashboardHeader
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    onLogout={onLogout}
                    setCurrentView={setCurrentView}
                />

                <div className="flex-1 overflow-hidden h-full relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.03)_0%,transparent_70%)] pointer-events-none" />
                    {currentView === 'chat' && (
                        <ChatView
                            messages={messages}
                            activeChatId={activeChatId}
                            input={input}
                            setInput={setInput}
                            handleSend={handleSend}
                            messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
                        />
                    )}
                    {currentView === 'settings' && (
                        <SettingsView
                            settingsTab={settingsTab}
                            setSettingsTab={setSettingsTab}
                            savedPasskeys={savedPasskeys}
                            showPasskeyModal={showPasskeyModal}
                            setShowPasskeyModal={setShowPasskeyModal}
                            passkeyLoading={passkeyLoading}
                            newPasskeyName={newPasskeyName}
                            setNewPasskeyName={setNewPasskeyName}
                            authType={authType}
                            setAuthType={setAuthType}
                            handleRegisterPasskey={handleRegisterPasskey}
                        />
                    )}
                    {currentView === 'profile' && <ProfileView />}
                    {currentView === 'collections' && <CollectionsView />}
                </div>
            </main>

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
