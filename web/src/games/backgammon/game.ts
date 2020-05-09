import { INVALID_MOVE } from 'boardgame.io/core';
import { Ctx, Game } from 'boardgame.io';

interface ICheckerPiece {
  id: number;
  playerID: string;
  isKing: boolean;
}

interface ICoord {
  x: number;
  y: number;
}

interface ICheckerPieceWithCoord {
  data: ICheckerPiece;
  coord: ICoord;
}

export interface IMove {
  from: ICoord;
  to: ICoord;
  jumped: ICoord;
}

type Piece = ICheckerPiece | null;
export interface IG {
  board: Piece[];
  jumping: ICheckerPieceWithCoord;
}

const piece = (id: number, player: number): ICheckerPiece => ({ id, playerID: player.toString(), isKing: false });

export const INITIAL_BOARD: Piece[] = [
  piece(0, 0),
  null,
  null,
  null,
  piece(1, 1),
  null,
  null, // bar0
  piece(2, 1),
  null,
  null,
  null,
  null,
  piece(3, 0),
  null, // home1
  piece(4, 1),
  null,
  null,
  null,
  piece(5, 0),
  null,
  null, // bar1
  piece(6, 0),
  null,
  null,
  null,
  null,
  piece(7, 1),
  null, // home0
];

const MAN_DIRS = [
  [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
  ],
  [
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ],
];

const KING_DIRS = [
  { x: -1, y: 1 },
  { x: 1, y: 1 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
];

export function sumCoords(a: ICoord, b: ICoord) {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function multiplyCoord(coord: ICoord, multiplier: number) {
  return { x: coord.x * multiplier, y: coord.y * multiplier };
}

export function inBounds(coord: ICoord) {
  return coord.x >= 0 && coord.x < 14 && coord.y >= 0 && coord.y < 2;
}

export function toCoord(position: number): ICoord {
  const x = position % 14;
  const y = Math.floor(position / 14);
  return { x, y };
}

export function toIndex(coord: ICoord) {
  return coord.x + coord.y * 14;
}

export function areCoordsEqual(a: ICoord, b: ICoord) {
  return a.x === b.x && a.y === b.y;
}

export function checkPosition(
  G: IG,
  playerID: string,
  piece: ICheckerPiece,
  coord: ICoord,
): { moves: IMove[]; jumped: boolean } {
  const dirs = piece.isKing ? KING_DIRS : MAN_DIRS[playerID as any];
  let moves: IMove[] = [];
  let jumped = false;

  for (const dir of dirs) {
    // Look into all valid directions
    let opponentBefore = null;
    for (let i = 1; piece.isKing ? true : i < 3; i++) {
      const final = sumCoords(coord, multiplyCoord(dir, i));

      // Break if move is out of bounds
      if (!inBounds(final)) {
        break;
      }

      const moveTo = G.board[toIndex(final)];

      // Break if we encounter our piece
      if (moveTo !== null && moveTo.playerID === playerID) {
        break;
      }

      if (moveTo !== null && moveTo.playerID !== playerID) {
        // If we already encountered opponent the directions is blocked
        if (opponentBefore) {
          break;
        }
        opponentBefore = final;
      }

      if (moveTo === null) {
        moves.push({ from: coord, to: final, jumped: opponentBefore });
        if (opponentBefore) {
          jumped = true;
          break;
        }

        // If there is nothing and the piece isn't king there is no need to continue
        if (!piece.isKing) {
          break;
        }
      }
    }
  }

  return { moves, jumped };
}

export function getValidMoves(G: IG, playerID: string, jumping?: ICheckerPieceWithCoord) {
  let movesTotal: IMove[] = [];
  let jumpedTotal = false;

  if (typeof jumping === 'undefined') {
    G.board.forEach((piece, index) => {
      if (piece !== null && piece.playerID === playerID) {
        const coord = toCoord(index);
        const { moves, jumped } = checkPosition(G, playerID, piece, coord);
        movesTotal.push(...moves);
        jumpedTotal = jumpedTotal || jumped;
      }
    });
  } else {
    const { moves, jumped } = checkPosition(G, playerID, jumping.data, jumping.coord);
    movesTotal = moves;
    jumpedTotal = jumped;
  }

  if (jumpedTotal) {
    return movesTotal.filter((move) => move.jumped);
  } else {
    return movesTotal;
  }
}

export function move(G: IG, ctx: Ctx, from: ICoord, to: ICoord): IG | string {
  const indexFrom = toIndex(from);
  const indexTo = toIndex(to);
  const piece = G.board[indexFrom];
  const crownhead = ctx.playerID === '0' ? 0 : 7;

  if (piece === null || piece.playerID !== ctx.playerID || G.board[indexTo] !== null) {
    return INVALID_MOVE;
  }

  const moves = G.jumping === null ? getValidMoves(G, ctx.playerID) : getValidMoves(G, ctx.playerID, G.jumping);
  const move = moves.find((move) => areCoordsEqual(move.from, from) && areCoordsEqual(move.to, to));

  if (typeof move === 'undefined') {
    return INVALID_MOVE;
  }

  const jumped = move.jumped !== null ? toIndex(move.jumped) : -1;
  const isKing = piece.isKing || to.y === crownhead;

  const newG: IG = {
    ...G,
    board: G.board.map((square, i) => {
      switch (i) {
        case indexFrom:
          return null;
        case indexTo:
          return {
            ...piece,
            isKing,
          };
        case jumped:
          return null;
        default:
          return square;
      }
    }),
    jumping: null,
  };

  if (move.jumped === null) {
    return newG;
  }

  const jumping = {
    data: {
      ...piece,
      isKing,
    },
    coord: to,
  };
  const postMoves = getValidMoves(newG, ctx.playerID, jumping);

  if (postMoves.length > 0 && postMoves[0].jumped !== null) {
    return {
      ...newG,
      jumping,
    };
  }

  return newG;
}

export const BGGame: Game<IG> = {
  name: 'backgammon',
  setup: (): IG => ({ board: INITIAL_BOARD, jumping: null }),
  moves: {
    move,
  },
  turn: {
    moveLimit: 1,
    order: {
      first: () => 0,
      next: (G: IG, ctx) => (G.jumping === null ? (ctx.playOrderPos + 1) % ctx.numPlayers : ctx.playOrderPos),
    },
  },
  endIf: (G: IG, ctx) => {
    if (getValidMoves(G, ctx.currentPlayer === '0' ? '1' : '0').length === 0) {
      return { winner: ctx.currentPlayer };
    }
  },
};
