import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { PrismaService } from "../prisma/prisma.service";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";

@Module({
  controllers: [LessonController],
  providers: [LessonService, PrismaService],
  imports: [AuthModule],
})
export class LessonModule {}
