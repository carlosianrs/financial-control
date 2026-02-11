import { Module } from "@nestjs/common";
import { CategoriesModule } from "./categories/categories.module";
import { ReportsModule } from "./reports/reports.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    CategoriesModule,
    ReportsModule,
    UsersModule,
    AuthModule,
  ]
})
export class HttpModule {}