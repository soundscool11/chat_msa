import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserCreateDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async createUser(@Req() req: any, @Body() dto: UserCreateDto) {
    return this.userService.createUser(dto.name);
  }
}
