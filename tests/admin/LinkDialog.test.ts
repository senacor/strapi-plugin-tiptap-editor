import { beforeEach, describe, expect, it, vi } from 'vitest';

const dialogState = vi.hoisted(() => ({ value: '', setValue: vi.fn((next: string) => { dialogState.value = next; }) }));

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  const mocked = {
    ...actual,
    useState: (initial: string) => [dialogState.value || initial, dialogState.setValue],
    useEffect: () => undefined,
  };
  return { ...mocked, default: mocked };
});
vi.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage }),
}));
vi.mock('@strapi/design-system', () => ({
  Box: 'Box',
  Button: 'Button',
  SingleSelect: 'SingleSelect',
  SingleSelectOption: 'SingleSelectOption',
  TextInput: 'TextInput',
  Dialog: { Root: 'DialogRoot', Content: 'DialogContent', Header: 'DialogHeader', Body: 'DialogBody', Footer: 'DialogFooter', Cancel: 'DialogCancel', Action: 'DialogAction' },
  Field: { Root: 'FieldRoot', Label: 'FieldLabel' },
}));

import { LinkDialog } from '../../admin/src/components/LinkDialog';

type ElementLike = { type?: unknown; props?: Record<string, any> };
function findElement(root: unknown, predicate: (element: ElementLike) => boolean): ElementLike | undefined {
  if (Array.isArray(root)) {
    for (const child of root) {
      const found = findElement(child, predicate);
      if (found) return found;
    }
    return undefined;
  }
  if (!root || typeof root !== 'object') return undefined;
  const element = root as ElementLike;
  if (predicate(element)) return element;
  const children = element.props?.children;
  for (const child of Array.isArray(children) ? children : [children]) {
    const found = findElement(child, predicate);
    if (found) return found;
  }
  return undefined;
}

describe('LinkDialog anchor suggestions', () => {
  beforeEach(() => {
    dialogState.value = '';
    dialogState.setValue.mockClear();
  });

  it('fills #id from a suggested heading and saves it as a link URL', () => {
    const onSave = vi.fn();
    const props = {
      open: true,
      mode: 'add' as const,
      url: undefined,
      anchors: [{ id: 'details', text: 'Details' }],
      onClose: vi.fn(),
      onRemove: vi.fn(),
      onSave,
    };
    const dialog = LinkDialog(props);
    const suggestion = findElement(dialog, (element) => element.type === 'SingleSelect');
    expect(suggestion).toBeDefined();
    expect(findElement(dialog, (element) => element.type === 'SingleSelectOption')?.props?.value).toBe('details');
    suggestion!.props!.onChange('details');

    const updated = LinkDialog(props);
    expect(findElement(updated, (element) => element.type === 'TextInput')?.props?.value).toBe('#details');
    findElement(updated, (element) => element.type === 'Button' && element.props?.variant === 'success-light')?.props?.onClick();
    expect(onSave).toHaveBeenCalledWith({ url: '#details' });
  });

  it('retains manual URLs when there are no suggestions', () => {
    dialogState.value = 'https://example.com';
    const onSave = vi.fn();
    const dialog = LinkDialog({
      open: true,
      mode: 'add',
      url: 'https://example.com',
      anchors: [],
      onClose: vi.fn(),
      onRemove: vi.fn(),
      onSave,
    });
    expect(findElement(dialog, (element) => element.type === 'SingleSelect')).toBeUndefined();
    findElement(dialog, (element) => element.type === 'Button' && element.props?.variant === 'success-light')?.props?.onClick();
    expect(onSave).toHaveBeenCalledWith({ url: 'https://example.com' });
  });

  it('keeps link editing and removal available with suggestions', () => {
    dialogState.value = 'https://example.com';
    const onRemove = vi.fn();
    const onSave = vi.fn();
    const dialog = LinkDialog({
      open: true,
      mode: 'edit',
      url: 'https://example.com',
      anchors: [{ id: 'details', text: 'Details' }],
      onClose: vi.fn(),
      onRemove,
      onSave,
    });
    findElement(dialog, (element) => element.type === 'Button' && element.props?.variant === 'success-light')?.props?.onClick();
    expect(onSave).toHaveBeenCalledWith({ url: 'https://example.com' });
    findElement(dialog, (element) => element.type === 'Button' && element.props?.variant === 'danger-light')?.props?.onClick();
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
