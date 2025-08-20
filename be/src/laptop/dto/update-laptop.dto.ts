import {
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  ValidateNested,
  Min,
} from "class-validator";
import { Transform, Type } from "class-transformer";

class UpdateLaptopCameraDto {
  @IsString()
  rear: string;

  @IsString()
  front: string;
}

class UpdateLaptopSpecificationsDto {
  @IsNumber()
  @Min(0)
  screenSize: number;

  @IsString()
  resolution: string;

  @IsNumber()
  @Min(0)
  refreshRate: number;

  @IsString()
  cpu: string;

  @IsString()
  gpu: string;

  @IsNumber()
  @Min(0)
  ram: number;

  @IsNumber()
  @Min(0)
  storage: number;

  @IsNumber()
  @Min(0)
  battery: number;

  @IsString()
  os: string;

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateLaptopCameraDto)
  camera: UpdateLaptopCameraDto;
}

class UpdateColorVariantDto {
  @IsString()
  color: string;

  @IsString()
  image: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  hasNewImage: string;
}

class UpdateDimensionsDto {
  @IsNumber()
  @Min(0)
  length: number;

  @IsNumber()
  @Min(0)
  width: number;

  @IsNumber()
  @Min(0)
  height: number;

  @IsNumber()
  @Min(0)
  weight: number;
}

export class UpdateLaptopDto {
  @IsString()
  brand: string;

  @IsString()
  name: string;

  @Transform(({ value }) => {
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  startingPrice: number;

  @Transform(({ value }) => {
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  promotion: number;

  @IsString()
  description: string;

  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateColorVariantDto)
  colorVariants: UpdateColorVariantDto[];

  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(",").map((item) => item.trim());
      }
    }
    return value;
  })
  @IsString({ each: true })
  accessories: string[];

  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(",").map((item) => item.trim());
      }
    }
    return value;
  })
  @IsString({ each: true })
  tags: string[];

  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @ValidateNested()
  @Type(() => UpdateDimensionsDto)
  dimensions: UpdateDimensionsDto;

  @IsString()
  warranty: string;

  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @ValidateNested()
  @Type(() => UpdateLaptopSpecificationsDto)
  specifications: UpdateLaptopSpecificationsDto;
}
