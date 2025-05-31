import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ChatRoomEntity } from 'src/data/entity/chat-room.entity';
import { ChatService } from './chat.service';
import {
  ChatCreateDto,
  ChatJoinDto,
  ChatLikeDto,
  ChatNoticeDto,
  ChatRoomCreateDto as RoomCreateDto,
} from './dto/chat.dto';
import { ChatModel, ChatRoomModel } from './model/chat.models';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 채팅방 생성
  // localhost:3000/chat/room
  @Post('/room')
  async createRoom(
    @Req() req: any,
    @Body() dto: RoomCreateDto,
  ): Promise<ChatRoomModel> {
    return await this.chatService.createRoom(dto.name);
  }

  // 채팅방 조회
  // localhost:3000/chat/room?roomId=1
  @Get('/room')
  async getRoom(
    @Req() req: any,
    @Query('roomId') roomId: number,
  ): Promise<ChatRoomModel> {
    return await this.chatService.getRoom(roomId);
  }

  // 채팅방 전체 목록 조회 (최신순 & 상위 n개)
  // localhost:3000/chat/room/list?userId=1&lastRoomId=0&size=10
  @Get('/room/list')
  async getRoomList(
    @Req() req: any,
    @Query('userId') userId: number,
    @Query('lastRoomId') lastRoomId: number,
    @Query('size') size: number,
  ): Promise<Array<ChatRoomEntity>> {
    return await this.chatService.getRoomList(userId, lastRoomId, size);
  }

  // 채팅방 참여
  // localhost:3000/chat/room/join
  // body: { userId: 1, roomId: 1 }
  @Post('/room/join')
  async joinRoom(@Req() req: any, @Body() dto: ChatJoinDto) {
    return await this.chatService.join(dto.userId, dto.roomId);
  }

  // 채팅방 알림
  // localhost:3000/chat/room/notice
  // body: { roomId: 1, chatId: 1 }
  @Post('/room/notice')
  async noticeRoom(@Req() req: any, @Body() dto: ChatNoticeDto) {
    return await this.chatService.noticeChat(dto.roomdId, dto.chatId);
  }

  // 메세지 좋아요
  // localhost:3000/chat/message/like
  // body: { userId: 1, chatId: 1 }
  @Post('/message/like')
  async likeMessage(@Req() req: any, @Body() dto: ChatLikeDto) {
    return await this.chatService.likeChat(dto.userId, dto.chatId);
  }

  // 메세지 목록 조회 (최신순 & 상위 n개)
  // localhost:3000/chat/message/list?userId=1&roomId=1&lastChatId=0&size=10
  // userId는 null일 경우 0으로 처리
  @Get('/message/list')
  async listMessage(
    @Req() req: any,
    @Query('userId') userId: number | undefined | null,
    @Query('roomId') roomId: number,
    @Query('lastChatId') lastChatId: number,
    @Query('size') size: number,
  ): Promise<Array<ChatModel>> {
    return await this.chatService.getChatMessages(
      userId > 0 ? userId : 0,
      roomId,
      lastChatId,
      size,
    );
  }

  // 메세지 보내기
  // localhost:3000/chat/message
  // body: { userId: 1, roomId: 1, message: 'hello' }
  @Post('/message')
  async createMessage(@Body() dto: ChatCreateDto) {
    return await this.chatService.createChat(
      dto.userId,
      dto.roomId,
      dto.message,
    );
  }
}
