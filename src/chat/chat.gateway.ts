import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatJoinSocketDto, ChatMessageSocketDto } from './dto/chat.dto';

@WebSocketGateway({
  transport: ['websocket'],
  namespace: '/',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  private socketRoomName(roomId: number) {
    return `room:${roomId}`;
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() body: ChatJoinSocketDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const chatRoom = await this.chatService.getRoom(body.roomId);
      socket.join(this.socketRoomName(body.roomId));

      socket.emit('room', {
        room: chatRoom,
      });
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('message')
  async send(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: ChatMessageSocketDto,
  ) {
    try {
      const chatEntity = await this.chatService.createChat(
        body.userId,
        body.roomId,
        body.message,
      );

      const chatModel = await this.chatService.convertChatModel(chatEntity);

      this.server.to(this.socketRoomName(body.roomId)).emit('message', {
        chat: chatModel,
      });
    } catch (e) {
      console.log(e);
    }
  }
}
