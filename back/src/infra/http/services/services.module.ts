import { Module } from "@nestjs/common";
import { GoogleApiService } from "./google-apis/google-apis.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [GoogleApiService],
  exports: [GoogleApiService],
})
export class ServicesModule {};