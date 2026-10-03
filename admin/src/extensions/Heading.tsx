import { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import Heading from '@tiptap/extension-heading';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import { Fragment, Node as ProseMirrorNode, Slice } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';
import { isHeadingAnchorAvailable, parseHeadingAnchorId, pickDuplicateHeadingIndices } from '../utils/headingAnchors';
import { Hashtag } from '@strapi/icons';
import { ToolbarButton } from '../components/ToolbarButton';
import { HeadingAnchorDialog } from '../components/HeadingAnchorDialog';

// Base extension class (un-configured) — used by buildExtensions for dynamic levels
export const BaseHeadingWithSEOTag = Heading.extend({
  addAttributes() {
    return {
      ...(this as any).parent?.(), // must cast to any to avoid TS error
      tag: { default: null },
      id: { default: null },
    };
  },
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() ?? []),
      new Plugin({
        props: {
          transformPasted(slice, view) {
            const existing = new Set<string>();
            view.state.doc.descendants((node) => {
              if (node.type.name === 'heading' && typeof node.attrs.id === 'string') {
                existing.add(node.attrs.id);
              }
            });
            const transform = (fragment: Fragment): Fragment =>
              Fragment.fromArray(
                fragment.content.map((node) => {
                  const children = node.content.size ? transform(node.content) : node.content;
                  if (node.type.name === 'heading' && typeof node.attrs.id === 'string' && node.attrs.id) {
                    if (existing.has(node.attrs.id)) {
                      return node.type.create({ ...node.attrs, id: null }, children, node.marks);
                    }
                    existing.add(node.attrs.id);
                  }
                  return children === node.content ? node : node.copy(children);
                })
              );
            return new Slice(transform(slice.content), slice.openStart, slice.openEnd);
          },
        },
        appendTransaction(transactions, _oldState, newState) {
          if (!transactions.some((transaction) => transaction.docChanged)) return null;

          const headings: Array<{ position: number; node: ProseMirrorNode }> = [];
          newState.doc.descendants((node, position) => {
            if (node.type.name === 'heading') headings.push({ position, node });
          });
          const duplicates = pickDuplicateHeadingIndices(headings.map(({ node }) => node.attrs.id));
          if (duplicates.size === 0) return null;

          const tr = newState.tr;
          headings.forEach(({ position, node }, index) => {
            if (duplicates.has(index)) {
              tr.setNodeMarkup(position, undefined, { ...node.attrs, id: null });
            }
          });
          return tr.docChanged ? tr : null;
        },
      }),
    ];
  },
});

// Pre-configured instance with all heading levels
export const HeadingWithSEOTag = BaseHeadingWithSEOTag.configure({ levels: [1, 2, 3, 4, 5, 6] });

