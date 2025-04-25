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
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { Response, Request } from "express";
import { AuthGuard } from "./auth.guard";
import { ChangePasswordDto, UpdateProfileDto } from "./dto/update-profile.dto";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";

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
      throw new UnauthorizedException("User not authenticated");
    }
    return req.user;
  }

  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const result = await this.authService.login(loginUserDto, res);
    return res.json(result);
  }

  @UseGuards(AuthGuard)
  @Post("refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.refreshToken(req, res);
    return res.json(result);
  }

  @UseGuards(AuthGuard)
  @Post("logout")
  logout(@Res() res: Response) {
    res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict" });
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    return res.json({ message: "Logged out successfully" });
  }

  @UseGuards(AuthGuard)
  @Put("update-profile")
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    const user = req.user as UserPayload;
    if (!user?.userId) {
      throw new UnauthorizedException("Invalid user payload");
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
      throw new UnauthorizedException("Invalid user payload");
    }
    return this.authService.changePassword(user.userId, changePasswordDto);
  }

  @UseGuards(AuthGuard)
  @Get("get-me")
  async getMe(@Req() req: Request) {
    const user = req.user as UserPayload;
    if (!user?.userId) {
      throw new UnauthorizedException("Invalid user paylod");
    }
    return this.authService.getMe(user.userId);
  }

  @Get("google")
  @UseGuards(PassportAuthGuard("google"))
  async googleAuth() {}

  @Get("google/callback")
  @UseGuards(PassportAuthGuard("google"))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.user) {
        return res.redirect("http://localhost:3000?error=google_auth_failed");
      }
      await this.authService.googleLogin(req.user, res);
      return res.redirect("http://localhost:3000/login?success=google_auth");
    } catch (error) {
      console.error("Google callback error:", error);
      return res.redirect("http://localhost:3000?error=server_error");
    }
  }
}
