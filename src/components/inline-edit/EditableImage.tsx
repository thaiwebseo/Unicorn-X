"use client";

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { useInlineEdit } from './InlineEditProvider';
import { getNested } from '@/utils/object';
import Swal from 'sweetalert2';
import { Edit } from 'lucide-react';

interface EditableImageProps extends Omit<ImageProps, 'src'> {
    path: string; // Path to image URL in data
    fallbackSrc?: string;
}

export function EditableImage({ path, fallbackSrc = '/images/placeholder.png', className, alt, ...props }: EditableImageProps) {
    const { isEditing, data, updateField } = useInlineEdit();
    const src = getNested(data, path) || fallbackSrc;

    const handleClick = async (e: React.MouseEvent) => {
        if (!isEditing) return;
        e.preventDefault();

        // Simple URL input for Phase 1
        const { value: url } = await Swal.fire({
            title: 'Update Image URL',
            input: 'url',
            inputLabel: 'Enter the new image URL',
            inputValue: src,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write something!';
                }
                return null;
            }
        });

        if (url && url !== src) {
            updateField(path, url);
        }
    };

    return (
        <div className={`relative group ${isEditing ? 'cursor-pointer' : ''} ${className}`} onClick={handleClick}>
            <Image
                src={src}
                alt={alt || 'Editable Image'}
                className={`w-full h-full object-cover transition-all ${isEditing ? 'group-hover:opacity-80' : ''}`}
                {...props}
            />
            {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <Edit className="w-8 h-8 text-white drop-shadow-md" />
                </div>
            )}
        </div>
    );
}
