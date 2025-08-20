import { IsString, IsEmail, IsOptional } from "class-validator";
import { EUserType } from "src/common/types/user.types";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  @IsOptional()
  type?: EUserType;

  @IsString()
  @IsOptional()
  googleId?: string;
}
