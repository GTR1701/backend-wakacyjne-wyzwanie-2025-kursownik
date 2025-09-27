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
  Request,
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
import { UserMetadata } from "../user/dto/user-metadata.dto";
import { ChapterService } from "./chapter.service";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";

@ApiTags("chapter")
@Controller("chapter")
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create chapter",
    description: "Create a new chapter with the provided details.",
  })
  @ApiResponse({
    status: 201,
    description: "The chapter has been created.",
    type: CreateChapterDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.create(createChapterDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get all chapters",
    description: "Retrieve a list of all chapters",
  })
  @ApiResponse({
    status: 200,
    description: "A list of chapters.",
    type: [CreateChapterDto],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async findAll(@Request() request: { user: UserMetadata }) {
    return this.chapterService.findAll(request.user.email);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get chapter by id",
    description: "Retrieve a chapter by its unique id",
  })
  @ApiResponse({
    status: 200,
    description: "Chapter found.",
    type: CreateChapterDto,
  })
  @ApiResponse({
    status: 404,
    description: "Chapter not found.",
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async findOne(
    @Param("id") id: string,
    @Request() request: { user: UserMetadata },
  ) {
    return this.chapterService.findOne(request.user.email, id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Update chapter",
    description: "Update chapter details by id",
  })
  @ApiResponse({
    status: 200,
    description: "Chapter updated.",
    type: UpdateChapterDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param("id") id: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chapterService.update(id, updateChapterDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete chapter",
    description: "Delete chapter by id",
  })
  @ApiResponse({
    status: 204,
    description: "Chapter deleted.",
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async remove(@Param("id") id: string) {
    return this.chapterService.remove(id);
  }
}
