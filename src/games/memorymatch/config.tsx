import { IGameConfig } from '../';
import { MemoryMatchGame } from './game';
import { Board } from './board';

const config: IGameConfig = {
  bgioGame: MemoryMatchGame,
  bgioBoard: Board,
};

export default config;
