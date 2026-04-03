import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  icon_name?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value) || null)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  nextDate?: string;

  @IsOptional()
  @IsString()
  nextId?: string;
}

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
  
  @IsOptional()
  @IsString()
  icon_name?: string;

  @IsOptional()
  @IsString()
  icon_color?: string;
}