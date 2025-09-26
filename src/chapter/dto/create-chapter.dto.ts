import { IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateChapterDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsString()
  courseId: string;
}
