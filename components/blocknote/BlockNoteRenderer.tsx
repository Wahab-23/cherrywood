import React from 'react';
import { marked } from 'marked';

interface BlockNoteRendererProps {
  data: string;
}

/**
 * Server-side BlockNote/Markdown renderer.
 * Uses Tailwind Typography (prose) for automatic styling.
 */
const BlockNoteRenderer = ({ data }: BlockNoteRendererProps) => {
  if (!data) return null;

  try {
    // Check if data is already HTML (starts with <)
    // If it is, use it directly. Otherwise parse as Markdown for backward compatibility.
    const isHtml = data.trim().startsWith('<');
    const html = isHtml ? data : (marked.parse(data) as string);

    return (
      <div
        className="prose prose-base max-w-none text-foreground leading-relaxed 
                   prose-headings:text-black dark:prose-headings:text-white prose-headings:font-bold
                   prose-p:mb-6 prose-p:leading-relaxed
                   prose-pre:bg-muted/50 prose-pre:rounded-xl
                   prose-img:rounded-2xl
                   dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (e) {
    console.error("Markdown parse error:", e);
    // Fallback to raw text if parsing fails
    return <div className="whitespace-pre-wrap">{data}</div>;
  }
};

export default BlockNoteRenderer;