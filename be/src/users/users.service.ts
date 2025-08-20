import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./entities/user.entity";
import { Model, Types } from "mongoose";
import * as bcrypt from "bcrypt";
import { MailService } from "src/mail/mail.service";
import { ApiResponse } from "src/common/types/api";
import { A, I } from "framer-motion/dist/types.d-B50aGbjN";
import { JwtPayload } from "src/common/types/user.types";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<JwtPayload>> {
    const existingUser = await this.userModel
      .findOne({
        $or: [
          { email: createUserDto.email },
          ...(createUserDto.googleId !== undefined
            ? [{ googleId: createUserDto.googleId }]
            : []),
        ],
      })
      .exec();
    if (existingUser) {
      throw new ConflictException("Email hoặc Google ID đã tồn tại");
    }

    const saltRounds = 10;
    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, saltRounds)
      : undefined;

    let code: string | undefined;
    let expireAt: Date | undefined;
    let isActive = false;

    if (createUserDto.googleId) {
      isActive = true;
    } else {
      code = Math.floor(100000 + Math.random() * 900000).toString();
      expireAt = new Date();
      expireAt.setMinutes(expireAt.getMinutes() + 15);
    }

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      code,
      expireAt,
      isActive: isActive,
    });
    if (!createUserDto.googleId) {
      await this.mailService.sendConfirmationCode(
        createUserDto.email,
        code as string
      );
    }

    const savedUser = await newUser.save();
    const payload: JwtPayload = {
      email: savedUser.email,
      userId: String(savedUser._id),
      type: savedUser.type,
      name: savedUser.name,
    };
    return {
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.",
      data: payload,
      success: true,
    };
  }

  async verifyCode(email: string, code: string): Promise<ApiResponse<User>> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException("Email không tồn tại");
    }
    if (code !== user?.code) {
      throw new BadRequestException("Mã xác thực không chính xác");
    }

    const now = new Date();
    if (!user.expireAt || user.expireAt < now) {
      throw new BadRequestException("Mã xác nhận đã hết hạn");
    }

    user.isActive = true;
    user.code = "";
    user.expireAt = undefined;
    await user.save();

    return {
      message: "Xác thực thành công",
      data: user,
      success: true,
    };
  }

  async sendConfirmationCode(email: string, code: string) {
    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + 15);
    const user = await this.userModel
      .findOneAndUpdate({ email }, { expireAt, code })
      .exec();
    if (!user) {
      throw new NotFoundException("Người dùng với email trên không tồn tại");
    }
    if (user.isActive) {
      throw new ConflictException("Tài khoản đã được kích hoạt");
    }
    await this.mailService.sendConfirmationCode(email, code);
  }

  async paginationSearch(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ApiResponse<User[]>> {
    const currentPage = Math.max(1, page);
    const itemsPerPage = Math.max(1, limit);
    const skip = (currentPage - 1) * itemsPerPage;

    const query: any = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const totalItems = await this.userModel.countDocuments(query).exec();
    const users = await this.userModel
      .find(query)
      .skip(skip)
      .limit(itemsPerPage)
      .exec();

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      message: "Lấy danh sách người dùng thành công",
      data: users,
      success: true,
    };
  }

  async findAll(): Promise<ApiResponse<User[]>> {
    const users = await this.userModel.find().exec();
    return {
      message: "Lấy danh sách người dùng thành công",
      data: users,
      success: true,
    };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID người dùng không hợp lệ");
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("Người dùng không tồn tại");
    }
    return {
      success: true,
      data: user,
      message: "Lấy thông tin người dùng thành công",
    };
  }

  async findByGoogleId(googleId: string): Promise<ApiResponse<JwtPayload>> {
    const user = await this.userModel.findOne({ googleId }).exec();
    if (!user) {
      throw new NotFoundException("Người dùng với Google ID này không tồn tại");
    }
    return {
      success: true,
      message: "Lấy thông tin người dùng thành công",
      data: {
        email: user.email,
        userId: String(user._id),
        type: user.type,
        name: user.name,
      },
    };
  }

  async findByEmail(email: string): Promise<ApiResponse<User | null>> {
    const user = await this.userModel.findOne({ email }).exec();
    return {
      success: true,
      data: user,
      message: user
        ? "Lấy thông tin người dùng thành công"
        : "Người dùng không tồn tại",
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("ID người dùng không hợp lệ");
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async remove(id: string): Promise<ApiResponse<User>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("ID người dùng không hợp lệ");
    }
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return {
      success: true,
      data: user,
      message: "Xóa người dùng thành công",
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    console.log("User found:", user);
    if (!user || !user.password) {
      throw new NotFoundException("Tài khoản không tồn tại");
    }
    if (!user.isActive) {
      throw new ForbiddenException("Tài khoản chưa được kích hoạt");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Sai mật khẩu");
    }
    return user;
  }

  async changePassword(
    id: string,
    { oldPass, newPass }: { oldPass: string; newPass: string }
  ): Promise<ApiResponse<User>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("ID người dùng không hợp lệ");
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Mật khẩu cũ không đúng");
    }
    const hashedNewPass = await bcrypt.hash(newPass, 10);
    await this.userModel.findByIdAndUpdate(
      id,
      { $set: { password: hashedNewPass } },
      { new: true }
    );
    return {
      success: true,
      data: user,
      message: "Đổi mật khẩu thành công",
    };
  }
}
