import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";

@Injectable()
export class LessonService {
  constructor(private database: PrismaService) {}
  async create(createLessonDto: CreateLessonDto) {
    return await this.database.lesson.create({
      data: {
        name: createLessonDto.name,
        description: createLessonDto.description,
        chapterId: createLessonDto.chapterId,
      },
    });
  }

  async findAll() {
    return await this.database.lesson.findMany();
  }

  async findOne(id: string) {
    const lesson = await this.database.lesson.findUnique({
      where: { id },
    });

    if (lesson === null) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    } else {
      return lesson;
    }
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.database.lesson.findUnique({
      where: { id },
    });

    if (lesson === null) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    }

    if (updateLessonDto.chapterId != null) {
      const chapter = await this.database.chapter.findUnique({
        where: { id: updateLessonDto.chapterId },
      });
      if (chapter == null) {
        throw new NotFoundException(
          `Chapter with id ${updateLessonDto.chapterId} not found`,
        );
      }
    }

    return await this.database.lesson.update({
      where: { id },
      data: {
        name: updateLessonDto.name,
        description: updateLessonDto.description,
        chapterId: updateLessonDto.chapterId,
      },
    });
  }

  async remove(id: string) {
    const lesson = await this.database.lesson.findUnique({
      where: { id },
    });

    if (lesson === null) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    }

    return this.database.lesson.delete({
      where: { id },
    });
  }
}
