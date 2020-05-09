const Thumbnail = require('./media/thumbnail.png?lqip-colors');
import { GameMode } from 'components/App/Game/GameModePicker';
import { IGameDef } from 'games';
import instructions from './instructions.md';

export const backgammonGameDef: IGameDef = {
  code: 'backgammon',
  name: 'Backgammon-WIP',
  imageURL: Thumbnail,
//  modes: [{ mode: GameMode.AI }, { mode: GameMode.OnlineFriend }, { mode: GameMode.LocalFriend }],
  modes: [{ mode: GameMode.OnlineFriend }, { mode: GameMode.LocalFriend }],
  minPlayers: 2,
  maxPlayers: 2,
  description: 'a Classic Game',
  descriptionTag: `Play Backgammon locally or online against friends!`,
  instructions: {
    videoId: '',
    text: instructions,
  },
  config: () => import('./config'),
  aiConfig: () => import('./ai'),
};
