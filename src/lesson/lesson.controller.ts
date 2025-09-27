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
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { Role } from "@/lib/roles";

import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../auth/roles/role.decorator";
import { RoleGuard } from "../auth/roles/role.guard";
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async findAll() {
    return await this.lessonService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get lesson by id",
    description: "Retrieve a lesson by its id",
  })
  @ApiResponse({
    status: 200,
    description: "The lesson with the specified id.",
  })
  @ApiResponse({
    status: 404,
    description: "Lesson with given id not found",
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async findOne(@Param("id") id: string) {
    return await this.lessonService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update lesson",
    description: "Update lesson by id",
  })
  @ApiResponse({
    status: 200,
    description: "Lesson Updated",
    type: [UpdateLessonDto],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param("id") id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return await this.lessonService.update(id, updateLessonDto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete lesson",
    description: "Delete lesson by id",
  })
  @ApiResponse({
    status: 204,
    description: "Lesson deleted",
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async remove(@Param("id") id: string) {
    return await this.lessonService.remove(id);
  }
}
