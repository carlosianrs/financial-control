import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ReportType } from "src/infra/database/firestore/types/reports.type";

export class GetReportDto {
  @IsOptional()
  @IsEnum(ReportType)
  @IsString()
  type: ReportType;

  @IsOptional()
  @IsString()
  category_id: string;

  @IsString()
  month_year: string;

  @IsOptional()
  @Transform(({ value }) => Number(value) || null)
  @IsNumber()
  limit?: number;
  
  @IsOptional()
  @IsString()
  nextCreatedAt?: string;

  @IsOptional()
  @IsString()
  nextId?: string;
}

export class CreateReportDto {
  @IsEnum(ReportType)
  @IsString()
  type: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category_id: string;

  @IsString()
  bank_account_id: string;

  @IsNumber()
  day: number;
  
  @IsString()
  month_year: string;
}