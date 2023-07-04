import PalettePicker from '@src/components/PalettePicker';
import React from 'react';
import { Modal, Image } from 'semantic-ui-react';
import styles from '../styles/Home.module.css'

interface UserSettingsModalProps {
  colors: string[];
  trigger: JSX.Element;
}

export default function UserSettingsModal(props: UserSettingsModalProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      className={styles.colormodal}
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
      <Modal.Content className={styles.modalpicker}>
        <PalettePicker colors={props.colors} />
      </Modal.Content>
    </Modal>
  );
}
