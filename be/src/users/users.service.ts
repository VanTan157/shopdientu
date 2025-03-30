import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./entities/user.entity";
import { Model, Types } from "mongoose";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (user) {
      throw new NotFoundException("User already exists");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds
    );
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async paginationSearch(
    page: number = 1, // Trang mặc định là 1
    limit: number = 10, // Số lượng bản ghi mỗi trang mặc định là 10
    search?: string // Từ khóa tìm kiếm (tùy chọn)
  ): Promise<{
    users: User[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    // Chuẩn hóa tham số page và limit
    const currentPage = Math.max(1, page); // Đảm bảo page không nhỏ hơn 1
    const itemsPerPage = Math.max(1, limit); // Đảm bảo limit không nhỏ hơn 1
    const skip = (currentPage - 1) * itemsPerPage; // Số bản ghi cần bỏ qua

    // Điều kiện tìm kiếm
    const query: any = {};
    if (search) {
      // Tìm kiếm không phân biệt hoa thường trên email hoặc name
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    // Lấy tổng số bản ghi
    const totalItems = await this.userModel.countDocuments(query).exec();

    // Lấy danh sách người dùng với phân trang
    const users = await this.userModel
      .find(query)
      .skip(skip)
      .limit(itemsPerPage)
      .exec();

    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Trả về kết quả
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
      throw new NotFoundException("ID không hợp lệ");
    }
    const user = await this.userModel.findById({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException("Không tìm thấy người dùng");
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("ID không hợp lệ");
    }
    const user = await this.userModel
      .findByIdAndUpdate({ _id: id }, { $set: updateUserDto }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException("Không tìm thấy người dùng");
    }
    return user;
  }

  async remove(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("ID không hợp lệ");
    }
    const user = await this.userModel.findByIdAndDelete({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException("Không tìm thấy người dùng");
    }
    return user;
  }
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException("Email không chính xác");
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw new NotFoundException("Mật khẩu không chính xác");
    }
    return user;
  }
}
