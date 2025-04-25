import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { ChangePasswordDto, UpdateProfileDto } from "./dto/update-profile.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginUserDto: LoginUserDto, res: any) {
    const { email, password } = loginUserDto;
    const user = await this.usersService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Tạo payload cho JWT
    const payload = { email: user.email, sub: user._id, type: user.type };

    // Tạo accessToken và refreshToken
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" }); // Refresh token hết hạn sau 7 ngày

    // Gửi tokens và role qua cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Chỉ dùng secure trong production
      maxAge: 15 * 60 * 1000, // 15 phút
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return {
      message: "Login successful",
      user: { email: user.email, name: user.name, type: user.type },
    };
  }

  async googleLogin(req: any, res: any) {
    if (!req.user) {
      throw new UnauthorizedException("No user from Google");
    }

    const { email, name, googleId } = req.user;

    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create({
        email,
        name,
        googleId,
        type: "USER",
      });
    } else if (!user.googleId) {
      user = await this.usersService.update(user._id as string, { googleId });
    }

    const payload = {
      email: user.email,
      sub: user._id,
      type: user.type,
      name: user.name,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: "Google login successful",
      user: { email: user.email, name: user.name, type: user.type },
    };
  }

  async refreshToken(req: any, res: any) {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token provided");
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub); // Lấy thông tin user từ database

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const newPayload = { email: user.email, sub: user._id, type: user.type };
      const newAccessToken = this.jwtService.sign(newPayload);

      // Gửi accessToken và role mới qua cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000, // 15 phút
      });

      return { message: "Token refreshed successfully" };
    } catch (e) {
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
      user: updatedUser,
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
      user: updatedUser,
      message: "Đổi mật khẩu thành công",
    };
  }

  async getMe(userId: string) {
    const user = await this.usersService.findOne(userId);
    return user;
  }
}
