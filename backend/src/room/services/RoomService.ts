import { RoomDb } from '../../db/RoomDb';
import { Room, NewRoomResponse, NewRoomResponseStatus } from '../../../../common/dto/Room';
import { UserDb } from '../../db/UserDb';
import { UserInRoomDb } from '../../db/UserInRoomDb';

export class RoomService {
  public static async newRoom(userDbEntity: UserDb, room: Room) {
    const roomDbEntity = new RoomDb();
    roomDbEntity.capacity = room.capacity;
    roomDbEntity.gameCode = room.gameCode;
    roomDbEntity.unlisted = room.unlisted;
    await roomDbEntity.save();

    const userInRoom = new UserInRoomDb();
    userInRoom.room = roomDbEntity;
    userInRoom.user = userDbEntity;
    await userInRoom.save();

    const response: NewRoomResponse = { status: NewRoomResponseStatus.Success, room: roomDbEntity };
    return response;
  }

  public static async listRooms(): Promise<RoomDb[]> {
    return await RoomDb.find({
      where: { unlisted: false },
      relations: ['users'],
    });
  }

  public static async getRoom(id: number): Promise<RoomDb | undefined> {
    return await RoomDb.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  public static async isUserInRoom(room: RoomDb, user: UserDb): Promise<boolean> {
    const roomUsersIds = room.userInRooms.map((uir) => uir.user.id);
    const userID = user.id;
    return roomUsersIds.includes(userID);
  }

  public static async joinRoom(room: RoomDb, user: UserDb) {
    const userInRoom = new UserInRoomDb();
    userInRoom.user = user;
    userInRoom.room = room;
    room.userInRooms.push(userInRoom);
    await room.save();
  }

  public static async leaveRoom(room: RoomDb, user: UserDb) {
    const roomUsers = room.userInRooms.filter((userInRoom) => userInRoom.user.id !== user.id);
    room.userInRooms = roomUsers;
    await room.save();
  }
}
