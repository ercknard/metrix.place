import React from 'react';
import styles from '../styles/Home.module.css';

interface MapSectoProps {
  x: number;
  y: number;
  color: string;
  sector: number[];
  setSector(sector: number[]): void;
}
export default function MapSector(props: MapSectoProps): JSX.Element {
  // wether the pixel is painted or not

  const [opacity, setOpacity] = React.useState(0.15);
  const [ownColor, setOwnColor] = React.useState(props.color);

  React.useEffect(() => {
    if (props.sector[0] === props.x && props.sector[1] === props.y)
      setOwnColor('#92319d');
    else setOwnColor('#000000');
  }, [props.sector]);

  // when click, set the color
  const onClick = (e: any) => {
    //setColor();
    const sector = e.target.id.replace('sector_', '').split('_');
    const x = Number(sector[0]);
    const y = Number(sector[1]);
    props.setSector([x, y]);
    e.preventDefault();
  };

  // override context menu ( right mouse click ) to erase the color
  const onContextMenu = (e: any) => {
    //eraseColor();
    e.preventDefault();
  };

  // when mouse leave while opacity is 0.18, set opacity to 0
  const onMouseLeave = () => {
    if (opacity === 0.18) {
      //eraseColor();
    }
  };
  return (
    <>
      <div
        className={styles.sector}
        style={{
          boxShadow: `${props.x}rem ${props.y}rem 0 -0.05rem ${ownColor}`
        }}
      >
        <div
          id={`sector_${props.x}_${props.y}`}
          className={styles.sector}
          style={{
            top: `${props.y}rem`,
            left: `${props.x}rem`,
            backgroundColor: ownColor,
            opacity: opacity
          }}
          onMouseLeave={onMouseLeave}
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
