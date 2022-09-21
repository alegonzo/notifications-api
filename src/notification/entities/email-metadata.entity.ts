import { ChildEntity, Column } from 'typeorm';
import { EmailProvider } from '../enums/email-provider.enum';
import { Metadata } from './metadata.entity';

@ChildEntity()
export class EmailMetadata extends Metadata {
  @Column()
  email: string;

  @Column()
  provider: EmailProvider;
}
