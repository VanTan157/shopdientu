import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { EUserType } from "src/common/types/user.types";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post("verify")
  async verifyCode(@Body() body: { email: string; code: string }) {
    return this.usersService.verifyCode(body.email, body.code);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserType.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserType.ADMIN)
  @Get("search")
  async searchUsers(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.usersService.paginationSearch(pageNum, limitNum, search);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Patch("change-password/:id")
  changPassword(
    @Param("id") id: string,
    @Body() { oldPass, newPass }: { newPass: string; oldPass: string }
  ) {
    return this.usersService.changePassword(id, { oldPass, newPass });
  }
  @Post("send-code-again")
  async sendCode(@Body("email") email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.usersService.sendConfirmationCode(email, code);
    return { message: "Đã gửi lại mã xác nhận đến email!", success: true };
  }
}
