import {
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  ValidateNested,
  Min,
} from "class-validator";
import { Transform, Type } from "class-transformer";

class UpdateTabletCameraDto {
  @IsString()
  rear: string;

  @IsString()
  front: string;
}

class UpdateTabletSpecificationsDto {
  @IsNumber()
  @Min(0)
  screenSize: number;

  @IsString()
  resolution: string;

  @IsNumber()
  @Min(0)
  refreshRate: number;

  @IsString()
  simType: string;

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
  @Type(() => UpdateTabletCameraDto)
  camera: UpdateTabletCameraDto;
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

export class UpdateTabletDto {
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
  @IsNumber()
  @Min(0)
  promotion: number;

  @IsString()
  description: string;

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateColorVariantDto)
  colorVariants: UpdateColorVariantDto[];

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
  @IsArray()
  @IsString({ each: true })
  accessories: string[];

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
  @IsArray()
  @IsString({ each: true })
  tags: string[];

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
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateDimensionsDto)
  dimensions: UpdateDimensionsDto;

  @IsString()
  warranty: string;

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
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateTabletSpecificationsDto)
  specifications: UpdateTabletSpecificationsDto;
}
