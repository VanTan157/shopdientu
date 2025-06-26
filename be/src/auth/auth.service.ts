import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { ChangePasswordDto, UpdateProfileDto } from "./dto/update-profile.dto";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginUserDto: LoginUserDto, res: Response) {
    const { email, password, remember } = loginUserDto;
    const user = await this.usersService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { email: user.email, userId: user._id, type: user.type };
    const accessTokenExpiresIn = remember ? "7d" : undefined;
    const refreshTokenExpiresIn = remember ? "30d" : "7d";
    const accessTokenMaxAge = remember
      ? 7 * 24 * 60 * 60 * 1000
      : 15 * 60 * 1000;
    const refreshTokenMaxAge = remember
      ? 30 * 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000;

    const accessToken = this.jwtService.sign(
      payload,
      accessTokenExpiresIn ? { expiresIn: accessTokenExpiresIn } : undefined
    );
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpiresIn,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: accessTokenMaxAge,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: refreshTokenMaxAge,
    });

    return {
      message: "Login successful",
      user: { email: user.email, name: user.name, type: user.type },
    };
  }

  async googleLogin(user: any, res: Response) {
    if (!user || !user.googleId || !user.email) {
      throw new UnauthorizedException("Invalid Google user data");
    }

    let dbUser = await this.usersService.findByGoogleId(user.googleId);
    if (!dbUser) {
      dbUser = await this.usersService.create({
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        type: "USER",
      });
    }

    const payload = {
      email: dbUser.email,
      userId: dbUser._id,
      type: dbUser.type,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      user: { email: dbUser.email, name: dbUser.name, type: dbUser.type },
    };
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = (req as any).cookies["refreshToken"];
    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token provided");
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.userId);
      if (!user) {
        res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
        throw new UnauthorizedException("User not found");
      }

      const newPayload = {
        email: user.email,
        userId: user._id,
        type: user.type,
      };
      const newAccessToken = this.jwtService.sign(newPayload);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      return { message: "Token refreshed successfully" };
    } catch (e) {
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const updatedUser = await this.usersService.update(userId, {
      name: updateProfileDto.name,
    });
    return {
      success: true,
      message: "Cập nhật tên thành công",
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        type: updatedUser.type,
      },
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findOne(userId);
    if (!user.password) {
      throw new UnauthorizedException("Người dùng không có mật khẩu");
    }
    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password
    );
    if (!isMatch) {
      throw new UnauthorizedException("Mật khẩu cũ không đúng");
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
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        type: updatedUser.type,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.usersService.findOne(userId);
    return {
      email: user.email,
      name: user.name,
      type: user.type,
      _id: user._id,
    };
  }
}
