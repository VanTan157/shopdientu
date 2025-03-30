import {
  IsString,
  IsNumber,
  IsMongoId,
  IsArray,
  IsObject,
  IsOptional,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateMobileDto {
  @IsString()
  name: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  StartingPrice: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  promotion?: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsMongoId()
  mobile_type_id: string;

  @IsObject()
  @IsOptional()
  @Transform(
    ({ value }) => (typeof value === "string" ? JSON.parse(value) : value),
    { toClassOnly: true }
  )
  specifications: {
    screenSize: number;
    resolution: string;
    cpu: string;
    ram: number;
    storage: number;
    battery: number;
    os: string;
  };

  @IsArray()
  @IsObject({ each: true })
  @Transform(
    ({ value }) => (typeof value === "string" ? JSON.parse(value) : value),
    { toClassOnly: true }
  )
  colorVariants: { color: string; image?: string; stock: number }[];

  @IsObject()
  @IsOptional()
  @Transform(
    ({ value }) => (typeof value === "string" ? JSON.parse(value) : value),
    { toClassOnly: true }
  )
  camera: {
    rear: string;
    front: string;
  };

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  weight: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(
    ({ value }) => (typeof value === "string" ? JSON.parse(value) : value),
    { toClassOnly: true }
  )
  tags?: string[];
}
