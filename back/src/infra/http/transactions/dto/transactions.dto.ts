import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TransactionType } from "src/infra/database/firestore/types/transactions.type";

export class GetTransactionDto {
  @IsOptional()
  @IsEnum(TransactionType)
  @IsString()
  type: TransactionType;

  @IsOptional()
  @IsString()
  category_id: string;

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

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  @IsString()
  type: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  status: string;

  @IsString()
  category_id: string;

  @IsString()
  bank_account_id: string;
 
  @IsDateString()
  payment_date: string;
}