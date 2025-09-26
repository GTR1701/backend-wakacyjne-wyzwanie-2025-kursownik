import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";

@Module({
  controllers: [LessonController],
  providers: [LessonService],
  imports: [DatabaseModule, AuthModule],
})
export class LessonModule {}
