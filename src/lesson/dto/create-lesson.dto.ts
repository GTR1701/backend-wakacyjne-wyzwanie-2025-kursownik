import { IsNumber, IsOptional, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  chapterId: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  lessonOrder?: number;
}
