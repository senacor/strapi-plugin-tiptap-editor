import { Button, Dialog, Field, TextInput } from '@strapi/design-system';
import { useIntl } from 'react-intl';

type HeadingAnchorDialogProps = {
  open: boolean;
  value: string;
  error: string | null;
  hasAnchor: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  onRemove: () => void;
};

export function HeadingAnchorDialog({
  open,
  value,
  error,
  hasAnchor,
  onChange,
  onClose,
  onSave,
  onRemove,
}: HeadingAnchorDialogProps) {
  const { formatMessage } = useIntl();

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen: boolean) => {
        if (!nextOpen) onClose();
      }}
    >
      {open && (
        <Dialog.Content>
          <Dialog.Header>
            {formatMessage({ id: 'tiptap-editor.heading.anchorDialogTitle', defaultMessage: 'Heading anchor' })}
          </Dialog.Header>
          <Dialog.Body>
            <Field.Root width="100%" error={error ?? undefined} hint={formatMessage({
              id: 'tiptap-editor.heading.anchorHint',
              defaultMessage: 'Use a unique ID without spaces or #. Links to this heading use # followed by the ID.',
            })}>
              <Field.Label>
                {formatMessage({ id: 'tiptap-editor.heading.anchorId', defaultMessage: 'Anchor ID' })}
              </Field.Label>
              <TextInput
                name="heading-anchor-id"
                value={value}
                placeholder={formatMessage({ id: 'tiptap-editor.heading.anchorPlaceholder', defaultMessage: 'e.g. introduction' })}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    onSave();
                  }
                }}
              />
              <Field.Hint />
              <Field.Error />
            </Field.Root>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button variant="tertiary" fullWidth onClick={onClose}>
                {formatMessage({ id: 'tiptap-editor.heading.anchorCancel', defaultMessage: 'Cancel' })}
              </Button>
            </Dialog.Cancel>
            {hasAnchor && (
              <Button variant="danger-light" fullWidth onClick={onRemove}>
                {formatMessage({ id: 'tiptap-editor.heading.anchorRemove', defaultMessage: 'Remove' })}
              </Button>
            )}
            <Dialog.Action>
              <Button variant="success-light" fullWidth onClick={onSave} disabled={Boolean(error)}>
                {formatMessage({ id: 'tiptap-editor.heading.anchorSave', defaultMessage: 'Save' })}
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
}
