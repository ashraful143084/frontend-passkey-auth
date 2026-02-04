import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail, Lock, User, ArrowRight, BrainCircuit, Fingerprint, ScanFace } from 'lucide-react';
import { startAuthentication } from '@simplewebauthn/browser';
import { mockPasskeyService } from '../services/mockPasskeyService';

interface AuthProps {
    onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [passkeyLoading, setPasskeyLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                opacity: 0,
                y: 40,
                scale: 0.95,
                duration: 1.2,
                ease: 'expo.out'
            });

            gsap.from('.auth-el', {
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.4
            });

            // Background glow animation
            gsap.to('.bg-glow', {
                opacity: 0.6,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const toggleAuth = () => {
        gsap.to(formRef.current, {
            opacity: 0,
            filter: 'blur(10px)',
            x: isLogin ? -30 : 30,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => {
                setIsLogin(!isLogin);
                gsap.fromTo(formRef.current,
                    { opacity: 0, filter: 'blur(10px)', x: isLogin ? 30 : -30 },
                    { opacity: 1, filter: 'blur(0px)', x: 0, duration: 0.4, ease: 'power2.out' }
                );
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    const handlePasskeyLogin = async () => {
        setPasskeyLoading(true);
        try {
            // 1. Get options from server (mock)
            const options = mockPasskeyService.getAuthenticationOptions();

            // 2. Start WebAuthn ceremony
            const asseResp = await startAuthentication({ optionsJSON: options });

            // 3. Verify with server (mock)
            const verified = await mockPasskeyService.verifyAuthentication(asseResp);

            if (verified) {
                onLogin();
            } else {
                alert('Passkey verification failed');
            }
        } catch (error) {
            console.error('Passkey error:', error);
            // Don't alert if user cancelled to avoid annoyance
            if ((error as Error).name !== 'NotAllowedError') {
                // In a real app, you might show a toast here
                // for now console error is enough as per instructions to keep it simple or user might see alert
                alert('Failed to sign in with Passkey. Use password if issue persists.');
            }
        } finally {
            setPasskeyLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden relative font-sans">
            {/* Dynamic Background Elements */}
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-ocean-600/20 blur-[120px] rounded-full bg-glow opacity-30" />
            <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full bg-glow opacity-30" />

            <div ref={cardRef} className="max-w-md w-full mx-4 relative z-10 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-ocean-500 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative bg-slate-900/80 backdrop-blur-2xl p-10 rounded-3xl border border-teal-500/10 shadow-2xl">
                    <div className="text-center space-y-4 mb-10">
                        <div className="auth-el inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-teal-500 to-ocean-600 shadow-xl shadow-teal-500/20 mb-2">
                            <BrainCircuit className="text-white w-8 h-8" />
                        </div>
                        <h1 className="auth-el text-4xl font-black text-white tracking-tighter">
                            BrainBooster<span className="text-teal-500">AI</span>
                        </h1>
                        <p className="auth-el text-slate-400 text-sm font-medium">
                            {isLogin ? 'Welcome back! Please log in to continue.' : 'Create an account to get started.'}
                        </p>
                    </div>

                    <div ref={formRef} className="space-y-6">
                        {isLogin && (
                            <div className="auth-el spacer-passkey mb-6">
                                <button
                                    onClick={handlePasskeyLogin}
                                    disabled={passkeyLoading}
                                    type="button"
                                    className="w-full relative overflow-hidden bg-slate-800 hover:bg-slate-700 border border-teal-500/20 text-white font-semibold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                                >
                                    {passkeyLoading ? (
                                        <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <div className="flex -space-x-1">
                                                <ScanFace className="w-5 h-5 text-teal-400" />
                                                <Fingerprint className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <span>Sign in with Passkey</span>
                                        </>
                                    )}
                                </button>
                                <div className="text-center mt-4">
                                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Or with email</span>
                                </div>
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="auth-el relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="w-full bg-slate-950/50 border border-teal-500/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:bg-slate-950/80 transition-all text-sm"
                                        required
                                    />
                                </div>
                            )}
                            <div className="auth-el relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-slate-950/50 border border-teal-500/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:bg-slate-950/80 transition-all text-sm"
                                    required
                                />
                            </div>
                            <div className="auth-el relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-slate-950/50 border border-teal-500/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:bg-slate-950/80 transition-all text-sm"
                                    required
                                />
                            </div>

                            <div className="auth-el pt-2">
                                <button
                                    type="submit"
                                    className="w-full relative overflow-hidden bg-gradient-to-r from-teal-500 to-ocean-600 hover:from-teal-400 hover:to-ocean-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-xl shadow-teal-500/20 active:scale-[0.98]"
                                >
                                    <span className="relative z-10">{isLogin ? 'Log In' : 'Sign Up'}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                        </form>

                        <div className="auth-el text-center">
                            <button
                                onClick={toggleAuth}
                                className="text-sm font-medium text-slate-400 hover:text-teal-400 transition-colors py-2"
                            >
                                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
