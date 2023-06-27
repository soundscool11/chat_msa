import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ChatJoinEntity } from './entity/chat-join.entity';
import { ChatLikeEntity } from './entity/chat-like.entity';
import { ChatRoomEntity } from './entity/chat-room.entity';
import { ChatEntity } from './entity/chat.entity';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          type: 'postgres',
          database: process.env.DB_NAME,
          host: process.env.DB_HOST,
          username: process.env.DB_USER,
          password: process.env.DB_PW,
          port: parseInt(process.env.DB_PORT, 10),
          synchronize: process.env.NODE_ENV === 'prod' ? false : true,
          logging: process.env.NODE_ENV === 'prod' ? false : false,
          namingStrategy: new SnakeNamingStrategy(),
          ssl:
            process.env.NODE_ENV === 'prod'
              ? { rejectUnauthorized: false }
              : false,
          entities: [
            UserEntity,
            ChatJoinEntity,
            ChatRoomEntity,
            ChatEntity,
            ChatLikeEntity,
          ],
        };
      },
    }),
  ],
})
export class DataModule {}
