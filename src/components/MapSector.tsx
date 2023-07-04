import React from 'react';
import styles from '../styles/Home.module.css';

interface MapSectoProps {
  x: number;
  y: number;
  color: string;
  sector: number[] | undefined;
  setSector(sector: number[] | undefined): void;
  setPixel(pixel: number[] | undefined): void;
}
export default function MapSector(props: MapSectoProps): JSX.Element {
  const [opacity, setOpacity] = React.useState(0.18);
  const [ownColor, setOwnColor] = React.useState([props.color, '#f6a1ff']);

  React.useEffect(() => {
    if (
      props.sector &&
      props.sector[0] === props.x &&
      props.sector[1] === props.y
    )
      setOwnColor(['#92319d', '#f6a1ff']);
    else setOwnColor([props.color, '#000000']);
  }, [props.sector]);

  const onClick = (e: any) => {
    e.preventDefault();
    const sector = e.target.id.replace('sector_', '').split('_');
    const x = Number(sector[0]);
    const y = Number(sector[1]);

    // This is our sector just return
    if (props.sector && x === props.sector[0] && y === props.sector[1]) return;

    props.setSector([x, y]);
    props.setPixel(undefined);
  };

  const onContextMenu = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <div className={styles.sector}>
        <div
          id={`sector_${props.x}_${props.y}`}
          className={styles.sector}
          style={{
            top: `${props.y + 1}rem`,
            left: `${props.x + 1}rem`,
            background: `url("/plc/chunks/${props.x}-${props.y}.png")`,
            backgroundSize: 'cover',
            //backgroundColor: ownColor[0],
            border: `ridge 1px ${ownColor[1]}`,
            opacity: 1,
            imageRendering: 'pixelated'
          }}
          onClick={onClick}
          onContextMenu={onContextMenu}
          // prevent drag events
          onDragStart={(e) => e.preventDefault()}
          onDragEnd={(e) => e.preventDefault()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        />
      </div>
    </>
  );
}
