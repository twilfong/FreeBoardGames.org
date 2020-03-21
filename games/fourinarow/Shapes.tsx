import * as React from 'react';
import { grey, red, blue } from '@material-ui/core/colors';
import css from './Shapes.css';

interface IShapeProps {
  x: number;
  y: number;
  lastSelected: boolean;
}

const diskRadius = 0.375;
const strokeWidth = 0.05;

export const EmptyDisk = (props: any) => {
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

export const CircleRed = (props: IShapeProps) => {
  return (
    // <g>
    <circle
      // id={`red_chip_id${props.x}-${props.y}`}
      key={`red_circle${props.x}-${props.y}`}
      // className={`${css.Chip} Chip`}
      // style={{ transform: `translate(${(props.x+0.5)}, ${(0.5)})` }}
      cx={props.x + 0.5}
      cy={props.y + 0.5}
      r={diskRadius}
      fill={red[500]}
      strokeWidth={strokeWidth}
      stroke={grey[50]}
    >
      {props.lastSelected ? (
        <animate
          id={`red_chip_anim_id${props.x}-${props.y}`}
          attributeType="XML"
          attributeName="cy"
          from="-1"
          to={props.y + 0.5}
          dur="1s"
          begin="1s"
          repeatCount="2"
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

export const CircleBlue = (props: IShapeProps) => {
  return (
    <circle
      key={`blue_circle${props.x},${props.y}`}
      className={`${css.Chip} Chip`}
      style={{ transform: `translate(${0}, ${+5})` }}
      cx={props.x + 0.5}
      cy={props.y + 0.5}
      r={diskRadius}
      fill={blue[500]}
      strokeWidth={strokeWidth}
      stroke={grey[50]}
    />
  );
};
