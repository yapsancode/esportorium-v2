"use client";

import React from 'react';
import { Mail, Shield, Award, MapPin, CreditCard, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Organizer Profile</h2>
                <p className="text-slate-500">Manage your account and subscription plan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Info Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <div className="relative inline-block mb-4">
                            <img src="https://ui-avatars.com/api/?name=Organizer+Pro&background=2563eb&color=fff&size=128" alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-100 shadow-md mx-auto" />
                            <div className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full border-2 border-white">
                                <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">MPL Organizer MY</h3>
                        <p className="text-slate-500 text-sm mb-4">Joined Jan 2024</p>

                        <div className="flex justify-center gap-2 mb-6">
                            <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold border border-brand-100">
                                Verified Organizer
                            </span>
                        </div>

                        <div className="space-y-3 text-left">
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <Mail className="w-4 h-4" />
                                <span>organizer@esports.my</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>Kuala Lumpur, Malaysia</span>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm">
                            Edit Profile
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-brand-500" /> Security
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Two-Factor Auth</span>
                                <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">Enabled</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Password</span>
                                <button className="text-brand-600 text-xs font-bold hover:underline">Change</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plan Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Award className="w-48 h-48 text-brand-600 transform rotate-12 translate-x-12 -translate-y-12" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-1">Current Plan</h3>
                                    <h2 className="text-3xl font-display font-bold text-slate-900">Pro Organizer</h2>
                                    <p className="text-slate-500 mt-1">Everything you need to run professional leagues.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-slate-900">RM 199<span className="text-sm text-slate-400 font-normal">/mo</span></p>
                                    <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded mt-2 inline-block">Active</span>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 my-6"></div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-brand-500" />
                                    <span className="text-slate-700 font-medium">Unlimited Tournaments</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-brand-500" />
                                    <span className="text-slate-700 font-medium">Up to 256 Participants</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-brand-500" />
                                    <span className="text-slate-700 font-medium">Advanced AI Analytics</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-brand-500" />
                                    <span className="text-slate-700 font-medium">Priority Support (MY)</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-brand-500/20">
                                    Upgrade Plan
                                </button>
                                <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold transition-colors">
                                    Billing Details
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-slate-400" /> Billing History
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Date</th>
                                        <th className="px-4 py-3">Description</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3 rounded-r-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-4 py-4">Oct 01, 2024</td>
                                        <td className="px-4 py-4">Pro Plan - Monthly</td>
                                        <td className="px-4 py-4 font-bold text-slate-900">RM 199.00</td>
                                        <td className="px-4 py-4"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">Paid</span></td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-4">Sep 01, 2024</td>
                                        <td className="px-4 py-4">Pro Plan - Monthly</td>
                                        <td className="px-4 py-4 font-bold text-slate-900">RM 199.00</td>
                                        <td className="px-4 py-4"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">Paid</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
