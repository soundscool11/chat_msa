import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatJoinEntity } from 'src/data/entity/chat-join.entity';
import { ChatRoomEntity } from 'src/data/entity/chat-room.entity';
import { ChatEntity } from 'src/data/entity/chat.entity';
import { UserEntity } from 'src/data/entity/user.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatEntity,
      ChatRoomEntity,
      ChatJoinEntity,
      UserEntity,
    ]),
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
