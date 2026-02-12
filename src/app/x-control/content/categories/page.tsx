
"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, GripVertical } from 'lucide-react';
import Swal from 'sweetalert2';

interface Category {
    id: string;
    name: string;
    description: string | null;
    sortOrder: number;
    isActive: boolean;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Category>>({});
    const [isCreating, setIsCreating] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', sortOrder: 0, isActive: true });

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/pricing-categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
                // Set next sort order
                const maxOrder = data.reduce((max: number, c: Category) => Math.max(max, c.sortOrder), 0);
                setNewCategory(prev => ({ ...prev, sortOrder: maxOrder + 1 }));
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to fetch categories', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async () => {
        if (!newCategory.name) return Swal.fire('Error', 'Name is required', 'warning');

        try {
            const res = await fetch('/api/admin/pricing-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory)
            });

            if (res.ok) {
                Swal.fire('Success', 'Category created', 'success');
                setIsCreating(false);
                setNewCategory({ name: '', description: '', sortOrder: 0, isActive: true });
                fetchCategories();
            } else {
                throw new Error('Failed to create');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to create category', 'error');
        }
    };

    const handleUpdate = async (id: string) => {
        try {
            const res = await fetch('/api/admin/pricing-categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...editForm })
            });

            if (res.ok) {
                Swal.fire('Success', 'Category updated', 'success');
                setIsEditing(null);
                fetchCategories();
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update category', 'error');
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/pricing-categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: newStatus })
            });

            if (res.ok) {
                // Update local state for immediate feedback
                setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: newStatus } : c));
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/admin/pricing-categories?id=${id}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    Swal.fire('Deleted!', 'Category has been deleted.', 'success');
                    fetchCategories();
                } else {
                    throw new Error('Failed to delete');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete category', 'error');
            }
        }
    };

    const startEditing = (category: Category) => {
        setIsEditing(category.id);
        setEditForm({ ...category });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Pricing Categories</h1>
                    <p className="text-slate-500">Manage categories and their display order.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    disabled={isCreating}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors shadow-sm shadow-cyan-500/30 font-medium"
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            {/* Create Form */}
            {isCreating && (
                <div className="bg-cyan-50 border border-cyan-100 p-6 rounded-xl animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-cyan-800 mb-4 flex items-center gap-2">
                        <Plus size={18} /> New Category
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-cyan-700 mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Smart Timer DCA"
                                value={newCategory.name}
                                onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border-cyan-200 focus:ring-cyan-500"
                            />
                        </div>
                        <div className="md:col-span-6">
                            <label className="block text-xs font-bold text-cyan-700 mb-1">Description</label>
                            <input
                                type="text"
                                placeholder="Short description for the tab"
                                value={newCategory.description}
                                onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border-cyan-200 focus:ring-cyan-500"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-cyan-700 mb-1">Order</label>
                            <input
                                type="number"
                                value={newCategory.sortOrder}
                                onChange={e => setNewCategory({ ...newCategory, sortOrder: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 rounded-lg border-cyan-200 focus:ring-cyan-500 text-center"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-cyan-700 mb-1">Status</label>
                            <label className="relative inline-flex items-center cursor-pointer pt-2">
                                <input
                                    type="checkbox"
                                    checked={newCategory.isActive}
                                    onChange={e => setNewCategory({ ...newCategory, isActive: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                            </label>
                        </div>
                        <div className="md:col-span-2 flex gap-2 pt-6">
                            <button onClick={handleCreate} className="flex-1 bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700">Save</button>
                            <button onClick={() => setIsCreating(false)} className="px-3 bg-white text-slate-500 border border-slate-200 py-2 rounded-lg hover:bg-slate-50">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold">
                        <tr>
                            <th className="px-6 py-4 w-16 text-center">Order</th>
                            <th className="px-6 py-4 w-1/4">Name</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4 w-24 text-center">Status</th>
                            <th className="px-6 py-4 w-32 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr><td colSpan={4} className="text-center py-8 text-slate-400">Loading categories...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-8 text-slate-400">No categories found.</td></tr>
                        ) : (
                            categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 text-center">
                                        {isEditing === cat.id ? (
                                            <input
                                                type="number"
                                                value={editForm.sortOrder}
                                                onChange={e => setEditForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) }))}
                                                className="w-16 text-center px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                                                {cat.sortOrder}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {isEditing === cat.id ? (
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-3 py-1 border rounded"
                                            />
                                        ) : cat.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {isEditing === cat.id ? (
                                            <input
                                                type="text"
                                                value={editForm.description || ''}
                                                onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                                className="w-full px-3 py-1 border rounded"
                                            />
                                        ) : cat.description}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => {
                                                if (isEditing === cat.id) {
                                                    setEditForm(prev => ({ ...prev, isActive: !prev.isActive }));
                                                } else {
                                                    handleUpdateStatus(cat.id, !cat.isActive);
                                                }
                                            }}
                                            className={`relative inline-flex items-center cursor-pointer transition-opacity ${isEditing !== cat.id ? 'hover:opacity-80' : ''}`}
                                        >
                                            <div className={`w-11 h-6 rounded-full transition-colors ${((isEditing === cat.id ? editForm.isActive : cat.isActive))
                                                ? 'bg-cyan-500'
                                                : 'bg-slate-300'
                                                }`}>
                                                <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 after:w-5 transition-transform ${((isEditing === cat.id ? editForm.isActive : cat.isActive))
                                                    ? 'translate-x-[20px]'
                                                    : 'translate-x-0'
                                                    }`} style={{ width: '20px' }}></div>
                                            </div>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {isEditing === cat.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdate(cat.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                                                        title="Save"
                                                    >
                                                        <Save size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditing(null)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                        title="Cancel"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEditing(cat)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
