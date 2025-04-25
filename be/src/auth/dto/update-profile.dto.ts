import { IsString, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiProperty({ description: "Tên của người dùng", example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: "Mật khẩu cũ", example: "oldPassword123" })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: "Mật khẩu mới", example: "newPassword123" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
