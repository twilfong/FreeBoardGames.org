import { IGameConfig } from '../index';
import { ColonizersGame } from './game';
import { Board } from './board';

const config: IGameConfig = {
  bgioGame: ColonizersGame,
  bgioBoard: Board,
};

export default config;