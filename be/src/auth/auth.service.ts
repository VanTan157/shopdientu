import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { ChangePasswordDto, UpdateProfileDto } from "./dto/update-profile.dto";
import { Request } from "express";
import * as bcrypt from "bcrypt";
import { EUserType, JwtPayload } from "src/common/types/user.types";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password, remember } = loginUserDto;
    const user = await this.usersService.validateUser(email, password);
    const payload: JwtPayload = {
      email: user.email,
      userId: String(user._id),
      type: user.type,
      name: user.name,
    };
    const accessTokenExpiresIn = remember ? "7d" : "15m";
    const refreshTokenExpiresIn = remember ? "30d" : "7d";
    const accessTokenMaxAge = remember
      ? 7 * 24 * 60 * 60 * 1000
      : 15 * 60 * 1000;
    const refreshTokenMaxAge = remember
      ? 30 * 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000;

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpiresIn,
    });

    return {
      success: true,
      message: "Đăng nhập thành công",
      data: payload,
      cookies: [
        {
          name: "accessToken",
          value: accessToken,
          options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: accessTokenMaxAge,
          },
        },
        {
          name: "refreshToken",
          value: refreshToken,
          options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: refreshTokenMaxAge,
          },
        },
      ],
    };
  }

  async googleLogin(user: any) {
    if (!user || !user.googleId || !user.email) {
      throw new BadRequestException("Dữ liệu người dùng Google không hợp lệ");
    }

    let result = await this.usersService.findByGoogleId(user.googleId);
    if (!result) {
      result = await this.usersService.create({
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        type: EUserType.USER,
      });
    }

    const dbUser = result.data;

    const payload: JwtPayload = {
      email: dbUser.email,
      userId: String(dbUser.userId),
      type: dbUser.type,
      name: dbUser.name,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });

    return {
      data: payload,
      message: "Đăng nhập thành công",
      success: true,
      cookies: [
        {
          name: "accessToken",
          value: accessToken,
          options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
          },
        },
        {
          name: "refreshToken",
          value: refreshToken,
          options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          },
        },
      ],
    };
  }

  async refreshToken(req: Request) {
    const refreshToken = (req as any).cookies["refreshToken"];
    try {
      const payload = this.jwtService.verify(refreshToken);
      const result = await this.usersService.findOne(payload.userId);
      const user = result.data;

      const newPayload: JwtPayload = {
        email: user.email,
        userId: String(user._id),
        type: user.type,
        name: user.name,
      };

      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: "15m",
      });
      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: "30d",
      });

      return {
        message: "Token refreshed successfully",
        success: true,
        data: newPayload,
        cookies: [
          {
            name: "accessToken",
            value: newAccessToken,
            options: {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 15 * 60 * 1000,
            },
          },
          {
            name: "refreshToken",
            value: newRefreshToken,
            options: {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            },
          },
        ],
      };
    } catch (e) {
      (req as any).res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
      });
      throw new UnauthorizedException("Refresh token không hợp lệ");
    }
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const updatedUser = await this.usersService.update(userId, {
      name: updateProfileDto.name,
    });
    return {
      success: true,
      message: "Cập nhật tên thành công",
      data: {
        email: updatedUser.email,
        name: updatedUser.name,
        type: updatedUser.type,
      },
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const result = await this.usersService.findOne(userId);
    const user = result.data;
    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password
    );
    if (!isMatch) {
      throw new BadRequestException("Mật khẩu cũ không đúng");
    }

    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      saltRounds
    );

    const updatedUser = await this.usersService.update(userId, {
      password: newHashedPassword,
    });
    return {
      success: true,
      message: "Đổi mật khẩu thành công",
      data: {
        email: updatedUser.email,
        name: updatedUser.name,
        type: updatedUser.type,
      },
    };
  }

  async getMe(userId: string) {
    const result = await this.usersService.findOne(userId);
    const user = result.data;
    return {
      success: true,
      message: "Lấy thông tin người dùng thành công",
      data: {
        email: user.email,
        name: user.name,
        type: user.type,
        userId: String(user._id),
      },
    };
  }
}
