import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard as NestAuthGuard } from "@nestjs/passport";

@Injectable()
export class AuthGuard extends NestAuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context); // Kiểm tra token hợp lệ
  }
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException("Bạn chưa đăng nhập");
    }
    return user;
  }
}
