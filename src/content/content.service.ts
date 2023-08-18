import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentLikeEntity } from 'src/data/entity/content-like.entity';
import { ContentEntity } from 'src/data/entity/content.entity';
import { CommonException } from 'src/exception/common.exception';
import { Repository } from 'typeorm';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentEntity)
    private contentRepository: Repository<ContentEntity>,
    @InjectRepository(ContentLikeEntity)
    private contentLikeRepository: Repository<ContentLikeEntity>,
  ) {}

  async createContent(
    title: string,
    content: string,
    userId: number,
  ): Promise<ContentEntity> {
    try {
      const post = new ContentEntity();
      post.creatorId = userId;
      post.data = content;
      post.title = title;

      await this.contentRepository.save(post);

      return post;
    } catch (e) {
      console.log(e);
      throw new CommonException(999, 'failed to create post');
    }
  }

  async getContent(contentId: number): Promise<ContentEntity> {
    try {
      const post = await this.contentRepository.findOne({
        where: {
          id: contentId,
        },
      });

      if (!post) {
        throw new NotFoundException('failed to find post');
      }

      return post;
    } catch (e) {
      console.log(e);
      throw new CommonException(999, 'failed to get post');
    }
  }

  async likeContent(contentId: number, userId: number) {
    try {
      const postLike = new ContentLikeEntity();
      postLike.userId = userId;
      postLike.contentId = contentId;

      await this.contentLikeRepository.save(postLike);
    } catch (e) {
      console.log(e);
      throw new CommonException(999, 'failed to create post like');
    }
  }
}
