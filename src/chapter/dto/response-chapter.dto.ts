import { Lesson } from "@prisma/client";
import { IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class ResponseChapterDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsString()
  courseId: string;

  @ApiProperty()
  lessons: Lesson[];
}
