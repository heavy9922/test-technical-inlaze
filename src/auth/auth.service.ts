import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './interfaces/login-user';
import { Token } from './interfaces/token.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('auth');
  private readonly blacklist: Set<string> = new Set<string>();
  constructor(
    @InjectRepository(User)
    private readonly userReporyEntity: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    try {
      const { password, ...userData } = createAuthDto;

      const user = this.userReporyEntity.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userReporyEntity.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (err) {
      this.handleException(err);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userReporyEntity.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    if (!user)
      throw new UnauthorizedException('Credentials are no valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are no valid (password)');
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  logoutUser(token: Token) {
    this.blacklist.add(token);
  }

  async validateToken(token: string): Promise<boolean> {
    return !this.blacklist.has(token);
  }

  async refreshToken(userId: string) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const payload = { id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async findUserById(id: string) {
    const user = await this.userReporyEntity.findOneBy({ id });
    return user;
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleException(err: any): never {
    if (err.code === '23505') throw new BadRequestException(err.detail);
    this.logger.error(err);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
