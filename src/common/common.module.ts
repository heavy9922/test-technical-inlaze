import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonService } from './common.service';
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'Mailjet',
          auth: {
            user: process.env.MAILJET_API_KEY,
            pass: process.env.MAILJET_API_SECRET,
          },
        },
        defaults: {
          from: process.env.MAILJET_SENDER_EMAIL,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CommonService],
  exports: [CommonService, MailerModule],
})
export class CommonModule {}
