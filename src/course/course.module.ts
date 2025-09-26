import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { PrismaService } from "../prisma/prisma.service";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";

@Module({
  controllers: [CourseController],
  providers: [CourseService, PrismaService],
  imports: [AuthModule],
})
export class CourseModule {}
