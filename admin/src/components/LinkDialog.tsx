import React from 'react';
import { Box, Button, Dialog, Field, SingleSelect, SingleSelectOption, TextInput } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import type { HeadingAnchor } from '../utils/headingAnchors';

export type LinkDialogPayload = { url: string };

interface LinkDialogProps {
  open: boolean;
  url: string | undefined;
  mode: 'add' | 'edit';
  anchors?: HeadingAnchor[];
  onClose: () => void;
  onSave: (payload: LinkDialogPayload) => void;
  onRemove: () => void;
}

// Dialog for adding or editing/removing a link.
export const LinkDialog: React.FC<LinkDialogProps> = ({
  open,
  url,
  mode,
  anchors = [],
  onClose,
  onSave,
  onRemove,
}) => {
  const { formatMessage } = useIntl();
  const [value, setValue] = React.useState(url || '');

  React.useEffect(() => {
    if (open) {
      setValue(url || '');
    }
  }, [open, url, mode]);

  const handleSave = () => {
    onSave({ url: value.trim() });
  };

  const isSaveDisabled = mode === 'add' ? value.trim() === '' : false; // allow empty to remove when editing

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v: boolean) => {
        if (!v) onClose();
      }}
    >
      {open && (
        <Dialog.Content>
          <Dialog.Header>{mode === 'add'
            ? formatMessage({ id: 'tiptap-editor.link.addLink', defaultMessage: 'Add link' })
            : formatMessage({ id: 'tiptap-editor.link.editLink', defaultMessage: 'Edit link' })
          }</Dialog.Header>
          <Dialog.Body>
            {anchors.length > 0 && (
              <Box width="100%" paddingBottom={4}>
                <Field.Root width="100%">
                  <Field.Label>
                    {formatMessage({ id: 'tiptap-editor.link.anchorSuggestions', defaultMessage: 'Jump to heading' })}
                  </Field.Label>
                  <Box width="100%">
                    <SingleSelect
                      placeholder={formatMessage({ id: 'tiptap-editor.link.anchorPlaceholder', defaultMessage: 'Choose a heading' })}
                      value={anchors.find(({ id }) => value === `#${id}`)?.id}
                      onChange={(id: string | number) => setValue(`#${id}`)}
                    >
                      {anchors.map(({ id, text }) => (
                        <SingleSelectOption key={id} value={id}>
                          {text || id} (#{id})
                        </SingleSelectOption>
                      ))}
                    </SingleSelect>
                  </Box>
                </Field.Root>
              </Box>
            )}
            <Field.Root width="100%">
              <Field.Label>{formatMessage({ id: 'tiptap-editor.link.urlLabel', defaultMessage: 'URL' })}</Field.Label>
              <TextInput
                name="link-url"
                placeholder={formatMessage({ id: 'tiptap-editor.link.urlPlaceholder', defaultMessage: 'https://example.com' })}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
              />
            </Field.Root>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button variant="tertiary" fullWidth onClick={onClose}>
                {formatMessage({ id: 'tiptap-editor.link.cancel', defaultMessage: 'Cancel' })}
              </Button>
            </Dialog.Cancel>
            {mode === 'edit' && (
              <Button variant="danger-light" fullWidth onClick={onRemove}>
                {formatMessage({ id: 'tiptap-editor.link.removeLink', defaultMessage: 'Remove link' })}
              </Button>
            )}
            <Dialog.Action>
              <Button
                fullWidth
                variant="success-light"
                onClick={handleSave}
                disabled={isSaveDisabled}
              >
                {formatMessage({ id: 'tiptap-editor.link.save', defaultMessage: 'Save' })}
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
};

export default LinkDialog;
