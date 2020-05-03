import { User } from './User';

export interface Room {
  id?: number;
  capacity: number;
  gameCode: string;
  unlisted: boolean;
  userInRooms: UserInRoom[];
  currentUserId?: number;
}

export interface UserInRoom {
  id?: number;
  user: User;
  room: Room;
};

export interface NewRoomResponse {
  status: NewRoomResponseStatus;
  room?: Room;
}

export enum NewRoomResponseStatus {
  Success = 'success',
  Exception = 'exception',
  // NicknameInUse = 'nicknameinuse',  // TODO(JasonHarrison) are we checking for dups?
}
