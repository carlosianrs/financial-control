import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/infra/database/database.module";
import { PlanningsController } from "./plannings.controller";
import { PlanningsService } from "./plannings.service";

@Module({
  imports: [DatabaseModule],
  controllers: [PlanningsController],
  providers: [PlanningsService],
})
export class PlanningsModule {}