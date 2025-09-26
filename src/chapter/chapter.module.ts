import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { PrismaService } from "../prisma/prisma.service";
import { ChapterController } from "./chapter.controller";
import { ChapterService } from "./chapter.service";

@Module({
  controllers: [ChapterController],
  providers: [ChapterService, PrismaService],
  imports: [AuthModule],
})
export class ChapterModule {}
