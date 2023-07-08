import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root(@Query('roomId') roomId: number, @Query('userId') userId: number) {
    return { roomId, userId };
  }
}
