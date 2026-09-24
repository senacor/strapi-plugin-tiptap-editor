import { EditorOptions, Extensions, JSONContent } from '@tiptap/core';
import { useEditor } from '@tiptap/react';
import { type InputProps, useField } from '@strapi/strapi/admin';
import { useEffect, useRef } from 'react';

export type { FieldValue } from '@strapi/strapi/admin';

export type TiptapInputProps = InputProps & {
  labelAction?: React.ReactNode;
};

export function tiptapContent(text: string): JSONContent {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: text,
          },
        ],
      },
    ],
  };
}

function parseJSONContent(value: string | JSONContent | null | undefined, defaultValue: string) {
  if (!value) {
    return tiptapContent(defaultValue);
  }

  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (e) {
    console.error('Failed to parse JSON content:', e);
    return tiptapContent(`
          This component's content is malformed. Please change it or remove this component.
          Original content: ${JSON.stringify(value)}
        `);
  }
}

function parseExternalJSONContent(
  value: string | JSONContent | null | undefined
): JSONContent | null {
  if (!value) return tiptapContent('');

  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (e) {
    console.error('Failed to parse external JSON content:', e);
    return null;
  }
}

function serializeFieldValue(value: string | JSONContent | null | undefined): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';

  return JSON.stringify(value) ?? '';
}

export function useTiptapEditor(
  name: string,
  defaultValue: string = '',
  extensions: Extensions = [],
  editorProps: EditorOptions['editorProps'] = {}
) {
  const field = useField(name);
  const lastEditorUpdate = useRef<string | null>(null);

  const editor = useEditor({
    extensions: extensions,
    editorProps,
    content: parseJSONContent(field.value, defaultValue),
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const serialized = JSON.stringify(json);
      lastEditorUpdate.current = serialized;
      field.onChange(name, serialized);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const serializedFieldValue = serializeFieldValue(field.value);

    if (lastEditorUpdate.current === serializedFieldValue) {
      lastEditorUpdate.current = null;
      return;
    }

    lastEditorUpdate.current = null;
    const externalContent = parseExternalJSONContent(field.value);
    if (!externalContent) return;

    const currentContent = editor.getJSON();
    if (JSON.stringify(currentContent) === JSON.stringify(externalContent)) return;

    try {
      editor.commands.setContent(externalContent, { emitUpdate: false });
    } catch (e) {
      console.error('Failed to apply external JSON content:', e);
    }
  }, [editor, field.value]);

  return { editor, field };
}
