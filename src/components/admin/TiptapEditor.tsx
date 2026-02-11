'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { FontFamily } from '@tiptap/extension-font-family';
import { Extension } from '@tiptap/core';

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
    Type,
    Highlighter,
    Quote,
    Code,
    RemoveFormatting
} from 'lucide-react';
import React, { useCallback } from 'react';

// Custom Font Size Extension
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element: HTMLElement) => element.style.fontSize.replace(/['"]+/g, ''),
                        renderHTML: (attributes: Record<string, any>) => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }: { chain: any }) => {
                return chain()
                    .setMark('textStyle', { fontSize })
                    .run();
            },
            unsetFontSize: () => ({ chain }: { chain: any }) => {
                return chain()
                    .setMark('textStyle', { fontSize: null })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const addImage = useCallback(() => {
        const url = window.prompt('URL');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    return (
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center gap-1 shadow-sm">
            {/* History */}
            <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 mr-2">
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Undo (Ctrl+Z)"
                >
                    <Undo size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Redo (Ctrl+Y)"
                >
                    <Redo size={16} />
                </button>
            </div>

            {/* Typography */}
            <div className="flex items-center gap-2 border-r border-slate-200 pr-2 mr-2">
                {/* Font Family */}
                {/* <select
                    className="h-8 px-2 text-sm border border-slate-200 rounded hover:bg-slate-50 focus:outline-none focus:border-cyan-500"
                    onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                    value={editor.getAttributes('textStyle').fontFamily || ''}
                >
                    <option value="" disabled>Font</option>
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Courier New, monospace">Courier</option>
                </select> */}

                {/* Font Size */}
                <select
                    className="h-8 px-2 text-sm border border-slate-200 rounded hover:bg-slate-50 focus:outline-none focus:border-cyan-500 w-20"
                    onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
                    value={editor.getAttributes('textStyle').fontSize || ''}
                >
                    <option value="" disabled>Size</option>
                    <option value="11pt">11</option>
                    <option value="12pt">12</option>
                    <option value="14pt">14</option>
                    <option value="16pt">16</option>
                    <option value="18pt">18</option>
                    <option value="24pt">24</option>
                    <option value="30pt">30</option>
                    <option value="36pt">36</option>
                    <option value="48pt">48</option>
                    <option value="60pt">60</option>
                    <option value="72pt">72</option>
                    <option value="96pt">96</option>
                </select>

                {/* Headings */}
                <select
                    className="h-8 px-2 text-sm border border-slate-200 rounded hover:bg-slate-50 focus:outline-none focus:border-cyan-500"
                    onChange={(e) => {
                        const level = parseInt(e.target.value);
                        if (level === 0) {
                            editor.chain().focus().setParagraph().run();
                        } else {
                            editor.chain().focus().toggleHeading({ level: level as any }).run();
                        }
                    }}
                    value={editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : '0'}
                >
                    <option value="0">Normal Text</option>
                    <option value="1">Heading 1</option>
                    <option value="2">Heading 2</option>
                    <option value="3">Heading 3</option>
                </select>
            </div>


            {/* Formatting */}
            <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 mr-2">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('bold') ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Bold (Ctrl+B)"
                >
                    <Bold size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('italic') ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Italic (Ctrl+I)"
                >
                    <Italic size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('underline') ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Underline (Ctrl+U)"
                >
                    <UnderlineIcon size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('strike') ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Strikethrough"
                >
                    <Strikethrough size={16} />
                </button>

                {/* Text Color */}
                <div className="relative group">
                    <button
                        className={`p-1.5 rounded hover:bg-slate-100 flex items-center gap-1 ${editor.getAttributes('textStyle').color ? 'text-cyan-600' : ''}`}
                        title="Text Color"
                    >
                        <Type size={16} />
                        <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000' }} />
                    </button>
                    <div className="hidden group-hover:block absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-xl border border-slate-100 w-40 z-50">
                        <div className="grid grid-cols-5 gap-1">
                            {['#000000', '#444444', '#666666', '#999999', '#cccccc', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff'].map(color => (
                                <button
                                    key={color}
                                    className="w-6 h-6 rounded border border-slate-100 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    onClick={() => editor.chain().focus().setColor(color).run()}
                                />
                            ))}
                            <button
                                className="col-span-5 text-xs text-center hover:bg-slate-50 py-1 mt-1 rounded text-red-500"
                                onClick={() => editor.chain().focus().unsetColor().run()}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Highlight Color */}
                <div className="relative group">
                    <button
                        className={`p-1.5 rounded hover:bg-slate-100 flex items-center gap-1 ${editor.isActive('highlight') ? 'text-cyan-600' : ''}`}
                        title="Highlight Color"
                    >
                        <Highlighter size={16} />
                    </button>
                    <div className="hidden group-hover:block absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-xl border border-slate-100 w-40 z-50">
                        <div className="grid grid-cols-5 gap-1">
                            {['#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ff9900', '#ff0000'].map(color => (
                                <button
                                    key={color}
                                    className="w-6 h-6 rounded border border-slate-100 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                                />
                            ))}
                            <button
                                className="col-span-5 text-xs text-center hover:bg-slate-50 py-1 mt-1 rounded text-red-500"
                                onClick={() => editor.chain().focus().unsetHighlight().run()}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500"
                    title="Clear Formatting"
                >
                    <RemoveFormatting size={16} />
                </button>
            </div>

            {/* Link & Image */}
            <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 mr-2">
                <button
                    onClick={setLink}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('link') ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Insert Link"
                >
                    <LinkIcon size={16} />
                </button>
                <button
                    onClick={addImage}
                    className="p-1.5 rounded hover:bg-slate-100"
                    title="Insert Image"
                >
                    <ImageIcon size={16} />
                </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 mr-2">
                <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Align Left"
                >
                    <AlignLeft size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Align Center"
                >
                    <AlignCenter size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Align Right"
                >
                    <AlignRight size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Justify"
                >
                    <AlignJustify size={16} />
                </button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-0.5">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('bulletList') ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Bullet List"
                >
                    <List size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('orderedList') ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Numbered List"
                >
                    <ListOrdered size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('blockquote') ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Quote"
                >
                    <Quote size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('codeBlock') ? 'bg-cyan-50 text-cyan-600' : ''}`}
                    title="Code Block"
                >
                    <Code size={16} />
                </button>
            </div>
        </div>
    );
};

export default function TiptapEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-cyan-600 hover:underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full my-4',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            FontFamily,
            FontSize,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none min-h-[500px] max-w-none',
            },
        },
        immediatelyRender: false // Resolve hydration mismatch
    });

    // Sync value prop with editor content when value changes externally (e.g., after import)
    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, { emitUpdate: false });
        }
    }, [value, editor]);


    return (
        <div className="bg-[#F9FBFD] border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[700px]">
            <MenuBar editor={editor} />
            <div className="flex-1 overflow-y-auto w-full flex justify-center p-4 md:p-8 cursor-text" onClick={() => editor?.commands.focus()}>
                <div
                    className="w-full max-w-[850px] bg-white shadow-md min-h-[800px] mb-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
}
