import { IsOptional, IsString } from "class-validator";

export class GetUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  user_id?: string;
}