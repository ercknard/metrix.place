import PalettePicker from '@src/components/PalettePicker';
import React from 'react';
import { Modal, Image } from 'semantic-ui-react';

interface UserSettingsModalProps {
  trigger: JSX.Element;
}

export default function UserSettingsModal(props: UserSettingsModalProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      closeIcon={true}
      closeOnEscape={true}
      closeOnDimmerClick={false}
      basic
      dimmer="blurring"
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={props.trigger}
    >
      <Modal.Content>
        <PalettePicker />
      </Modal.Content>
    </Modal>
  );
}
