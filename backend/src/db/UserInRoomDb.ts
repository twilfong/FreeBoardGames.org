import {
  Entity,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserDb } from './UserDb';
import { RoomDb } from './RoomDb';

@Entity()
export class UserInRoomDb extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne((type) => UserDb, (userDb) => userDb.userInRooms)
  public user!: UserDb;

  @ManyToOne((type) => RoomDb, (roomDb) => roomDb.userInRooms)
  public room!: RoomDb;
}

export interface UserDevice {
  token: string;
}
