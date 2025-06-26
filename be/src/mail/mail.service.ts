import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationCode(to: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: "tantruongvan543@gmail.com",
        subject: "Mã xác nhận tài khoản",
        template: "./confirmation",
        context: { to, code },
      });
      return { message: "Email sent successfully" };
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
