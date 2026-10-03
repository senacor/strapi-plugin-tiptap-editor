import { describe, expect, it, vi } from 'vitest';

vi.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage }),
}));
vi.mock('@strapi/design-system', () => ({
  Button: 'Button',
  TextInput: 'TextInput',
  Dialog: {
    Root: 'DialogRoot',
    Content: 'DialogContent',
    Header: 'DialogHeader',
    Body: 'DialogBody',
    Footer: 'DialogFooter',
    Cancel: 'DialogCancel',
    Action: 'DialogAction',
  },
  Field: { Root: 'FieldRoot', Label: 'FieldLabel', Hint: 'FieldHint', Error: 'FieldError' },
}));

import { HeadingAnchorDialog } from '../../admin/src/components/HeadingAnchorDialog';

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

describe('HeadingAnchorDialog', () => {
  it('shows validation at the field and prevents saving an invalid ID', () => {
    const onSave = vi.fn();
    const dialog = HeadingAnchorDialog({
      open: true,
      value: 'duplicate',
      error: 'This ID is already used by another heading.',
      hasAnchor: false,
      onChange: vi.fn(),
      onClose: vi.fn(),
      onSave,
      onRemove: vi.fn(),
    });

    expect(findElement(dialog, (element) => element.type === 'FieldRoot')?.props?.error)
      .toBe('This ID is already used by another heading.');
    expect(findElement(dialog, (element) => element.type === 'FieldError')).toBeDefined();
    expect(findElement(dialog, (element) =>
      element.type === 'Button' && element.props?.variant === 'success-light'
    )?.props?.disabled).toBe(true);
  });

  it('offers removal for an existing anchor and passes input changes through', () => {
    const onChange = vi.fn();
    const onRemove = vi.fn();
    const dialog = HeadingAnchorDialog({
      open: true,
      value: 'details',
      error: null,
      hasAnchor: true,
      onChange,
      onClose: vi.fn(),
      onSave: vi.fn(),
      onRemove,
    });

    findElement(dialog, (element) => element.type === 'TextInput')?.props?.onChange({ target: { value: 'new-id' } });
    expect(onChange).toHaveBeenCalledWith('new-id');
    findElement(dialog, (element) => element.type === 'Button' && element.props?.variant === 'danger-light')?.props?.onClick();
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
