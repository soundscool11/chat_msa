import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatLikeEntity } from './chat-like.entity';
import { ChatRoomEntity } from './chat-room.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'chat' })
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  sender: UserEntity;

  @Column()
  senderId: number;

  @ManyToOne(() => ChatRoomEntity)
  room: ChatRoomEntity;

  @Column()
  roomId: number;

  @OneToMany(() => ChatLikeEntity, (cl) => cl.chat)
  likes: Array<ChatLikeEntity>;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
