import { IsOptional, IsString } from "class-validator";

export class GetCategoryDto {
  @IsOptional()
  @IsString()
  name: string;
}