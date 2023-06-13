import React from 'react';
import {Container, Header, Icon, Message, Modal} from 'semantic-ui-react';

interface Web3TransactionModalProps {
  trigger: JSX.Element;
  message: string | JSX.Element | undefined;
  setMessage(message: string | JSX.Element | undefined): void;
}

export default function Web3TransactionModal(props: Web3TransactionModalProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      closeIcon={props.message != undefined}
      basic
      dimmer='blurring'
      onClose={() => {
        props.setMessage(undefined);
        setOpen(false);
      }}
      onOpen={() => setOpen(true)}
      open={open}
      size='small'
      trigger={props.trigger}
    >
      <Header icon>
        {!!props.message ? (
          ''
        ) : (
          <>
            <Icon name='cog' loading />
            Complete the transaction through MetriMask
          </>
        )}
      </Header>
      <Modal.Content>
        <Message
          hidden={!!!props.message}
          error={typeof props.message === 'string'}
          success={typeof props.message === 'object'}
          content={<Container textAlign='center'>{props.message}</Container>}
        />
      </Modal.Content>
    </Modal>
  );
}
