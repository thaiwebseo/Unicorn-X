"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useInlineEdit } from './InlineEditProvider';
import { getNested } from '@/utils/object';

interface EditableTextProps {
    path: string;
    tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
    className?: string;
    placeholder?: string;
    renderHtml?: boolean; // If true, use purely contentEditable with HTML
}

export function EditableText({ path, tagName = 'div', className = '', placeholder = 'Empty', renderHtml = false }: EditableTextProps) {
    const { isEditing, data, updateField } = useInlineEdit();
    const content = getNested(data, path) || '';
    const [localValue, setLocalValue] = useState(content);

    // Sync local value with data when data changes (e.g. invalidation/reset)
    useEffect(() => {
        setLocalValue(getNested(data, path) || '');
    }, [data, path]);

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        const newValue = e.currentTarget.innerText; // safer than innerHTML for simple text
        if (newValue !== content) {
            updateField(path, newValue);
        }
    };

    const handleInput = (e: React.FormEvent<HTMLElement>) => {
        // We could update state here if we want real-time validation or mirroring
        // setLocalValue(e.currentTarget.innerText);
    };

    const Tag = tagName as any;

    if (!isEditing) {
        return (
            <Tag className={className}>
                {content}
            </Tag>
        );
    }

    return (
        <Tag
            contentEditable
            suppressContentEditableWarning
            className={`${className} outline-none ring-2 ring-transparent hover:ring-cyan-300 focus:ring-cyan-500 rounded px-1 transition-all cursor-text min-w-[20px]`}
            onBlur={handleBlur}
            onInput={handleInput}
            data-placeholder={placeholder}
        >
            {content}
        </Tag>
    );
}
