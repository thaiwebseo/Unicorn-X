"use client";

import { useState, useEffect } from 'react';
import { Search, User as UserIcon, Bot, MoreVertical, Eye, Edit2, ShieldAlert, History, X, Save, Check, Copy, ExternalLink, Mail, Calendar, Key, RefreshCcw } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
import Link from 'next/link';
import PasswordVerificationModal from '@/components/PasswordVerificationModal';

interface User {
    id: string;
    name: string | null;
    email: string;
    totalBots: number;
    runningBots: number;
    expiredBots: number;
    status: 'ACTIVE' | 'SUSPENDED';
    adminNotes: string;
    createdAt: string;
}

interface BotData {
    id: string;
    name: string;
    status: string;
    apiKey: string;
    secretKey: string;
    tradingViewEmail: string | null;
    updatedAt: string;
    startDate: string | null;
    endDate: string | null;
}

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modals state
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Edit state
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED',
        adminNotes: ''
    });
    const [saving, setSaving] = useState(false);
    const [resetting, setResetting] = useState(false);

    // Security
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenProfile = (user: User) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name || '',
            email: user.email,
            status: user.status,
            adminNotes: user.adminNotes
        });
        setIsProfileModalOpen(true);
    };

    const handleSaveProfile = async () => {
        if (!selectedUser) return;
        setSaving(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    ...editForm
                })
            });

            if (res.ok) {
                setIsProfileModalOpen(false);
                fetchUsers(); // Refresh list
            } else {
                alert('Failed to update user');
            }
        } catch (error) {
            alert('Error updating user');
        } finally {
            setSaving(false);
        }
    };

    const handleResetUser = async () => {
        if (!selectedUser) return;

        const result = await MySwal.fire({
            title: 'DANGER ZONE',
            text: `Are you sure you want to PERMANENTLY RESET data for ${selectedUser.email}? All bots, subscriptions, and orders will be deleted. This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Wipe Everything!',
            background: '#fff',
            customClass: {
                popup: 'rounded-2xl border-none shadow-xl',
                title: 'text-red-600 font-black',
                confirmButton: 'rounded-xl px-6 py-2.5 font-bold',
                cancelButton: 'rounded-xl px-6 py-2.5 font-bold'
            }
        });

        if (!result.isConfirmed) return;

        // Double check confirmation for safety
        const secondResult = await MySwal.fire({
            title: 'Final Confirmation',
            text: "Type 'RESET' to confirm permanent deletion.",
            input: 'text',
            inputPlaceholder: 'RESET',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Confirm Reset',
            preConfirm: (value) => {
                if (value !== 'RESET') {
                    Swal.showValidationMessage("Please type 'RESET' exactly");
                    return false;
                }
                return true;
            }
        });

        if (!secondResult.isConfirmed) return;

        setResetting(true);
        try {
            const res = await fetch('/api/admin/users/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedUser.id })
            });

            if (res.ok) {
                MySwal.fire({
                    title: 'Wiped!',
                    text: 'User data has been completely reset.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                setIsProfileModalOpen(false);
                fetchUsers();
            } else {
                const err = await res.text();
                MySwal.fire('Error', err, 'error');
            }
        } catch (error) {
            MySwal.fire('Error', 'Unexpected error occurred', 'error');
        } finally {
            setResetting(false);
        }
    };



    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const getBotStatusCount = (user: User) => {
        return (
            <div className="flex gap-2 text-xs font-bold">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full" title="Total Bots">
                    T: {user.totalBots}
                </span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full" title="Running Bots">
                    R: {user.runningBots}
                </span>
                <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full" title="Expired Bots">
                    E: {user.expiredBots}
                </span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-sm font-bold text-slate-600">User</th>
                            <th className="p-4 text-sm font-bold text-slate-600">Bots Summary</th>
                            <th className="p-4 text-sm font-bold text-slate-600">Joined Date</th>
                            <th className="p-4 text-sm font-bold text-slate-600">Status</th>
                            <th className="p-4 text-sm font-bold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={5} className="p-12 text-center text-slate-400">Loading users...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan={5} className="p-12 text-center text-slate-400">No users found</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{user.name || 'No Name'}</div>
                                        <div className="text-sm text-slate-400">{user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        {getBotStatusCount(user)}
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenProfile(user)}
                                                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                                            >
                                                <Edit2 size={12} />
                                                View Details
                                            </button>
                                            <Link
                                                href={`/admin/users/${user.id}/bots`}
                                                className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-bold hover:bg-cyan-100 transition-colors flex items-center gap-1.5"
                                            >
                                                <Bot size={12} />
                                                Bot Details
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Profile Detail Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                                    <UserIcon size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">User Profile Details</h3>
                                    <p className="text-sm text-slate-500">Manage basic info and admin notes</p>
                                </div>
                            </div>
                            <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Customer Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Account Status</label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                                    >
                                        <option value="ACTIVE">ACTIVE (Normal Access)</option>
                                        <option value="SUSPENDED">SUSPENDED (Banned)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Security Action</label>
                                    <button
                                        onClick={() => alert('Future Feature: Send recovery email to customer')}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Key size={14} />
                                        Reset Password
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Admin Private Notes</label>
                                <textarea
                                    rows={4}
                                    value={editForm.adminNotes}
                                    onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                                    placeholder="Write internal notes about this user here..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            <button
                                onClick={handleResetUser}
                                disabled={resetting || saving}
                                className="px-5 py-2.5 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 border border-red-100"
                            >
                                {resetting ? <span className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" /> : <RefreshCcw size={18} />}
                                Reset User Data
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving || resetting}
                                    className="px-8 py-2.5 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                                >
                                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
