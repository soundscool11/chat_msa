import { ChatEntity } from 'src/data/entity/chat.entity';
import { UserEntity } from 'src/data/entity/user.entity';

export type ChatRoomModel = {
  id: number;
  name: string;
  users: Array<UserEntity>;
  noticeChat: ChatEntity;
  createdAt: Date;
};
