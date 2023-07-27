import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly chatService: ChatService,
  ) {}

  @Get()
  @Render('index')
  async root(@Query('roomId') roomId: number, @Query('userId') userId: number) {
    const messages = await this.chatService.getChatMessages(
      userId,
      roomId,
      ~(1 << 31),
      10,
    );

    const room = await this.chatService.getRoom(roomId);

    return {
      roomId,
      userId,
      messages: messages.reverse(),
      notice:
        room.noticeChat !== null ? room.noticeChat.content : '공지가 없습니다',
    };
  }
}
