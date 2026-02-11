"use client";

import React from 'react';
import { useInlineEdit } from './InlineEditProvider';
import { Edit, Save, X, Eye } from 'lucide-react';

export function AdminToolbar() {
    const { isEditing, toggleEdit, handleSave, hasUnsavedChanges, isAdmin } = useInlineEdit();

    if (!isAdmin) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end">

            {/* Edit/Save Controls */}
            {isEditing ? (
                <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="text-xs font-bold text-slate-400 px-2 py-1 text-center border-b border-slate-100 mb-1">
                        Admin Mode
                    </div>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white shadow-lg transition-all ${hasUnsavedChanges
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-slate-300 cursor-not-allowed'
                            }`}
                        disabled={!hasUnsavedChanges}
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                    <button
                        onClick={toggleEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-all"
                    >
                        <X className="w-4 h-4" />
                        Cancel / Exit
                    </button>
                </div>
            ) : (
                <button
                    onClick={toggleEdit}
                    className="flex items-center gap-2 px-5 py-3 bg-[#0B0F19] text-white rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-slate-800"
                >
                    <Edit className="w-4 h-4" />
                    Edit Page
                </button>
            )}
        </div>
    );
}
