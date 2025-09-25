import { DatabaseModule } from "src/database/database.module";

import { Module } from "@nestjs/common";

import { ChapterController } from "./chapter.controller";
import { ChapterService } from "./chapter.service";

@Module({
  controllers: [ChapterController],
  providers: [ChapterService],
  imports: [DatabaseModule],
})
export class ChapterModule {}
