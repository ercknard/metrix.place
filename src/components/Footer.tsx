import { Grid, Icon, List } from 'semantic-ui-react';
import styles from '../styles/Home.module.css';

export default function Footer(): JSX.Element {
  const d = new Date();
  return (
    <Grid className="footer-bar" columns="equal" stackable>
      <Grid.Row className="footerNavBar">
        <Grid.Column>
          <List.Item
            as="a"
            href="https://metrixcoin.com"
            target="_blank"
            className={styles.lavenderLink_css}
          >
            <Icon name="bolt" />
            Powered by MetrixCoin
          </List.Item>
        </Grid.Column>

        <Grid.Column style={{ padding: '0px 4px' }}>
          <a
            href="https://cryptech.services"
            target="_blank"
            className={styles.lavenderLink_css}
          >
            ©{`2023`}
            {d.getFullYear() !== Number(`2023`) ? `-${d.getFullYear()} ` : ' '}
            &nbsp;&nbsp;
            {`Cryptech Services`}
          </a>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
