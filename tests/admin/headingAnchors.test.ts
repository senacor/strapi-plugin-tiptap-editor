import { describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';

vi.mock('@strapi/design-system', () => ({
  Box: 'Box',
  TextInput: 'TextInput',
  Typography: 'Typography',
  SingleSelect: 'SingleSelect',
  SingleSelectOption: 'SingleSelectOption',
}));
vi.mock('@tiptap/react', () => ({ useEditorState: vi.fn() }));

import { buildExtensions } from '../../admin/src/utils/buildExtensions';
import {
  collectHeadingAnchors,
  isHeadingAnchorAvailable,
  parseHeadingAnchorId,
  removeDuplicateHeadingAnchors,
} from '../../admin/src/utils/headingAnchors';

const heading = (text: string, id?: string) => ({
  type: 'heading',
  attrs: { level: 2, tag: 'h2', ...(id ? { id } : {}) },
  content: [{ type: 'text', text }],
});

describe('heading anchors', () => {
  it('trims IDs, allows removal, and rejects spaces and leading hashes', () => {
    expect(parseHeadingAnchorId('  details  ')).toEqual({ id: 'details' });
    expect(parseHeadingAnchorId('   ')).toEqual({ id: null });
    expect(parseHeadingAnchorId('#details').error).toBe('leadingHash');
    expect(parseHeadingAnchorId('two words').error).toBe('whitespace');
  });

  it('collects only valid unique IDs in document order', () => {
    const doc = {
      type: 'doc',
      content: [
        heading('First', 'first'),
        heading('Duplicate A', 'dup'),
        heading('Duplicate B', 'dup'),
        heading('Invalid', 'two words'),
        heading('Last', 'last'),
      ],
    };
    expect(collectHeadingAnchors(doc)).toEqual([
      { id: 'first', text: 'First' },
      { id: 'last', text: 'Last' },
    ]);
  });

  it('compares IDs case-sensitively within one document', () => {
    const doc = { type: 'doc', content: [heading('Upper', 'Kapitel'), heading('Lower', 'kapitel')] };
    expect(collectHeadingAnchors(doc).map(({ id }) => id)).toEqual(['Kapitel', 'kapitel']);
    expect(removeDuplicateHeadingAnchors(doc).removed).toBe(0);
  });

  it('removes later duplicate IDs without changing heading text or SEO tags', () => {
    const doc = { type: 'doc', content: [heading('First', 'same'), heading('Second', 'same')] };
    const result = removeDuplicateHeadingAnchors(doc);
    expect(result.removed).toBe(1);
    expect(result.content.content?.[0].attrs?.id).toBe('same');
    expect(result.content.content?.[1].attrs).toEqual({ level: 2, tag: 'h2', id: null });
    expect(result.content.content?.[1].content?.[0].text).toBe('Second');
  });

  it('persists IDs in JSON, renders fragment targets, and preserves links', () => {
    const editor = new Editor({
      element: null,
      extensions: buildExtensions({ heading: true, link: true }),
      content: {
        type: 'doc',
        content: [
          heading('Details', 'details'),
          {
            type: 'paragraph',
            content: [{
              type: 'text',
              text: 'Jump',
              marks: [{ type: 'link', attrs: { href: '#details' } }],
            }],
          },
        ],
      },
    });
    expect(editor.getJSON().content?.[0].attrs?.id).toBe('details');
    const headingNode = editor.state.doc.firstChild!;
    const headingDOM = editor.schema.nodes.heading.spec.toDOM!(headingNode) as [string, Record<string, unknown>, number];
    expect(headingDOM[0]).toBe('h2');
    expect(headingDOM[1].id).toBe('details');
    const paragraph = editor.state.doc.lastChild!;
    expect(paragraph.firstChild?.marks.find((mark) => mark.type.name === 'link')?.attrs.href).toBe('#details');
    expect(isHeadingAnchorAvailable(editor.state.doc, 'details', 0)).toBe(true);
    expect(isHeadingAnchorAvailable(editor.state.doc, 'details', 1)).toBe(false);
    editor.destroy();
  });

  it('keeps legacy headings without a meaningful ID', () => {
    const editor = new Editor({
      element: null,
      extensions: buildExtensions({ heading: true }),
      content: { type: 'doc', content: [heading('Legacy')] },
    });
    expect(editor.getJSON().content?.[0].content?.[0].text).toBe('Legacy');
    const headingDOM = editor.schema.nodes.heading.spec.toDOM!(editor.state.doc.firstChild!) as [string, Record<string, unknown>, number];
    expect(headingDOM[1].id).toBeNull();
    editor.destroy();
  });

  it('clears a duplicate ID introduced by inserting a heading while retaining its text', () => {
    const editor = new Editor({
      element: null,
      extensions: buildExtensions({ heading: true }),
      content: { type: 'doc', content: [heading('Original', 'same')] },
    });
    const integrity = editor.extensionManager.plugins.find((plugin) => Boolean(plugin.spec.appendTransaction));
    expect(integrity).toBeDefined();
    editor.commands.insertContentAt(editor.state.doc.content.size, heading('Copy', 'same'));
    const changeTr = editor.state.tr.setNodeMarkup(0, undefined, editor.state.doc.firstChild!.attrs);
    const cleanup = integrity!.spec.appendTransaction!([changeTr], editor.state, editor.state);
    expect(cleanup).not.toBeNull();
    const headings = cleanup!.doc.toJSON().content!;
    expect(headings.map((node: any) => node.content?.[0].text)).toEqual(['Original', 'Copy']);
    expect(headings.map((node: any) => node.attrs?.id)).toEqual(['same', null]);
    editor.destroy();
  });

  it('clears the copied ID before pasting it ahead of its original heading', () => {
    const editor = new Editor({
      element: null,
      extensions: buildExtensions({ heading: true }),
      content: { type: 'doc', content: [heading('Original', 'same')] },
    });
    const integrity = editor.extensionManager.plugins.find((plugin) => Boolean(plugin.props.transformPasted));
    const copied = editor.state.doc.slice(0, editor.state.doc.content.size);
    const pasted = integrity!.props.transformPasted!(copied, { state: editor.state } as any, false);
    expect(pasted.content.firstChild?.attrs.id).toBeNull();
    expect(pasted.content.firstChild?.textContent).toBe('Original');
    editor.destroy();
  });
});
