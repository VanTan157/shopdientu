import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
