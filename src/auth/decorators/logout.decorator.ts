import {
  createParamDecorator,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as cacheManager from 'cache-manager';
import { User } from '../entities/auth.entity';
import { AuthService } from '../auth.service';

export const JwtAuthGuard = createParamDecorator(
  async (_, ctx: ExecutionContext) => {
    // const request = switchToHttp().getRequest();
    const request = ctx.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authorizationHeader.split(' ')[1];

    const jwtService = new JwtService({});

    const cacheManagerInstance = await cacheManager.caching('memory');

    const userRepository: Repository<User> = request.userRepository;

    const authService = new AuthService(
      userRepository,
      jwtService,
      cacheManagerInstance,
    );

    const isTokenValid = await authService.validateToken(token);

    if (!isTokenValid) {
      throw new UnauthorizedException('expirent token');
    }

    return token;
  },
);
