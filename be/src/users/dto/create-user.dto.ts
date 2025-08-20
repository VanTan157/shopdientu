import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EUserType } from "src/common/types/user.types";

export class CreateUserDto {
  @ApiProperty({ description: "Tên của người dùng", example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Email của người dùng",
    example: "john@gmail.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Mật khẩu của người dùng",
    example: "password123",
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: "Loại người dùng",
    default: EUserType.USER,
  })
  @IsEnum(EUserType)
  @IsOptional()
  type?: EUserType;

  @IsString()
  @IsOptional()
  googleId?: string;
}
