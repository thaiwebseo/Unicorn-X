"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getNested, setNested } from '@/utils/object';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

interface InlineEditContextType {
    isEditing: boolean;
    toggleEdit: () => void;
    data: any;
    updateField: (path: string, value: any) => void;
    handleSave: () => Promise<void>;
    hasUnsavedChanges: boolean;
    isAdmin: boolean;
}

const InlineEditContext = createContext<InlineEditContextType | undefined>(undefined);

interface InlineEditProviderProps {
    children: React.ReactNode;
    initialData: any;
    apiEndpoint: string; // URL to PUT updated data
    onSaveSuccess?: (newData: any) => void;
}

export function InlineEditProvider({ children, initialData, apiEndpoint, onSaveSuccess }: InlineEditProviderProps) {
    const { data: session } = useSession() as any;
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState(initialData);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Sync state with initialData if it changes (e.g. after fetch)
    useEffect(() => {
        if (initialData) {
            setData(initialData);
        }
    }, [initialData]);

    const isAdmin = session?.user?.role === 'ADMIN';

    const toggleEdit = useCallback(() => {
        if (!isAdmin) return;
        if (isEditing && hasUnsavedChanges) {
            // Confirm discard? For now just toggle off and revert (reload page or reset data? Reset data is better)
            Swal.fire({
                title: 'Discard Changes?',
                text: "You have unsaved changes. Discard them?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Discard'
            }).then((result) => {
                if (result.isConfirmed) {
                    setData(initialData); // Revert
                    setHasUnsavedChanges(false);
                    setIsEditing(false);
                }
            });
        } else {
            setIsEditing(prev => !prev);
        }
    }, [isEditing, hasUnsavedChanges, initialData, isAdmin]);

    const updateField = useCallback((path: string, value: any) => {
        setData((prevData: any) => {
            // Clone deep enough or use structuredClone
            let newData;
            try {
                newData = structuredClone(prevData);
            } catch (e) {
                // Fallback for older environments if needed, but Next.js usually supports this
                newData = JSON.parse(JSON.stringify(prevData));
            }

            setNested(newData, path, value);
            return newData;
        });
        setHasUnsavedChanges(true);
    }, []);

    const handleSave = useCallback(async () => {
        if (!hasUnsavedChanges) {
            setIsEditing(false);
            return;
        }

        try {
            Swal.fire({
                title: 'Saving...',
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const res = await fetch(apiEndpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to save');

            const updatedData = await res.json();

            // Update local state to match saved data (so discard warning works correctly next time)
            setData(updatedData);
            setHasUnsavedChanges(false);
            setIsEditing(false);

            if (onSaveSuccess) onSaveSuccess(updatedData);

            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Your changes have been published.',
                timer: 1500,
                showConfirmButton: false
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save changes.',
            });
        }
    }, [data, apiEndpoint, hasUnsavedChanges, onSaveSuccess]);

    return (
        <InlineEditContext.Provider value={{
            isEditing,
            toggleEdit,
            data,
            updateField,
            handleSave,
            hasUnsavedChanges,
            isAdmin: !!isAdmin
        }}>
            {children}
        </InlineEditContext.Provider>
    );
}

export function useInlineEdit() {
    const context = useContext(InlineEditContext);
    if (!context) {
        throw new Error('useInlineEdit must be used within an InlineEditProvider');
    }
    return context;
}
