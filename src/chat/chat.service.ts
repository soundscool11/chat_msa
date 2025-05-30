import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatJoinEntity } from 'src/data/entity/chat-join.entity';
import { ChatLikeEntity } from 'src/data/entity/chat-like.entity';
import { ChatRoomEntity } from 'src/data/entity/chat-room.entity';
import { ChatEntity } from 'src/data/entity/chat.entity';
import { UserEntity } from 'src/data/entity/user.entity';
import { CommonException } from 'src/exception/common.exception';
import { In, Repository } from 'typeorm';
import { ChatModel, ChatRoomModel } from './model/chat.models';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
    @InjectRepository(ChatRoomEntity)
    private chatRoomRepository: Repository<ChatRoomEntity>,
    @InjectRepository(ChatJoinEntity)
    private chatJoinRepository: Repository<ChatJoinEntity>,
    @InjectRepository(ChatLikeEntity)
    private chatLikeRepository: Repository<ChatLikeEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createRoom(name: string): Promise<ChatRoomModel> {
    try {
      const room = new ChatRoomEntity();
      room.name = name;

      await this.chatRoomRepository.save(room);

      return await this.getRoom(room.id);
    } catch (e) {
      console.log(e);
      throw new CommonException(999, 'failed to create room');
    }
  }

  async getRoom(id: number): Promise<ChatRoomModel> {
    const roomEntity = await this.getRoomEntity(id);

    if (!roomEntity) {
      throw new CommonException(999, 'invalid room id');
    }

    const userIds = roomEntity.chatJoins.map((e) => e.userId);

    return {
      ...roomEntity,
      users: await this.userRepository.find({
        where: {
          id: In(userIds),
        },
      }),
    };
  }

  async getRoomList(
    userId: number,
    lastRoomId: number,
    size: number,
  ): Promise<Array<ChatRoomEntity>> {
    if (userId > 0) {
      return await this.chatRoomRepository
        .createQueryBuilder('cr')
        .innerJoin(
          ChatJoinEntity,
          'cj',
          `cj.roomId = cr.id and cj.userId = ${userId}`,
        )
        .andWhere(`cr.id < ${lastRoomId}`)
        .orderBy('cr.id', 'DESC')
        .limit(size)
        .getMany();
    } else {
      return await this.chatRoomRepository.find({
        order: { id: 'desc' },
        take: size,
      });
    }
  }

  async join(userId: number, roomId: number) {
    const join = await this.chatJoinRepository.findOne({
      where: {
        userId: userId,
        roomId: roomId,
      },
    });

    if (join) {
      return;
    }

    const chatJoin = new ChatJoinEntity();
    chatJoin.userId = userId;
    chatJoin.roomId = roomId;

    try {
      await this.chatJoinRepository.save(chatJoin);
    } catch (e) {
      throw new CommonException(999, 'failed to join chat');
    }
  }

  async getRoomEntity(id: number): Promise<ChatRoomEntity> {
    try {
      return await this.chatRoomRepository.findOne({
        where: { id: id },
        relations: { chatJoins: true, noticeChat: true },
      });
    } catch (e) {
      throw new CommonException(999, 'failed to find entity');
    }
  }

  async getChatMessages(
    searchUserId: number,
    roomId: number,
    lastChatId: number,
    size: number,
  ): Promise<Array<ChatModel>> {
    const chatList = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect(
        'chat.likes',
        'chat_like',
        `chat_like.userId = ${searchUserId}`,
      )
      .innerJoinAndSelect('chat.sender', 'user', 'chat.senderId = user.id')
      .where(`chat.roomId = ${roomId}`)
      .andWhere(`chat.id < ${lastChatId}`)
      .orderBy(`chat.id`, 'DESC')
      .limit(size)
      .getMany();

    const chatModelList = chatList.map(async (entity) => {
      return await this.convertChatModel(entity);
    });

    return await Promise.all(chatModelList);
  }

  async convertChatModel(entity: ChatEntity) {
    const chatLikes = await this.chatLikeRepository.find({
      where: {
        chatId: entity.id,
      },
    });

    return {
      id: entity.id,
      content: entity.content,
      sender: entity.sender,
      senderId: entity.senderId,
      roomId: entity.roomId,
      liked: entity.likes.length > 0,
      likeCount: chatLikes.length,
      createdAt: entity.createdAt,
    };
  }

  async createChat(
    userId: number,
    roomId: number,
    message: string,
  ): Promise<ChatEntity> {
    const chat = new ChatEntity();
    chat.senderId = userId;
    chat.roomId = roomId;
    chat.content = message;

    await this.chatRepository.save(chat);

    return await this.chatRepository.findOne({
      where: {
        id: chat.id,
      },
      relations: {
        sender: true,
        likes: true,
      },
    });
  }

  async likeChat(userId: number, chatId: number) {
    const chatLike = await this.chatLikeRepository.findOne({
      where: {
        userId: userId,
        chatId: chatId,
      },
    });

    if (chatLike) {
      return;
    }

    try {
      const chatLike = new ChatLikeEntity();
      chatLike.userId = userId;
      chatLike.chatId = chatId;

      await this.chatLikeRepository.save(chatLike);
    } catch (error) {
      throw new CommonException(999, 'failed to create chat like');
    }
  }

  async noticeChat(roomId: number, chatId: number) {
    const room = await this.chatRoomRepository.findOne({
      where: {
        id: roomId,
      },
    });

    room.noticeChatId = chatId;

    try {
      await this.chatRoomRepository.save(room);
    } catch (error) {
      throw new CommonException(999, 'failed to notice chat');
    }
  }
}
