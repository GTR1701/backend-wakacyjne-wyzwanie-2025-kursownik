import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { PrismaService } from "../prisma/prisma.service";
import { ForexController } from "./forex.controller";
import { ForexService } from "./forex.service";

@Module({
  imports: [AuthModule],
  controllers: [ForexController],
  providers: [ForexService, PrismaService],
  exports: [ForexService],
})
export class ForexModule {}
