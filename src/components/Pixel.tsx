import React from 'react';
import styles from '../styles/Home.module.css';

interface PixelProps {
  x: number;
  y: number;
  color: string;
  sector: [x: number, y: number];
  pixel: number[] | undefined;
  setPixel(pixel: [x: number, y: number] | undefined): void;
}
export default function Pixel(props: PixelProps): JSX.Element {
  const [opacity, setOpacity] = React.useState(0.33);
  const [ownColor, setOwnColor] = React.useState(props.color);

  React.useEffect(() => {
    if (
      props.pixel &&
      props.pixel[0] === props.x &&
      props.pixel[1] === props.y
    ) {
      setOwnColor('#f6a1ff');
      setOpacity(0.33);
    } else {
      setOwnColor('#000000');
      setOpacity(0);
    }
  }, [props.pixel]);

  // when click, set the color
  const onClick = (e: any) => {
    //setColor();
    const pixel = e.target.id.replace('pixel_', '').split('_');
    const x = Number(pixel[0]);
    const y = Number(pixel[1]);
    console.log(
      `actualPixel: [${x + 64 * props.sector[0]}, ${y + 64 * props.sector[1]}]`
    );
    // This is our pixel just return
    if (props.pixel && x === props.pixel[0] && y === props.pixel[1]) return;

    props.setPixel([x, y]);
    e.preventDefault();
  };

  // override context menu ( right mouse click ) to erase the color
  const onContextMenu = (e: any) => {
    //eraseColor();
    e.preventDefault();
  };

  return (
    <>
      <div
        className={styles.pixel}
        style={{
          boxShadow: `${props.x + 1}rem ${props.y + 1}rem 0 -0.05rem`
        }}
      >
        <div
          id={`pixel_${props.x}_${props.y}`}
          className={styles.pixel}
          style={{
            top: `${props.y + 1}rem`,
            left: `${props.x + 1}rem`,
            border: `solid 2px ${ownColor}`,
            opacity: opacity
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
