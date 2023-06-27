import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'chat_like' })
export class ChatLikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  chatId: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => ChatEntity, (c) => c.chatLikes)
  chat: ChatEntity;

  @CreateDateColumn()
  createdAt: Date;
}
