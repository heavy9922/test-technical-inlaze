import {
  BadRequestException,
  Inject,
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { generateKey } from '../utils/redis';
import { Redis, RedisLogin } from './interfaces/redis.interface';
@Injectable()
export class AuthService {
  private readonly logger = new Logger('auth');
  private readonly blacklist: Set<string> = new Set<string>();
  constructor(
    @InjectRepository(User)
    private readonly userReporyEntity: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async loginRedis(loginUserDto: LoginUserDto) {
    let data: RedisLogin;
    let key: string = generateKey(loginUserDto.email);
    let keyString: string = `${loginUserDto.email}-login.${key}`;
    let cache: RedisLogin = await this.cacheManager.get(keyString);
    if (!cache) {
      data = await this.loginUser(loginUserDto);
      await this.cacheManager.set(keyString, data, 1000000 * 36); // 36 equivale a una hora cache
    } else {
      data = cache;
    }
    return data;
  }
  async login(loginUserDto: LoginUserDto) {
    let data: RedisLogin;
    if (process.env.REDIS) {
      data = await this.loginRedis(loginUserDto);
    } else {
      data = await this.loginUser(loginUserDto);
    }
    return data;
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
