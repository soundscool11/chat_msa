import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentLikeEntity } from 'src/data/entity/content-like.entity';
import { ContentEntity } from 'src/data/entity/content.entity';
import { UserEntity } from 'src/data/entity/user.entity';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentEntity, ContentLikeEntity, UserEntity]),
  ],
  providers: [ContentService],
  exports: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}
