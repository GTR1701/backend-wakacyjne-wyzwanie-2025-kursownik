import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";

@Module({
  controllers: [LessonController],
  providers: [LessonService],
  imports: [DatabaseModule],
})
export class LessonModule {}
