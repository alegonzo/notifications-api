import { ApiProperty } from '@nestjs/swagger';
import { ChildEntity, Column } from 'typeorm';
import { Metadata } from './metadata.entity';

@ChildEntity()
export class SystemMetadata extends Metadata {
  @ApiProperty()
  @Column()
  uuid: string;
}
