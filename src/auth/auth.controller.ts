import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiTags } from '@nestjs/swagger';
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
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  logoutUser(@Body() token: Token) {
    return this.authService.logoutUser(token);
  }

  @Get('refresh')
  @Auth(ValidRoles.user)
  async refreshToken(@GetUser() user: User) {
    return this.authService.refreshToken(user.id);
  }
}
