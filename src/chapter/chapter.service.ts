import { DatabaseService } from "src/database/database.service";

import { Injectable, NotFoundException } from "@nestjs/common";

import { CreateChapterDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";

@Injectable()
export class ChapterService {
  constructor(private database: DatabaseService) {}
  async create(createChapterDto: CreateChapterDto) {
    return await this.database.chapter.create({
      data: {
        name: createChapterDto.name,
        description: createChapterDto.description,
        courseId: createChapterDto.courseId,
      },
    });
  }

  async findAll() {
    return await this.database.chapter.findMany();
  }

  async findOne(id: string) {
    const chapter = await this.database.chapter.findUnique({
      where: { id },
    });

    if (chapter === null) {
      throw new NotFoundException(`Chapter with id ${id} not found`);
    } else {
      return chapter;
    }
  }

  async update(id: string, updateChapterDto: UpdateChapterDto) {
    const chapter = await this.database.chapter.findUnique({
      where: { id },
    });

    if (chapter === null) {
      throw new NotFoundException(`Chapter with id ${id} not found`);
    }

    if (updateChapterDto.courseId != null) {
      const course = await this.database.course.findUnique({
        where: { id: updateChapterDto.courseId },
      });
      if (course == null) {
        throw new NotFoundException(
          `Course with id ${updateChapterDto.courseId} not found`,
        );
      }
    }

    return await this.database.chapter.update({
      where: { id },
      data: {
        name: updateChapterDto.name,
        description: updateChapterDto.description,
        courseId: updateChapterDto.courseId,
      },
    });
  }

  async remove(id: string) {
    const chapter = await this.database.chapter.findUnique({
      where: { id },
    });

    if (chapter === null) {
      throw new NotFoundException(`Chapter with id ${id} not found`);
    }

    return this.database.chapter.delete({
      where: { id },
    });
  }
}
