import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatJoinEntity } from 'src/data/entity/chat-join.entity';
import { ChatRoomEntity } from 'src/data/entity/chat-room.entity';
import { ChatEntity } from 'src/data/entity/chat.entity';
import { UserEntity } from 'src/data/entity/user.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatLikeEntity } from 'src/data/entity/chat-like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatEntity,
      ChatRoomEntity,
      ChatJoinEntity,
      UserEntity,
      ChatLikeEntity,
    ]),
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
