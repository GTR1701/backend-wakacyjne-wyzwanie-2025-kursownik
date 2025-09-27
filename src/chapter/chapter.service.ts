import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { ResponseChapterDto } from "./dto/response-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";

@Injectable()
export class ChapterService {
  constructor(private database: PrismaService) {}
  async create(createChapterDto: CreateChapterDto) {
    const course = await this.database.course.findUnique({
      where: { id: createChapterDto.courseId },
    });
    if (course == null) {
      throw new NotFoundException(
        `Course with id ${createChapterDto.courseId} not found`,
      );
    }
    return await this.database.chapter.create({
      data: {
        name: createChapterDto.name,
        description: createChapterDto.description,
        courseId: createChapterDto.courseId,
        chapterOrder:
          createChapterDto.chapterOrder ??
          (await this.nextChapterOrder(createChapterDto.courseId)),
      },
    });
  }

  async findAll(email: string) {
    const chapters = await this.database.chapter.findMany();
    return chapters.filter(
      (chapter) =>
        this.isPremium(email, chapter.courseId) || chapter.chapterOrder <= 2,
    );
  }

  async findOne(email: string, id: string): Promise<ResponseChapterDto> {
    const chapter = await this.database.chapter.findUnique({
      where: { id },
    });

    if (chapter == null) {
      throw new NotFoundException(`Chapter with id ${id} not found`);
    }
    if (!this.isPremium(email, chapter.courseId) && chapter.chapterOrder > 2) {
      throw new UnauthorizedException(
        "You must be a premium user to access this chapter",
      );
    }

    const lessons = await this.database.lesson.findMany({
      where: { chapterId: chapter.id },
    });

    return {
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      courseId: chapter.courseId,
      lessons,
    };
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
        chapterOrder: updateChapterDto.chapterOrder,
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
  private async nextChapterOrder(courseId: string): Promise<number> {
    interface AggregateResult {
      _max: { chapterOrder: number | null };
    }
    const result: AggregateResult = await this.database.chapter.aggregate({
      where: { courseId },
      _max: {
        chapterOrder: true,
      },
    });
    return (result._max.chapterOrder ?? 0) + 1;
  }
  private isPremium(_email: string, _courseId: string): boolean {
    return true;
  }
}
