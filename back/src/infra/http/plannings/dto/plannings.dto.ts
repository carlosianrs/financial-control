import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetPlanningDto {
  @IsOptional()
  @IsString()
  category_id?: string;

  @IsString()
  month: string;

  @IsString()
  year: string;

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

export class CreatePlanningDto {
  @IsString()
  category_id: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  value: number;
  
  @IsString()
  month: string;

  @IsString()
  year: string;
}