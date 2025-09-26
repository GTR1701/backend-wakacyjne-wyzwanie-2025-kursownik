import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonService } from "./lesson.service";

@ApiTags("lesson")
@Controller("lesson")
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create lesson",
    description: "Create a new lesson with the provided details.",
  })
  @ApiResponse({
    status: 201,
    description: "The lesson has been created.",
    type: CreateLessonDto,
  })
  @ApiResponse({
    status: 404,
    description: `Chapter with given  id  not found`,
  })
  async create(@Body() createLessonDto: CreateLessonDto) {
    return await this.lessonService.create(createLessonDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get all lessons",
    description: "Retrieve a list of all lessons",
  })
  @ApiResponse({
    status: 200,
    description: "A list of lessons.",
    type: [CreateLessonDto],
  })
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
