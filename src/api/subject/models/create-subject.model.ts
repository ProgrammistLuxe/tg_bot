import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectModel {
  @ApiProperty()
  name: string;
  @ApiProperty()
  variant: string;
  @ApiProperty()
  labs_done: number;
  @ApiProperty()
  labs_all: number;
}
