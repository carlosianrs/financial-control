import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ReportType } from "src/infra/database/firestore/types/reports.type";

export class GetReportDto {
  @IsString()
  user_id: string;

  @IsOptional()
  @IsEnum(ReportType)
  @IsString()
  type: ReportType;

  @IsOptional()
  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category_id: string;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDateString()
  report_date: Date;
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

  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDateString()
  report_date: Date;
}