import type { JSONContent } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';

export type HeadingAnchor = { id: string; text: string };
export type AnchorIdError = 'whitespace' | 'leadingHash' | 'duplicate';

const hasWhitespace = (value: string) => /\s/u.test(value);

export function parseHeadingAnchorId(input: string): { id: string | null; error?: AnchorIdError } {
  const id = input.trim();
  if (!id) return { id: null };
  if (id.startsWith('#')) return { id: null, error: 'leadingHash' };
  if (hasWhitespace(id)) return { id: null, error: 'whitespace' };
  return { id };
}

export function isHeadingAnchorAvailable(
  doc: ProseMirrorNode,
  id: string,
  currentPosition: number
): boolean {
  let available = true;
  doc.descendants((node, position) => {
    if (node.type.name === 'heading' && position !== currentPosition && node.attrs.id === id) {
      available = false;
    }
  });
  return available;
}

const headingText = (node: JSONContent): string =>
  node.type === 'text'
    ? node.text ?? ''
    : (node.content ?? []).map(headingText).join('');

export function collectHeadingAnchors(doc: JSONContent): HeadingAnchor[] {
  const counts = new Map<string, number>();
  const candidates: HeadingAnchor[] = [];
  const visit = (node: JSONContent) => {
    if (node.type === 'heading' && typeof node.attrs?.id === 'string') {
      const parsed = parseHeadingAnchorId(node.attrs.id);
      if (!parsed.error && parsed.id === node.attrs.id) {
        candidates.push({ id: parsed.id!, text: headingText(node) });
        counts.set(parsed.id!, (counts.get(parsed.id!) ?? 0) + 1);
      }
    }
    node.content?.forEach(visit);
  };
  visit(doc);
  return candidates.filter(({ id }) => counts.get(id) === 1);
}

// Given heading ids in document order, returns the index of each occurrence
// after the first one that shares an id (i.e. the ones to clear).
export function pickDuplicateHeadingIndices(ids: Array<string | null | undefined>): Set<number> {
  const seen = new Set<string>();
  const duplicates = new Set<number>();
  ids.forEach((id, index) => {
    if (typeof id !== 'string' || !id) return;
    if (seen.has(id)) {
      duplicates.add(index);
    } else {
      seen.add(id);
    }
  });
  return duplicates;
}

export function removeDuplicateHeadingAnchors(
  doc: JSONContent
): { content: JSONContent; removed: number } {
  const ids: Array<string | null | undefined> = [];
  const collect = (node: JSONContent) => {
    if (node.type === 'heading') ids.push(node.attrs?.id as string | null | undefined);
    node.content?.forEach(collect);
  };
  collect(doc);
  const duplicates = pickDuplicateHeadingIndices(ids);

  let index = 0;
  const visit = (node: JSONContent): JSONContent => {
    let result = node;
    if (node.type === 'heading') {
      if (duplicates.has(index)) {
        result = { ...node, attrs: { ...node.attrs, id: null } };
      }
      index += 1;
    }
    if (node.content) {
      const content = node.content.map(visit);
      if (content.some((child, i) => child !== node.content![i])) {
        result = { ...result, content };
      }
    }
    return result;
  };
  const content = visit(doc);
  return { content, removed: duplicates.size };
}
