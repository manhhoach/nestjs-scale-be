import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    await this.validateUserDto(createUserDto);
    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email: email });
    if (user != null) {
      const isCorrectPassword = bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        throw new Error('Wrong password');
      }
      return user;
    }
    throw new Error('User not found');
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async validateUserDto(userDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: userDto.email });
    } catch (e) {
      return;
    }
    throw new UnprocessableEntityException('User already exists');
  }
}
