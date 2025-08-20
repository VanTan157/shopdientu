import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  Put,
  Get,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { Response, Request } from "express";
import { AuthGuard } from "./auth.guard";
import { ChangePasswordDto, UpdateProfileDto } from "./dto/update-profile.dto";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";
import { CookieInterceptor } from "src/common/interceptors/cookie.interceptor";

interface UserPayload {
  userId: string;
  email: string;
  type: string;
  name: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Post("me")
  async getProfile(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException("Người dùng chưa xác thực");
    }
    return {
      success: true,
      message: "Lấy thông tin người dùng thành công",
      data: req.user,
    };
  }

  @UseInterceptors(CookieInterceptor)
  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseInterceptors(CookieInterceptor)
  @UseGuards(AuthGuard)
  @Post("refresh")
  refresh(@Req() req: Request) {
    return this.authService.refreshToken(req);
  }

  @UseGuards(AuthGuard)
  @Post("logout")
  logout(@Res() res: Response) {
    res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict" });
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    return res.json({ message: "Đăng xuất thành công", success: true });
  }

  @UseGuards(AuthGuard)
  @Put("update-profile")
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    const user = req.user as UserPayload;
    if (!user?.userId) {
      throw new UnauthorizedException("Thông tin người dùng không hợp lệ");
    }
    return this.authService.updateProfile(user.userId, updateProfileDto);
  }

  @UseGuards(AuthGuard)
  @Put("change-password")
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    const user = req.user as UserPayload;
    if (!user?.userId) {
      throw new UnauthorizedException("Thông tin người dùng không hợp lệ");
    }
    return this.authService.changePassword(user.userId, changePasswordDto);
  }

  @UseGuards(AuthGuard)
  @Get("get-me")
  async getMe(@Req() req: Request) {
    const user = req.user as UserPayload;
    if (!user?.userId) {
      throw new UnauthorizedException("Thông tin người dùng không hợp lệ");
    }
    return this.authService.getMe(user.userId);
  }

  @Get("google")
  @UseGuards(PassportAuthGuard("google"))
  async googleAuth() {}

  @Get("google/callback")
  @UseGuards(PassportAuthGuard("google"))
  @UseInterceptors(CookieInterceptor)
  async googleAuthRedirect(@Req() req: Request) {
    try {
      if (!req.user) {
        return (req as any).res.redirect(
          "http://localhost:3000?error=google_auth_failed"
        );
      }
      await this.authService.googleLogin(req.user);
      return (req as any).res.redirect(
        "http://localhost:3000/login?success=google_auth"
      );
    } catch (error) {
      console.error("Google callback error:", error);
      return (req as any).res.redirect(
        "http://localhost:3000?error=server_error"
      );
    }
  }
}
