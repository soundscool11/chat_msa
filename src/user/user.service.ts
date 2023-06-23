import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../data/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(name: string): Promise<UserEntity | null> {
    const user = new UserEntity();
    user.name = name;

    try {
      await this.userRepository.save(user);
    } catch (e) {
      return null;
    }

    return user;
  }
}
