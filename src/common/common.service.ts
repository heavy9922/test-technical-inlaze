import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(to: string) {
    return await this.mailerService.sendMail({
      to,
      subject: 'Confirmación de registro',
      text: 'Por favor, haz clic en el siguiente enlace para confirmar tu registro.',
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Bootstrap demo</title>
          <style>
            img {
              width: 300px;
              height: 200px;
            }
            a {
              width: 150px;
              height: 50px;
              background-color: yellow !important;
              border-radius: 10%;
              padding: 10px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <center>
            <div>
              <h1>Confirmacion de registro de usuario nuevo</h1>
              <img
                src="https://jobs.inlaze.com/assets/imgs/inlajobs.png"
                alt="no hay imagen"
              />
              <hr />
              <h3>Bienvenido a nuestra red social, Disfrutala !!!</h3>
              <a
                href="${process.env.HOST_API}:${process.env.PORT}/api/auth/confirm?isConfirmed=true&email=${to}" target="_blank"
                >Confirmar registro</a
              >
            </div>
          </center>
        </body>
      </html>
      
            `,
    });
  }
}
