import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "src/infra/database/database.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [JwtModule.register({ global: true }), DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}