import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChapterModule } from "./chapter/chapter.module";
import { DatabaseModule } from "./database/database.module";
import { LessonModule } from "./lesson/lesson.module";

@Module({
  imports: [DatabaseModule, LessonModule, ChapterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
