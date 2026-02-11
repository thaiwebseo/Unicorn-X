'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface TinyMCEEditorProps {
    value: string;
    onChange: (html: string) => void;
}

export default function TinyMCEEditor({ value, onChange }: TinyMCEEditorProps) {
    const editorRef = useRef<any>(null);

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <Editor
                apiKey="3781fq8g7wtxn7rdw9mcy9wra31lxczcc6hy7brvwb65x27s"
                onInit={(_evt, editor) => editorRef.current = editor}
                value={value}
                onEditorChange={(content) => onChange(content)}
                init={{
                    height: 700,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks fontsize | ' +
                        'bold italic underline strikethrough forecolor backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    font_size_formats: '8pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt',
                    content_style: `
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
                            font-size: 14px;
                            line-height: 1.6;
                            padding: 20px;
                        }
                        h1 { font-size: 2em; margin: 0.67em 0; }
                        h2 { font-size: 1.5em; margin: 0.75em 0; }
                        h3 { font-size: 1.17em; margin: 0.83em 0; }
                        h4 { font-size: 1em; margin: 1.12em 0; }
                        p { margin: 1em 0; }
                        ul, ol { padding-left: 2em; }
                    `,
                    paste_data_images: true,
                    paste_webkit_styles: 'all',
                    paste_merge_formats: true,
                    paste_retain_style_properties: 'all',
                    branding: false,
                    promotion: false
                }}
            />
        </div>
    );
}
