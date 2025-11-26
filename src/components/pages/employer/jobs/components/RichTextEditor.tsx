"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/common/forms/Button';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Bold, Italic, Underline, List, ListOrdered, Link, Code, Eye, EyeOff, Heading1, Heading2 } from 'lucide-react';
import { cn } from '@/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  className?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter text...", 
  minLength = 0,
  maxLength,
  className 
}: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateContent();
  };

  const wordCount = value.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const charCount = value.replace(/<[^>]*>/g, '').length;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border border-border rounded-t-lg bg-muted/50 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('underline')}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('formatBlock', '<h1>')}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('insertUnorderedList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) executeCommand('createLink', url);
          }}
          title="Insert Link"
        >
          <Link className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('formatBlock', '<pre>')}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </Button>
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          title={showPreview ? "Edit Mode" : "Preview Mode"}
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Editor */}
      {showPreview ? (
        <Card className="border border-border rounded-b-lg">
          <CardContent className="p-4 min-h-[200px]">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: value || '<p class="text-muted-foreground">No content</p>' }}
            />
          </CardContent>
        </Card>
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={updateContent}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: value }}
          className="w-full px-3 py-2 border border-t-0 border-border rounded-b-lg bg-background text-foreground min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary/20"
          style={{ 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
          data-placeholder={placeholder}
        />
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{charCount} {charCount === 1 ? 'character' : 'characters'}</span>
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          {minLength > 0 && (
            <span className={cn(
              charCount < minLength && "text-destructive"
            )}>
              Min: {minLength}
            </span>
          )}
          {maxLength && (
            <span className={cn(
              charCount > maxLength && "text-destructive"
            )}>
              Max: {maxLength}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

