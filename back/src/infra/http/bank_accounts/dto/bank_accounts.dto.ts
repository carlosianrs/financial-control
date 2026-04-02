import { IsOptional, IsString } from "class-validator";

export class GetBankAccountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  icon_name?: string;
}

export class CreateBankAccountDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon_path?: string;

  @IsOptional()
  @IsString()
  icon_color?: string;
}