import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsObject,
  ValidateNested,
  Min,
} from "class-validator";
import { Transform, Type } from "class-transformer";

class UpdateHeadphoneSpecificationsDto {
  @IsString()
  driverType: string;

  @IsNumber()
  @Min(0)
  driverSize: number;

  @IsString()
  frequencyRange: string;

  @IsNumber()
  @Min(0)
  impedance: number;

  @IsString()
  noiseCancellation: string;

  @IsNumber()
  @Min(0)
  batteryLife: number;

  @IsNumber()
  @Min(0)
  chargingTime: number;

  @IsString()
  chargingPort: string;

  @IsBoolean()
  microphone: boolean;

  @IsString()
  connectivity: string;
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

export class UpdateHeadphoneDto {
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
  @Type(() => UpdateHeadphoneSpecificationsDto)
  specifications: UpdateHeadphoneSpecificationsDto;
}
