import * as React from 'react';
import { grey, red, blue } from '@material-ui/core/colors';
import css from './Shapes.css';

interface IShapeProps {
  x: number;
  y: number;
  lastSelected: boolean;
  playerId?: string;
}

const diskRadius = 0.375;
const strokeWidth = 0.05;

export const EmptyChip = (props: any) => {
  return (
    <circle
      key={`empty_circle${props.x},${props.y}`}
      cx={props.x + 0.5}
      cy={props.y + 0.5}
      r={diskRadius}
      strokeWidth={strokeWidth}
      stroke={grey[50]}
      onClick={props.onClick}
    />
  );
};

export const FilledChip = (props: IShapeProps) => {
  // let className;
  // if (props.lastSelected) {
  //   className = css.Chip;
  // } 
  console.log(props.x, props.y, props.lastSelected);
  const chipColor = props.playerId === '0' ? blue[500] : red[500];
  return (
    // <g>
    <circle
      // id={`red_chip_id${props.x}-${props.y}`}
      key={`red_circle${props.x}-${props.y}`}
      // className={css.Chip}
      // style={{ transform: `translate(${(props.x+0.5)}, ${(0.5)})` }}
      cx={props.x + 0.5}
      cy={props.y + 0.5}
      r={diskRadius}
      fill={chipColor}
      strokeWidth={strokeWidth}
      stroke={grey[50]}
    >
      {props.lastSelected ? (
        <animate
          key={`red_chip_anim_id${props.x}-${props.y}`}
          attributeType="XML"
          attributeName="cy"
          from="-1"
          to={props.y + 0.5}
          dur="2s"
          begin="0s"
          repeatCount="1"
        />
      ) : null}
    </circle>
    // </g>
    // <animate
    // id={`red_chip_anim_id${props.x}-${props.y}`}
    // key={`red_chip_anim${props.x}-${props.y}`}
    // xlinkHref={`#red_chip_id${props.x}-${props.y}`}
    // attributeName="cy"
    // begin="0s"
    // dur="2s"
    // from={`${0.5}`}
    // to={`${props.y + 0.5}`}
    // fill="freeze"
    // />
    // </g>
  );
};

