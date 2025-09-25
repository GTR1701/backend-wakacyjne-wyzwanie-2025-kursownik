import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonService } from "./lesson.service";

@Controller("lesson")
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async create(@Body() createLessonDto: CreateLessonDto) {
    return await this.lessonService.create(createLessonDto);
  }

  @Get()
  async findAll() {
    return await this.lessonService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.lessonService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return await this.lessonService.update(id, updateLessonDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.lessonService.remove(id);
  }
}
