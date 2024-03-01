import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async findOne(id: string) {
    return await this.usersRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user = await this.findOne(id);
    if (!user) throw new NotFoundException(`Not found ${id} user`);
    Object.assign(user, updateUserDto);
    const update = await this.usersRepository.save(user);
    return update;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException(`Not found ${id} user`);
    user.deletedAt = new Date();
    await this.usersRepository.save(user);
  }
}
