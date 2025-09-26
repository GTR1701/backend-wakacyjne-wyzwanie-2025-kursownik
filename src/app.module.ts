import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChapterModule } from "./chapter/chapter.module";
import { CourseModule } from "./course/course.module";
import { DatabaseModule } from "./database/database.module";
import { LessonModule } from "./lesson/lesson.module";

@Module({
  imports: [DatabaseModule, LessonModule, ChapterModule, CourseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
