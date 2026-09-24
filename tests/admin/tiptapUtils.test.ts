import { beforeEach, describe, expect, it, vi } from 'vitest';

const validDocumentA = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A' }] }],
};
const validDocumentB = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'B' }] }],
};
const emptyDocument = { type: 'doc', content: [{ type: 'paragraph' }] };

let fieldValue: unknown = JSON.stringify(validDocumentA);
const fieldOnChange = vi.fn();
const mockEditorUpdateRef = { current: null as string | null };
let capturedEditorOptions:
  | { onUpdate?: (payload: { editor: typeof mockEditor }) => void }
  | undefined;
const setContent = vi.fn((content: unknown) => {
  mockEditor.getJSON.mockReturnValue(content);
  return true;
});
const mockEditor = {
  commands: { setContent },
  getJSON: vi.fn(() => validDocumentA),
};

vi.mock('@strapi/strapi/admin', () => ({
  useField: () => ({
    value: fieldValue,
    onChange: fieldOnChange,
  }),
}));

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn((options) => {
    capturedEditorOptions = options;
    return mockEditor;
  }),
}));

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return {
    ...actual,
    useEffect: (effect: () => void) => effect(),
    useRef: () => mockEditorUpdateRef,
  };
});

import { useTiptapEditor } from '../../admin/src/utils/tiptapUtils';

describe('useTiptapEditor external content synchronization', () => {
  beforeEach(() => {
    fieldValue = JSON.stringify(validDocumentA);
    fieldOnChange.mockReset();
    setContent.mockClear();
    mockEditor.getJSON.mockReturnValue(validDocumentA);
    capturedEditorOptions = undefined;
    mockEditorUpdateRef.current = null;
  });

  it('applies a changed valid external field value after initialization', () => {
    useTiptapEditor('content');

    fieldValue = JSON.stringify(validDocumentB);
    useTiptapEditor('content');

    expect(setContent).toHaveBeenCalledWith(validDocumentB, { emitUpdate: false });
  });

  it('does not emit a field update when synchronizing external content', () => {
    useTiptapEditor('content');

    fieldValue = JSON.stringify(validDocumentB);
    useTiptapEditor('content');

    expect(fieldOnChange).not.toHaveBeenCalled();
  });

  it('does not replace semantically equal external content and preserves user updates', () => {
    useTiptapEditor('content');
    fieldValue = JSON.stringify(validDocumentA);
    useTiptapEditor('content');

    expect(setContent).not.toHaveBeenCalled();

    capturedEditorOptions?.onUpdate?.({ editor: mockEditor });
    expect(fieldOnChange).toHaveBeenCalledWith('content', JSON.stringify(validDocumentA));

    mockEditor.getJSON.mockClear();
    fieldValue = fieldOnChange.mock.calls[0][1];
    useTiptapEditor('content');

    expect(mockEditor.getJSON).not.toHaveBeenCalled();
  });

  it('replaces stale content with an explicit empty document', () => {
    useTiptapEditor('content');

    fieldValue = JSON.stringify(emptyDocument);
    useTiptapEditor('content');

    expect(setContent).toHaveBeenCalledWith(emptyDocument, { emitUpdate: false });
  });

  it('leaves the current document unchanged for malformed external content', () => {
    useTiptapEditor('content');

    fieldValue = '{malformed';
    useTiptapEditor('content');

    expect(setContent).not.toHaveBeenCalled();
    expect(mockEditor.getJSON()).toEqual(validDocumentA);
  });
});