export function useHeading(editor: Editor | null, props: { disabled?: boolean; levels?: number[] } = { disabled: false }) {
  const { formatMessage } = useIntl();
  const levels = props.levels ?? [1, 2, 3, 4, 5, 6];
  const [anchorDialogOpen, setAnchorDialogOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<number | null>(null);
  const [anchorOriginalId, setAnchorOriginalId] = useState<string | null>(null);
  const [anchorInitiallySet, setAnchorInitiallySet] = useState(false);
  const [anchorDraft, setAnchorDraft] = useState('');
  const [anchorError, setAnchorError] = useState<string | null>(null);
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return { headingLevel: undefined, headingTag: undefined, headingId: undefined, headingPos: undefined, isParagraph: false };
      }
      const $from = ctx.editor.state.selection.$from;
      const headingPos = $from.parent.type.name === 'heading' ? $from.before() : undefined;
      return {
        headingLevel: ctx.editor.getAttributes('heading').level as number | undefined,
        headingTag: ctx.editor.getAttributes('heading').tag as string | undefined,
        headingId: ctx.editor.getAttributes('heading').id as string | undefined,
        headingPos,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
      };
    },
  });

  const validateAnchorDraft = (value: string, position: number): string | null => {
    if (!editor) return null;
    const parsed = parseHeadingAnchorId(value);
    if (parsed.error) {
      return formatMessage({
        id: `tiptap-editor.heading.anchorError.${parsed.error}`,
        defaultMessage: parsed.error === 'leadingHash'
          ? 'Enter the ID without #.'
          : 'The ID cannot contain spaces.',
      });
    }
    if (parsed.id && !isHeadingAnchorAvailable(editor.state.doc, parsed.id, position)) {
      return formatMessage({
        id: 'tiptap-editor.heading.anchorError.duplicate',
        defaultMessage: 'This ID is already used by another heading.',
      });
    }
    return null;
  };

  const closeAnchorDialog = () => {
    setAnchorDialogOpen(false);
    setAnchorError(null);
  };

  const openAnchorDialog = () => {
    if (!editor || editorState?.headingPos === undefined) return;
    const heading = editor.state.doc.nodeAt(editorState.headingPos);
    if (!heading || heading.type.name !== 'heading') return;
    setAnchorPosition(editorState.headingPos);
    setAnchorOriginalId(heading.attrs.id ?? null);
    setAnchorDraft(heading.attrs.id ?? '');
    setAnchorInitiallySet(Boolean(heading.attrs.id));
    setAnchorError(null);
    setAnchorDialogOpen(true);
  };

  const changeAnchorDraft = (value: string) => {
    setAnchorDraft(value);
    setAnchorError(anchorPosition === null ? null : validateAnchorDraft(value, anchorPosition));
  };

  const commitAnchorId = () => {
    if (!editor || anchorPosition === null) return;
    const error = validateAnchorDraft(anchorDraft, anchorPosition);
    if (error) {
      setAnchorError(error);
      return;
    }
    const heading = editor.state.doc.nodeAt(anchorPosition);
    if (!heading || heading.type.name !== 'heading' || heading.attrs.id !== anchorOriginalId) {
      closeAnchorDialog();
      return;
    }
    const parsed = parseHeadingAnchorId(anchorDraft);
    if (heading.attrs.id === parsed.id) {
      closeAnchorDialog();
      return;
    }
    editor.view.dispatch(
      editor.state.tr.setNodeMarkup(anchorPosition, undefined, {
        ...heading.attrs,
        id: parsed.id,
      })
    );
    closeAnchorDialog();
  };

  const removeAnchorId = () => {
    if (!editor || anchorPosition === null) return;
    const heading = editor.state.doc.nodeAt(anchorPosition);
    if (!heading || heading.type.name !== 'heading' || heading.attrs.id !== anchorOriginalId) {
      closeAnchorDialog();
      return;
    }
    editor.view.dispatch(
      editor.state.tr.setNodeMarkup(anchorPosition, undefined, { ...heading.attrs, id: null })
    );
    closeAnchorDialog();
  };

  const onChangeHeading = (value: string) => {
    if (!editor) return;

    if (value === 'p') {
      editor.chain().focus().setParagraph().run();
      return;
    }

    const parsed = Number(value.slice(1));
    if (isNaN(parsed) || parsed < 1 || parsed > 6) return;
    const level = parsed as 1 | 2 | 3 | 4 | 5 | 6;
    editor.chain().focus().setHeading({ level }).run();

    // automatically set the 'tag' attribute to match the heading level if not already set
    if (!editorState?.headingTag) {
      editor
        .chain()
        .focus()
        .updateAttributes('heading', { tag: `h${level}` })
        .run();
    }
  };

  const onChangeHeadingTag = (value: string) => {
    if (!editor) return;
    if (!editorState?.headingLevel) return;
    editor.chain().focus().updateAttributes('heading', { tag: value }).run();
  };

  return {
    headingSelect: (
      <SingleSelect
        placeholder={formatMessage({ id: 'tiptap-editor.heading.style', defaultMessage: 'Style' })}
        aria-label={formatMessage({ id: 'tiptap-editor.heading.textStyle', defaultMessage: 'Text style' })}
        value={editorState?.headingLevel ? `h${editorState.headingLevel}` : 'p'}
        onChange={(v: string | number) => v != null && onChangeHeading(String(v))}
        disabled={!editor || props.disabled}
        size="S"
      >
        <SingleSelectOption value="p">{formatMessage({ id: 'tiptap-editor.heading.paragraph', defaultMessage: 'Paragraph' })}</SingleSelectOption>
        {levels.map((level) => (
          <SingleSelectOption key={`h${level}`} value={`h${level}`}>
            {formatMessage({ id: 'tiptap-editor.heading.heading', defaultMessage: 'Heading {level}' }, { level })}
          </SingleSelectOption>
        ))}
      </SingleSelect>
    ),
    headingTagSelect: (
      <SingleSelect
        placeholder={formatMessage({ id: 'tiptap-editor.heading.seoTag', defaultMessage: 'SEO Tag' })}
        aria-label={formatMessage({ id: 'tiptap-editor.heading.seoTagAriaLabel', defaultMessage: "Heading's HTML tag for SEO purposes" })}
        value={editorState?.headingTag}
        onChange={(v: string | number) => v != null && onChangeHeadingTag(String(v))}
        disabled={!editor || props.disabled || !editorState?.headingLevel}
        size="S"
      >
        <SingleSelectOption value="h1">h1</SingleSelectOption>
        <SingleSelectOption value="h2">h2</SingleSelectOption>
        <SingleSelectOption value="h3">h3</SingleSelectOption>
        <SingleSelectOption value="h4">h4</SingleSelectOption>
        <SingleSelectOption value="h5">h5</SingleSelectOption>
        <SingleSelectOption value="h6">h6</SingleSelectOption>
      </SingleSelect>
    ),
    headingAnchorButton: (
      <ToolbarButton
        onClick={openAnchorDialog}
        icon={<Hashtag />}
        active={Boolean(editorState?.headingId)}
        disabled={!editor || props.disabled || editorState?.headingPos === undefined}
        tooltip={formatMessage({ id: 'tiptap-editor.heading.anchorButton', defaultMessage: 'Set heading anchor ID' })}
      />
    ),
    headingAnchorDialog: (
      <HeadingAnchorDialog
        open={anchorDialogOpen}
        value={anchorDraft}
        error={anchorError}
        hasAnchor={anchorInitiallySet}
        onChange={changeAnchorDraft}
        onClose={closeAnchorDialog}
        onSave={commitAnchorId}
        onRemove={removeAnchorId}
      />
    ),
  };
}
