import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './interfaces/login-user';
import { Token } from './interfaces/token.type';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/auth.entity';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'user was registered',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'user was login',
    type: LoginUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  @ApiResponse({
    status: 201,
    description: 'user was logout',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  logoutUser(@Body() token: Token) {
    return this.authService.logoutUser(token);
  }

  @ApiBearerAuth()
  @Get('refresh')
  @ApiResponse({
    status: 201,
    description: 'token was refreshed',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Auth(ValidRoles.user)
  async refreshToken(@GetUser() user: User) {
    return this.authService.refreshToken(user.id);
  }

  @Get('confirm')
  async confirmUser(@Query() queryParams) {
    const { isConfirmed, email } = queryParams;
    return this.authService.confirmUser(isConfirmed, email);
  }
}
