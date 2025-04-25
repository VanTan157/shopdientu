import {
  Injectable,
  NotFoundException,
  ConflictException,
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
    const existingUser = await this.userModel
      .findOne({
        $or: [
          { email: createUserDto.email },
          createUserDto.googleId ? { googleId: createUserDto.googleId } : {},
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

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
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
    console.log("findOne", id);
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Sai mật khẩu");
    }
    return user;
  }
}
