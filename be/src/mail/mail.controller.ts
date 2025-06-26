import { Controller, Post, Body } from "@nestjs/common";
import { MailService } from "./mail.service";

@Controller("mail")
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post("send-code-again")
  async sendCode(@Body("email") email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.mailService.sendConfirmationCode(email, code);
    // Lưu code vào DB hoặc cache nếu cần xác thực sau
    return { message: "Đã gửi mã xác nhận đến email!", code };
  }
}
