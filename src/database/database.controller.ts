import { Course } from "@prisma/client";

import { Controller, Get, Post } from "@nestjs/common";

import { DatabaseService } from "./database.service";

@Controller("database")
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post()
  async create(): Promise<Course> {
    return await this.databaseService.course.create({
      data: {
        name: "test",
        description: "test",
        imageSrc: "test",
      },
    });
  }

  @Get()
  async findAll(): Promise<Course[]> {
    return await this.databaseService.course.findMany();
  }
}
