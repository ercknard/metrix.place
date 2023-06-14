import React from 'react';
import styles from '../styles/Home.module.css';

export const paintContext = React.createContext({
  paintColor: '#000',
  setPaintColor: (value: string) => {}
});
interface PixelProps {
  x: number;
  y: number;
  color: string;
}
export default function Pixel(props: PixelProps): JSX.Element {
  // wether the pixel is painted or not

  const [opacity, setOpacity] = React.useState(0);
  const { paintColor } = React.useContext(paintContext);
  const [ownColor, setOwnColor] = React.useState(paintColor);

  const setColor = () => {
    setOwnColor(paintColor);

    // set the opacity
    setOpacity(1);
  };

  const eraseColor = () => {
    setOpacity(0);
  };

  // when click, set the color
  const onClick = (e: any) => {
    console.log(`click ${e.target.id}`);
    //setColor();
    e.preventDefault();
  };

  // override context menu ( right mouse click ) to erase the color
  const onContextMenu = (e: any) => {
    //eraseColor();
    e.preventDefault();
  };

  // if mouse is over while not pressing the mouse button and opacity is 0, set opacity to 0.18
  // if mouse is over while pressing the mouse button, set opacity to 1
  // if mouse is over while pressing the right mouse button, set opacity to 0
  const onMouseOver = (e: any) => {
    console.log(e.target.id);
    if (e.buttons === 0 && opacity === 0) {
      //setOpacity(0.18);
    } else if (e.buttons === 1) {
      //setColor();
    } else if (e.buttons === 2) {
      //eraseColor();
    }
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
        className={styles.pixel}
        style={{
          boxShadow: `${props.x}rem ${props.y}rem 0 -0.05rem ${props.color}`
        }}
      >
        <div
          id={`pixel_${props.x - 1}_${props.y - 1}`}
          className={styles.pixel}
          style={{
            top: `${props.y}rem`,
            left: `${props.x}rem`,
            backgroundColor: ownColor,
            opacity: opacity
          }}
          onMouseOver={onMouseOver}
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
