import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatJoinEntity } from './chat-join.entity';

@Entity({ name: 'chat_room' })
export class ChatRoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ChatJoinEntity, (cj) => cj.room)
  chatJoins: Array<ChatJoinEntity>;

  @CreateDateColumn()
  createdAt: Date;
}
