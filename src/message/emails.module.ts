import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { DatabaseModule } from 'src/database/database.module';
import { VerificationModule } from 'src/verification/verification.module';

@Module({
  providers: [EmailService],
  exports: [EmailService],
  imports: [DatabaseModule, VerificationModule],
})
export class EmailsModule {}
