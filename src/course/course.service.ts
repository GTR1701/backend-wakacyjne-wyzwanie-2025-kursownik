import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CourseService {
  constructor(private database: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    return this.database.course.create({
      data: {
        name: createCourseDto.name,
        description: createCourseDto.description,
        imageSrc: createCourseDto.imageSrc,
      },
    });
  }

  async findAll() {
    return this.database.course.findMany();
  }

  async findOne(id: string) {
    const course = await this.database.course.findUnique({
      where: { id },
    });

    if (course == null) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    const chapters = await this.database.chapter.findMany({
      where: { courseId: course.id },
    });

    return {
      id: course.id,
      name: course.name,
      description: course.description,
      imageSrc: course.imageSrc,
      chapters,
    };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.database.course.findUnique({
      where: { id },
    });

    if (course === null) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    return await this.database.course.update({
      where: { id },
      data: {
        name: updateCourseDto.name,
        description: updateCourseDto.description,
        imageSrc: updateCourseDto.imageSrc,
      },
    });
  }

  async remove(id: string) {
    const course = await this.database.course.findUnique({
      where: { id },
    });

    if (course === null) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    return this.database.course.delete({
      where: { id },
    });
  }
}
