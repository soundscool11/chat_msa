import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ChatJoinEntity } from './entity/chat-join.entity';
import { ChatLikeEntity } from './entity/chat-like.entity';
import { ChatRoomEntity } from './entity/chat-room.entity';
import { ChatEntity } from './entity/chat.entity';
import { ContentLikeEntity } from './entity/content-like.entity';
import { ContentEntity } from './entity/content.entity';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          database: config.get<string>('DB_NAME'),
          host: config.get<string>('DB_HOST'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PW'),
          port: config.get<number>('DB_PORT'),
          synchronize: config.get<string>('NODE_ENV') !== 'production',
          logging: false,
          namingStrategy: new SnakeNamingStrategy(),
          ssl: false,
          entities: [
            UserEntity,
            ChatJoinEntity,
            ChatRoomEntity,
            ChatEntity,
            ChatLikeEntity,
            ContentEntity,
            ContentLikeEntity,
          ],
        };
      },
    }),
  ],
})
export class DataModule {}
