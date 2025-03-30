import { Transform } from "class-transformer";
import {
  IsString,
  IsNumber,
  IsMongoId,
  IsArray,
  IsObject,
  IsOptional,
} from "class-validator";

export class UpdateMobileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  StartingPrice?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  promotion?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsOptional()
  mobile_type_id?: string;

  @IsObject()
  @IsOptional()
  specifications?: {
    screenSize?: number;
    resolution?: string;
    cpu?: string;
    ram?: number;
    storage?: number;
    battery?: number;
    os?: string;
  };

  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  colorVariants?: { color: string; image?: string; stock?: number }[];

  @IsObject()
  @IsOptional()
  camera?: {
    rear?: string;
    front?: string;
  };

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  weight?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
