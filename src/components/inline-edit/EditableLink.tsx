"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useInlineEdit } from './InlineEditProvider';
import { getNested } from '@/utils/object';
import { Settings, Save, X } from 'lucide-react';

interface EditableLinkProps {
    textPath: string; // Path to link text
    hrefPath: string; // Path to href
    className?: string; // Class for the link/button
    defaultText?: string;
    defaultHref?: string;
}

export function EditableLink({
    textPath,
    hrefPath,
    className,
    defaultText = 'Click Me',
    defaultHref = '#'
}: EditableLinkProps) {
    const { isEditing, data, updateField } = useInlineEdit();
    const [showSettings, setShowSettings] = useState(false);

    // Get current values from data
    const text = getNested(data, textPath) || defaultText;
    const href = getNested(data, hrefPath) || defaultHref;

    // Local state for the popover inputs
    const [tempText, setTempText] = useState(text);
    const [tempHref, setTempHref] = useState(href);

    // Refs for positioning
    const triggerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

    // Sync local state when popover opens or data changes
    useEffect(() => {
        if (showSettings) {
            setTempText(text);
            setTempHref(href);

            // Calculate position
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const scrollY = window.scrollY;
                const scrollX = window.scrollX;

                // Position below the element, centered
                setPopoverPos({
                    top: rect.bottom + scrollY + 10,
                    left: rect.left + scrollX + (rect.width / 2)
                });
            }
        }
    }, [showSettings, text, href]);

    // Handle clicking outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if click is inside popover or trigger
            if (popoverRef.current && popoverRef.current.contains(event.target as Node)) {
                return;
            }
            if (triggerRef.current && triggerRef.current.contains(event.target as Node)) {
                return;
            }
            setShowSettings(false);
        };

        if (showSettings) {
            document.addEventListener('mousedown', handleClickOutside);
            // Handle scroll or resize to update position or close?
            // For simplicity, let's close on scroll to avoid floating issues
            window.addEventListener('scroll', () => setShowSettings(false), { capture: true });
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', () => setShowSettings(false), { capture: true });
        };
    }, [showSettings]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (tempText !== text) updateField(textPath, tempText);
        if (tempHref !== href) updateField(hrefPath, tempHref);

        setShowSettings(false);
    };

    if (!isEditing) {
        return (
            <Link href={href} className={className}>
                {text}
            </Link>
        );
    }

    return (
        <>
            <div
                ref={triggerRef}
                className={`relative inline-block group ${className} cursor-pointer border-2 border-transparent hover:border-cyan-400`}
                onClick={(e) => {
                    e.preventDefault();
                    setShowSettings(!showSettings);
                }}
            >
                {text}
                <div className="absolute -top-3 -right-3 bg-cyan-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings className="w-3 h-3" />
                </div>
            </div>

            {/* Render Popover in Portal */}
            {showSettings && createPortal(
                <div
                    ref={popoverRef}
                    style={{
                        top: popoverPos.top,
                        left: popoverPos.left,
                        transform: 'translateX(-50%)'
                    }}
                    className="absolute z-[9999] w-72 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 text-left animate-in fade-in zoom-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-slate-700 text-sm">Edit Link Settings</h4>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Button Text</label>
                            <input
                                type="text"
                                value={tempText}
                                onChange={(e) => setTempText(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Destination URL</label>
                            <input
                                type="text"
                                value={tempHref}
                                onChange={(e) => setTempHref(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            className="w-full flex items-center justify-center gap-2 bg-[#00C2CC] text-white py-2 rounded-lg font-bold text-sm hover:bg-cyan-600 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
