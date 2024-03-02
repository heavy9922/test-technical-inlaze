import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/auth.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('post')
@ApiTags('Post')
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'post was registered',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Auth(ValidRoles.user)
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  @ApiResponse({
    status: 201,
    description: 'post was found',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Auth(ValidRoles.user)
  // @JwtAuthGuard()
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User,
  ) {
    return this.postService.findAll(paginationDto, user);
  }

  @Get(':id')
  @ApiResponse({
    status: 201,
    description: 'post was found',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Auth(ValidRoles.user)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Put(':id')
  @ApiResponse({
    status: 201,
    description: 'post was updated',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Auth(ValidRoles.user)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Put('likes/:id')
  @ApiResponse({
    status: 201,
    description: 'post was likes',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  updateLikes(@Param('id') id: string) {
    return this.postService.updateLikes(+id);
  }

  @Put('dislikes/:id')
  @ApiResponse({
    status: 201,
    description: 'post was dislikes',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  updateDislikes(@Param('id') id: string) {
    return this.postService.updateDislike(+id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'post was deleted',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Auth(ValidRoles.user)
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
