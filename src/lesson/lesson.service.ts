import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";

@Injectable()
export class LessonService {
  constructor(private database: PrismaService) {}
  async create(createLessonDto: CreateLessonDto) {
    if (
      (await this.database.chapter.findUnique({
        where: { id: createLessonDto.chapterId },
      })) == null
    ) {
      throw new NotFoundException(`ChapterId is required`);
    }

    return await this.database.lesson.create({
      data: {
        name: createLessonDto.name,
        description: createLessonDto.description,
        chapterId: createLessonDto.chapterId,
        lessonOrder:
          createLessonDto.lessonOrder ??
          (await this.nextLessonOrder(createLessonDto.chapterId)),
      },
    });
  }

  async findAll(email: string) {
    const lessons = await this.database.lesson.findMany();

    return lessons.filter(
      (lesson) =>
        this.isPremium(email, lesson.chapterId) || lesson.lessonOrder <= 2,
    );
  }

  async findOne(email: string, id: string) {
    const lesson = await this.database.lesson.findUnique({
      where: { id },
    });

    if (lesson == null) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    }
    const chapter = await this.database.chapter.findUnique({
      where: { id: lesson.chapterId },
    });
    if (chapter == null) {
      throw new NotFoundException(
        `Chapter with id ${lesson.chapterId} not found`,
      );
    }
    if (!this.isPremium(email, lesson.chapterId) && chapter.chapterOrder > 2) {
      throw new UnauthorizedException(
        "You must be a premium user to access this lesson",
      );
    }

    return lesson;
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
        lessonOrder: updateLessonDto.lessonOrder,
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

  private async nextLessonOrder(chapterId: string): Promise<number> {
    interface AggregateResult {
      _max: { lessonOrder: number | null };
    }
    const result: AggregateResult = await this.database.lesson.aggregate({
      where: { chapterId },
      _max: {
        lessonOrder: true,
      },
    });
    return (result._max.lessonOrder ?? 0) + 1;
  }

  private isPremium(_email: string, _chapterId: string): boolean {
    return true;
  }
}
