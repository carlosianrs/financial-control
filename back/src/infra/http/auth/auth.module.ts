import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "src/infra/database/database.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleApiService } from "../services/google-apis/google-apis.service";
import { ServicesModule } from "../services/services.module";

@Module({
  imports: [JwtModule.register({ global: true }), DatabaseModule, ServicesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}