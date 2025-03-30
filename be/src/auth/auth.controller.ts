import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  Put,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { Response, Request } from "express";
import { AuthGuard } from "./auth.guard";
import { ChangePasswordDto, UpdateProfileDto } from "./dto/update-profile.dto";

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
      throw new UnauthorizedException();
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
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out successfully" });
  }

  @UseGuards(AuthGuard)
  @Put("update-profile")
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    const userId = (req.user as UserPayload).userId;
    const result = await this.authService.updateProfile(
      userId,
      updateProfileDto
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Put("change-password")
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    const userId = (req.user as UserPayload).userId; // Lấy userId từ payload JWT qua AuthGuard
    const result = await this.authService.changePassword(
      userId,
      changePasswordDto
    );
    return result;
  }
}
