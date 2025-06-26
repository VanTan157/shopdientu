import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./entities/user.entity";
import { Model, Types } from "mongoose";
import * as bcrypt from "bcrypt";
import { MailService } from "src/mail/mail.service";
import { error } from "console";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
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
      throw new ConflictException("Email or Google ID already exists");
    }

    const saltRounds = 10;
    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, saltRounds)
      : undefined;

    let code: string | undefined;
    let expireAt: Date | undefined;
    let isActive = false;

    // Nếu đăng ký bằng Google, kích hoạt tài khoản ngay
    if (createUserDto.googleId) {
      isActive = true;
    } else {
      // Nếu đăng ký thông thường, tạo mã xác nhận và gửi email
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
    return newUser.save();
  }

  async verifyCode(email: string, code: string): Promise<User> {
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

    // Kích hoạt tài khoản
    user.isActive = true;
    user.code = ""; // Xóa mã sau khi xác nhận
    user.expireAt = undefined; // Xóa thời gian hết hạn
    await user.save();

    return user;
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
  ): Promise<{
    users: User[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
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
      users,
      totalItems,
      totalPages,
      currentPage,
    };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid user ID11");
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid user ID");
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async remove(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid user ID");
    }
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user || !user.password) {
      throw new UnauthorizedException("Tài khoản không tồn tại");
    }
    if (!user.isActive) {
      throw new UnauthorizedException("Tài khoản chưa được kích hoạt");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Sai mật khẩu");
    }
    return user;
  }

  async changPassword(
    id: string,
    { oldPass, newPass }: { oldPass: string; newPass: string }
  ): Promise<{} | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid user ID");
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
    return user;
  }
}
