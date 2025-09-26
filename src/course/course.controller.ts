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
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@ApiTags("course")
@Controller("course")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create course",
    description: "Create a new course with the provided details.",
  })
  @ApiResponse({
    status: 201,
    description: "The course has been created.",
    type: CreateCourseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get all courses",
    description: "Retrieve a list of all courses.",
  })
  @ApiResponse({
    status: 200,
    description: "A list of courses.",
    type: [CreateCourseDto],
  })
  async findAll() {
    return this.courseService.findAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get course by id",
    description: "Retrieve a course by its unique id.",
  })
  @ApiResponse({
    status: 200,
    description: "Course found.",
    type: CreateCourseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Course not found.",
  })
  async findOne(@Param("id") id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Update course",
    description: "Update course details by id.",
  })
  @ApiResponse({
    status: 200,
    description: "Course updated.",
    type: UpdateCourseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param("id") id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete course",
    description: "Delete course by id.",
  })
  @ApiResponse({
    status: 204,
    description: "Course deleted.",
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async remove(@Param("id") id: string) {
    return this.courseService.remove(id);
  }
}
