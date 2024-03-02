import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [ConfigModule, TypeOrmModule.forFeature([Post]), AuthModule],
  exports: [TypeOrmModule, PostService],
})
export class PostModule {}
