'use client';

import { forwardRef, useEffect, useRef } from 'react';
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export interface BlockNoteEditorRef {
  getContent: () => Promise<string>;
  setContent: (html: string) => void;
}

interface BlockNoteEditorProps {
  initialContent?: string;
  placeholder?: string;
  onChange?: (content: string) => void;
}

const BlockNoteEditor = forwardRef<BlockNoteEditorRef, BlockNoteEditorProps>(
  ({ initialContent = '', placeholder = 'Start typing...', onChange }, ref) => {
    const editor = useCreateBlockNote();
    const hasInitialized = useRef(false);

    const editorInstanceRef = useRef(editor);

    useEffect(() => {
      editorInstanceRef.current = editor;
    }, [editor]);

    // Initialize content if provided (supports both HTML and Markdown)
    useEffect(() => {
      if (initialContent && editor && !hasInitialized.current) {
        try {
          let blocks;
          if (initialContent.trim().startsWith('<')) {
            blocks = editor.tryParseHTMLToBlocks(initialContent);
          } else {
            blocks = editor.tryParseMarkdownToBlocks(initialContent);
          }

          if (blocks && blocks.length > 0) {
            editor.replaceBlocks(editor.document, blocks);
          }
          hasInitialized.current = true;
        } catch (e) {
          console.error('Error parsing initial content:', e);
        }
      }
    }, [initialContent, editor]);

    // Expose methods via ref
    useEffect(() => {
      if (ref && 'current' in ref) {
        ref.current = {
          getContent: async () => {
            if (!editor) return '';
            try {
              // Export as HTML to preserve colors and advanced formatting
              const html = await editor.blocksToHTMLLossy(editor.document);
              return html;
            } catch (e) {
              console.error('Error converting to HTML:', e);
              return '';
            }
          },
          setContent: (content: string) => {
            if (editor) {
              try {
                let blocks;
                if (content.trim().startsWith('<')) {
                  blocks = editor.tryParseHTMLToBlocks(content);
                } else {
                  blocks = editor.tryParseMarkdownToBlocks(content);
                }

                if (blocks && blocks.length > 0) {
                  editor.replaceBlocks(editor.document, blocks);
                }
              } catch (e) {
                console.error('Error setting content:', e);
              }
            }
          },
        };
      }
    }, [editor, ref]);

    return (
      <div className="rounded-lg border border-input bg-background text-foreground shadow-sm overflow-hidden">
        <BlockNoteView
          editor={editor}
          theme="light"
          className="blocknote-light bg-white h-auto"
          onChange={async () => {
            if (onChange) {
              const html = await editor.blocksToHTMLLossy(editor.document);
              onChange(html);
            }
          }}
        />
      </div>
    );
  }
);

BlockNoteEditor.displayName = 'BlockNoteEditor';

export default BlockNoteEditor;