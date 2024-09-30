import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subject {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @Column({ type: 'varchar', length: 256 })
  name: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @Column({ type: 'varchar', length: 256, default: '-' })
  variant: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @Column({ type: 'integer' })
  labs_done: number;
  @ApiProperty()
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @Column({ type: 'integer' })
  labs_all: number;
}
