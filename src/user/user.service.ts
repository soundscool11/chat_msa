import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/data/entity/user.entity';
import { CommonException } from 'src/exception/common.exception';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(name: string): Promise<UserEntity> {
    const user = new UserEntity();
    user.name = name;

    try {
      return await this.userRepository.save(user);
    } catch (e) {
      throw new CommonException(999, 'failed to create user');
    }
  }

  async getUser(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new CommonException(999, 'failed to find user');
    }

    return user;
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    try {
      const user = await this.userRepository.findOne({ where: { id: id } });
      if (!user) return null;

      return await this.userRepository.delete(user);
    } catch (e) {
      throw new CommonException(999, 'failed to delete user');
    }
  }
}
