import { Container } from 'semantic-ui-react';

interface DebugContractsProps {
  connected: boolean;
  debug: JSX.Element[];
}

export default function DebugContracts(props: DebugContractsProps) {
  return <Container>{props.debug}</Container>;
}
