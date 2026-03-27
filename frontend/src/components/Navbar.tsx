"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { BookOpen, LogOut, User, Menu, ShieldCheck } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
    const { user, logout } = useStore();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (!mounted) return null;

    return (
        <>
            <div className="w-full bg-primary-950 text-slate-300 py-1 border-b border-primary-900 border-opacity-50 text-xs sm:text-sm font-medium">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center z-50 relative">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-accent-gold-400" />
                        <span className="hidden sm:inline">Official Scholarship Discovery Platform</span>
                        <span className="sm:hidden">Govt Auth Portal</span>
                    </div>
                </div>
            </div>

            <nav className="w-full bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="bg-primary-50 p-2.5 rounded-xl border border-primary-100 group-hover:bg-primary-100 transition-colors">
                                <BookOpen className="text-primary-700 w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-2xl tracking-tight text-primary-900 leading-none">
                                    ScholarDoc Hub
                                </span>
                                <span className="text-xs font-semibold text-primary-600 tracking-wider">
                                    DISCOVER. APPLY. SUCCEED.
                                </span>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
                            <Link href="/" className={`${pathname === '/' ? 'text-primary-700 font-semibold' : 'hover:text-primary-700'} transition-colors`}>Home</Link>
                            <Link href="/dashboard" className={`${pathname === '/dashboard' ? 'text-primary-700 font-semibold' : 'hover:text-primary-700'} transition-colors`}>Scholarships</Link>
                            <Link href="/how-it-works" className={`${pathname === '/how-it-works' ? 'text-primary-700 font-semibold' : 'hover:text-primary-700'} transition-colors`}>How It Works</Link>
                            <Link
                                href="/about"
                                className={`${pathname === '/about' ? 'text-primary-700 font-bold bg-primary-50' : 'hover:text-primary-700 bg-slate-100'} transition-colors uppercase text-[11px] tracking-widest font-bold px-3 py-1 rounded-full`}
                            >
                                About
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    {user.role === "admin" && (
                                        <Link href="/admin" className="text-accent-gold-600 hover:text-accent-gold-500 font-semibold transition-colors">
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center gap-3">
                                    <Link href="/login" className="premium-button-secondary py-2">
                                        Login
                                    </Link>
                                    <Link href="/register" className="premium-button-primary py-2 px-5">
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            <button className="md:hidden p-2 text-slate-600">
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
