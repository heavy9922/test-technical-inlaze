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
import { CommonService } from '../../common/common.service';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerOptions, MailerTransportFactory } from '@nestjs-modules/mailer';
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

    const mailerOptions: MailerOptions = {
      transport: {
        service: 'Mailjet',
        port: 587, // Puerto del servidor SMTP
        secure: false, // Si el servidor requiere una conexión segura (true para TLS, false para no usar TLS)
        auth: {
          user: process.env.MAILJET_API_KEY,
          pass: process.env.MAILJET_API_SECRET,
        },
      },
      defaults: {
        from: process.env.MAILJET_SENDER_EMAIL, // Dirección de correo electrónico predeterminada para el remitente
      },
    };
    const transportFactory: MailerTransportFactory = {
      createTransport: async () => ({
        service: 'Sendmail',
        auth: {
          user: 'tu_usuario',
          pass: 'tu_contraseña',
        },
      }),
    };
    const mailService = new MailerService(mailerOptions, transportFactory);
    const commonService = new CommonService(mailService);

    const cacheManagerInstance = await cacheManager.caching('memory');

    const userRepository: Repository<User> = request.userRepository;

    const authService = new AuthService(
      userRepository,
      jwtService,
      cacheManagerInstance,
      commonService,
    );

    const isTokenValid = await authService.validateToken(token);

    if (!isTokenValid) {
      throw new UnauthorizedException('expirent token');
    }

    return token;
  },
);
