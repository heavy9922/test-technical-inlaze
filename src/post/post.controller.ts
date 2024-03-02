import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/auth.entity';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Auth(ValidRoles.user)
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  @Auth(ValidRoles.user)
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.user)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Put(':id')
  @Auth(ValidRoles.user)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Put('likes/:id')
  updateLikes(@Param('id') id: string) {
    return this.postService.updateLikes(+id);
  }

  @Put('dislikes/:id')
  updateDislikes(@Param('id') id: string) {
    return this.postService.updateDislike(+id);
  }

  @Delete(':id')
  @Auth(ValidRoles.user)
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
