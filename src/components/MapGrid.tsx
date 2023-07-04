import React from 'react';
import styles from '../styles/Home.module.css';
import MapSector from './MapSector';

interface MapGridProps {
  sector: [x: number, y: number] | undefined;
  setSector(sector: [x: number, y: number]): void;
  setPixel(pixel: [x: number, y: number] | undefined): void;
  updated: number;
}
export default function MapGrid(props: MapGridProps): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const [sectors, setSectors] = React.useState<Array<JSX.Element>>([]);
  React.useEffect(() => {
    updateSectors();
  }, [props.sector, props.updated]);

  const updateSectors = () => {
    // create a two dimensional array of Pixel components
    const grid: typeof sectors = [];

    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        let color = '#000000';
        if (props.sector && props.sector[0] === x && props.sector[1] === y) {
          color = '#111111';
        }
        grid.push(
          <MapSector
            x={x}
            y={y}
            color={color}
            key={`${x}sector${y}`}
            sector={props.sector}
            setSector={props.setSector}
            setPixel={props.setPixel}
            updated={props.updated}
          />
        );
      }
    }
    // set the grid
    setSectors(grid);
  };
  return (
    <div ref={ref} className={styles.grid}>
      {sectors}
    </div>
  );
}
