import { IsString, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "Loại người dùng",
    example: "USER",
    default: "USER",
  })
  @IsString()
  @IsOptional()
  type?: string;
}
