import React from 'react';
import styles from '../styles/Home.module.css';

interface PixelProps {
  x: number;
  y: number;
  color: string;
  pixel: number[] | undefined;
  setPixel(pixel: number[] | undefined): void;
}
export default function Pixel(props: PixelProps): JSX.Element {
  // wether the pixel is painted or not

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
