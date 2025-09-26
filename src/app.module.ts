import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChapterModule } from "./chapter/chapter.module";
import { CourseModule } from "./course/course.module";
import { LessonModule } from "./lesson/lesson.module";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [LessonModule, ChapterModule, CourseModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
