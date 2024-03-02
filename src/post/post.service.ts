import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger('PostService');
  constructor(
    @InjectRepository(Post)
    private readonly posRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    try {
      let post = {
        ...createPostDto,
        user,
      };
      return await this.posRepository.save(post);
    } catch (err) {
      this.handleException(err);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    let count: number;
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      let resp = await this.posRepository.find({
        take: limit,
        skip: offset,
        relations: {
          user: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      resp = resp.filter((post) => post.user.id === user.id);
      count = await this.posRepository.count();
      console.log(count);
      count = Math.ceil(count / limit);
      return {
        count: limit,
        page: offset,
        countPage: count,
        data: resp,
      };
    } catch (err) {
      this.handleException(err);
    }
  }

  async findOne(id: number) {
    return await this.posRepository.findOneBy({ id });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    let post = await this.findOne(id);
    if (!post) throw new NotFoundException(`Not found ${id} post`);
    Object.assign(post, updatePostDto);
    const update = await this.posRepository.save(post);
    return update;
  }

  async updateLikes(id: number) {
    let post = await this.findOne(id);
    if (!post) throw new NotFoundException(`Not found ${id} post`);
    let likes = post.likes + 1;
    let newlikes = { ...post, likes };
    const update = await this.posRepository.save(newlikes);
    return update;
  }

  async updateDislike(id: number) {
    let post = await this.findOne(id);
    if (!post) throw new NotFoundException(`Not found ${id} post`);
    let likes = post.likes - 1;
    let newlikes = { ...post, likes };
    const update = await this.posRepository.save(newlikes);
    return update;
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    if (!post) throw new NotFoundException(`Not found ${id} post`);
    post.deletedAt = new Date();
    return await this.posRepository.save(post);
  }

  private handleException(err: any) {
    if (err.code === '23505') throw new BadRequestException(err.detail);
    this.logger.error(err);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
