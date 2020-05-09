import { IGameConfig } from '../index';
import { BGGame } from './game';
import { Board } from './board';

const config: IGameConfig = {
  bgioGame: BGGame,
  bgioBoard: Board,
  debug: true,
};

export default config;
