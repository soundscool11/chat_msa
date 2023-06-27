import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatJoinEntity } from './chat-join.entity';
import { ChatEntity } from './chat.entity';

@Entity({ name: 'chat_room' })
export class ChatRoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ChatJoinEntity, (cj) => cj.room)
  chatJoins: Array<ChatJoinEntity>;

  @OneToOne(() => ChatEntity, { nullable: true })
  @JoinColumn()
  noticeChat: ChatEntity;

  @Column({ nullable: true })
  noticeChatId: number;

  @CreateDateColumn()
  createdAt: Date;
}
