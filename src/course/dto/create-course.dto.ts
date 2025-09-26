import { IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  imageSrc: string;
}
